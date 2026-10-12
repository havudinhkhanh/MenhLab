import { NextResponse } from 'next/server';
import { dbEnabled, isEmail } from '@/lib/db';
import { verifyLoginCode } from '@/lib/login';
import { safeNext, setSession } from '@/lib/auth';

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { email?: string; code?: string; next?: string };
  if (!isEmail(b.email)) return NextResponse.json({ error: 'Email chưa đúng định dạng.' }, { status: 400 });
  if (!dbEnabled()) return NextResponse.json({ error: 'Máy chủ chưa cấu hình cơ sở dữ liệu.' }, { status: 503 });
  const r = await verifyLoginCode(b.email, String(b.code ?? '').trim());
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
  return setSession(NextResponse.json({ ok: true, next: safeNext(b.next) }), r.email);
}
