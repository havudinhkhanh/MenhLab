import { NextResponse } from 'next/server';
import { dbEnabled, isEmail } from '@/lib/db';
import { requestLoginCode } from '@/lib/login';
import { safeNext } from '@/lib/auth';

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { email?: string; consent?: boolean; next?: string };
  if (!isEmail(b.email)) return NextResponse.json({ error: 'Email chưa đúng định dạng.' }, { status: 400 });
  if (b.consent !== true) return NextResponse.json({ error: 'Vui lòng đánh dấu ô đồng ý để nhận mã đăng nhập.' }, { status: 400 });
  if (!dbEnabled()) return NextResponse.json({ error: 'Máy chủ chưa cấu hình cơ sở dữ liệu.' }, { status: 503 });
  const r = await requestLoginCode(b.email, {
    next: safeNext(b.next),
    ua: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
  });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json(r);
}
