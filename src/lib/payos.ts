/**
 * payOS (payos.vn) — cổng thanh toán VietQR, miễn phí cho cá nhân/doanh nghiệp, tiền về thẳng tài khoản ngân hàng.
 * Gọi REST API trực tiếp, tự ký HMAC-SHA256 theo tài liệu payOS (không phụ thuộc SDK).
 */
import 'server-only';
import { createHmac } from 'node:crypto';
export { verifyWebhook } from './payos-verify';

const BASE = 'https://api-merchant.payos.vn';

export const payosEnabled = () =>
  !!(process.env.PAYOS_CLIENT_ID && process.env.PAYOS_API_KEY && process.env.PAYOS_CHECKSUM_KEY);

const hmac = (data: string) => createHmac('sha256', process.env.PAYOS_CHECKSUM_KEY!).update(data).digest('hex');

export async function createPaymentLink(args: {
  orderCode: number;
  amount: number;
  description: string; // tối đa 25 ký tự, không dấu cho chắc chắn
  returnUrl: string;
  cancelUrl: string;
  buyerEmail?: string;
}): Promise<{ checkoutUrl: string; paymentLinkId: string }> {
  const { orderCode, amount, description, returnUrl, cancelUrl } = args;
  const signature = hmac(
    `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`,
  );
  const res = await fetch(`${BASE}/v2/payment-requests`, {
    method: 'POST',
    headers: {
      'x-client-id': process.env.PAYOS_CLIENT_ID!,
      'x-api-key': process.env.PAYOS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
      buyerEmail: args.buyerEmail,
      items: [{ name: 'MenhLab Pro', quantity: 1, price: amount }],
      signature,
    }),
  });
  const body = (await res.json()) as { code: string; desc: string; data?: { checkoutUrl: string; paymentLinkId: string } };
  if (body.code !== '00' || !body.data) throw new Error(`payOS: ${body.desc}`);
  return body.data;
}

/** Mã đơn: số nguyên dương, duy nhất. Dùng thời gian (giây) + 3 số ngẫu nhiên, vừa giới hạn của payOS. */
export const newOrderCode = () => Number(`${Math.floor(Date.now() / 1000) % 1_000_000_000}${Math.floor(Math.random() * 900 + 100)}`);
