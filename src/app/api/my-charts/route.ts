import { NextResponse } from 'next/server';
import { db, dbEnabled, isEmail } from '@/lib/db';
import { myChartsEmail, sendEmail } from '@/lib/email';

/** Gửi danh sách link lá số về email. Luôn trả lời giống nhau để không lộ email nào có trong hệ thống. */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!isEmail(email)) return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 });
  if (!dbEnabled()) return NextResponse.json({ error: 'Máy chủ chưa cấu hình cơ sở dữ liệu.' }, { status: 503 });
  const e = email.trim().toLowerCase();
  const { data } = await db()
    .from('charts')
    .select('id,display_name,created_at')
    .eq('email', e)
    .order('created_at', { ascending: false })
    .limit(20);
  if (data?.length) {
    const mail = myChartsEmail(data);
    await sendEmail({ to: e, ...mail, kind: 'my_charts' }).catch(() => false);
  }
  return NextResponse.json({ ok: true });
}
