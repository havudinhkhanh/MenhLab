import 'server-only';
import { db } from './db';
import { receiptEmail, sendEmail } from './email';

/** Đánh dấu đơn đã thanh toán và mở khóa Pro. Gọi được nhiều lần (idempotent). */
export async function markPaid(orderCode: number, raw: unknown, status: 'paid' | 'manual' = 'paid') {
  const sb = db();
  const { data: order } = await sb.from('orders').select('*').eq('order_code', orderCode).maybeSingle();
  if (!order) return { ok: false, reason: 'not_found' as const };
  if (order.status === 'paid' || order.status === 'manual') return { ok: true, already: true };

  const now = new Date().toISOString();
  await sb.from('orders').update({ status, paid_at: now, raw }).eq('order_code', orderCode);
  if (order.chart_id) {
    const { data: chart } = await sb
      .from('charts')
      .update({ is_pro: true, pro_at: now })
      .eq('id', order.chart_id)
      .select('id,email')
      .single();
    if (chart?.email) {
      const mail = receiptEmail(chart.id, order.amount, orderCode);
      await sendEmail({ to: chart.email, ...mail, chartId: chart.id, kind: 'receipt' }).catch(() => false);
    }
  }
  return { ok: true };
}
