import { NextResponse } from 'next/server';
import { verifyWebhook } from '@/lib/payos';
import { markPaid } from '@/lib/orders';

/** payOS gọi vào đây khi có giao dịch. Khai báo URL này trong my.payos.vn → Kênh thanh toán → Webhook. */
export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as { code?: string; data?: Record<string, unknown>; signature?: string } | null;
  if (!payload || !verifyWebhook(payload)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }
  const data = payload.data!;
  if (data.code === '00' && typeof data.orderCode === 'number') {
    await markPaid(data.orderCode, payload);
  }
  // Luôn trả 200 cho payload hợp lệ (kể cả payload thử khi xác nhận webhook)
  return NextResponse.json({ success: true });
}
