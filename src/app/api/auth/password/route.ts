import { NextResponse } from 'next/server';
import { isEmail } from '@/lib/db';
import { safeNext, setSession } from '@/lib/auth';
import { checkTestPassword } from '@/lib/testAccount';

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { email?: string; password?: string; next?: string };
  if (!isEmail(b.email) || !checkTestPassword(b.email, String(b.password ?? ''))) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu chưa đúng.' }, { status: 400 });
  }
  return setSession(NextResponse.json({ ok: true, next: safeNext(b.next) }), b.email.trim().toLowerCase());
}
