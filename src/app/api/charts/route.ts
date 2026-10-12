import { NextResponse } from 'next/server';
import { BirthError, parseBirthInput, parseConventions } from '@/lib/engine/birth';
import { buildChart } from '@/lib/engine/chart';
import { db, dbEnabled, hashEmail, hashIp, isEmail } from '@/lib/db';
import { CONSENT_TEXT, CONSENT_VERSION } from '@/lib/config';
import { chartReadyEmail, sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  if (!dbEnabled()) return NextResponse.json({ error: 'Máy chủ chưa cấu hình cơ sở dữ liệu.' }, { status: 503 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!isEmail(email)) return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 });
  const consent = (body.consent ?? {}) as Record<string, unknown>;
  if (consent.processing !== true) {
    return NextResponse.json({ error: 'Cần sự đồng ý xử lý dữ liệu để lưu lá số.' }, { status: 400 });
  }

  let input, conventions;
  try {
    input = parseBirthInput(body.input);
    conventions = parseConventions(body.conventions);
    buildChart(input, conventions); // kiểm tra lập được lá số
  } catch (e) {
    const msg = e instanceof BirthError ? e.message : 'Thông tin sinh chưa hợp lệ.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const sb = db();
  // Chống spam đơn giản: tối đa 10 lá số / email / giờ
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await sb.from('charts').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', since);
  if ((count ?? 0) >= 10) return NextResponse.json({ error: 'Bạn đã lập quá nhiều lá số trong một giờ. Vui lòng thử lại sau.' }, { status: 429 });

  const now = new Date().toISOString();
  const marketing = consent.marketing === true;
  const research = consent.research === true;
  const { data, error } = await sb
    .from('charts')
    .insert({
      email,
      display_name: input.name ?? null,
      birth_input: input,
      conventions,
      consent_processing_at: now,
      consent_marketing: marketing,
      consent_marketing_at: marketing ? now : null,
      consent_research: research,
      consent_version: CONSENT_VERSION,
    })
    .select('id')
    .single();
  if (error || !data) return NextResponse.json({ error: 'Không lưu được lá số.' }, { status: 500 });

  const ua = req.headers.get('user-agent')?.slice(0, 300) ?? null;
  const ip = hashIp(req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null);
  await sb.from('consent_log').insert(
    (['processing', 'marketing', 'research'] as const).map((purpose) => ({
      chart_id: data.id,
      email_hash: hashEmail(email),
      purpose,
      granted: purpose === 'processing' ? true : purpose === 'marketing' ? marketing : research,
      consent_version: CONSENT_VERSION,
      consent_text: CONSENT_TEXT[purpose],
      user_agent: ua,
      ip_hash: ip,
    })),
  );

  const mail = chartReadyEmail(data.id, input.name ?? null);
  await sendEmail({ to: email, ...mail, chartId: data.id, kind: 'chart_ready' }).catch(() => false);

  return NextResponse.json({ id: data.id });
}
