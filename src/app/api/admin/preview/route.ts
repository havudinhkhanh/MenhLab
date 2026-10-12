/**
 * Xem thử bản Pro cho quản trị viên: tính lá số đầy đủ ngay trên máy chủ, không lưu gì, không cần cơ sở dữ liệu.
 */
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin';
import { BirthError, parseBirthInput, parseConventions } from '@/lib/engine/birth';
import { computeReport } from '@/lib/report';

export async function POST(req: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: 'Phiên quản trị đã hết hạn — vui lòng đăng nhập lại ở /admin.' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { input?: unknown; conventions?: unknown };
  try {
    return NextResponse.json(computeReport(parseBirthInput(b.input), parseConventions(b.conventions), true));
  } catch (e) {
    return NextResponse.json({ error: e instanceof BirthError ? e.message : 'Thông tin sinh chưa hợp lệ.' }, { status: 400 });
  }
}
