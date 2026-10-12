import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';
import { config } from '@/lib/config';

export async function POST() {
  return clearSession(NextResponse.json({ ok: true }));
}
export async function GET() {
  return clearSession(NextResponse.redirect(`${config.siteUrl}/`));
}
