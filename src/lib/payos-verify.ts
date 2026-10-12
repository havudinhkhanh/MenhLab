/** Tách riêng (không 'server-only') để kiểm thử được. Chỉ dùng phía server. */
import { createHmac, timingSafeEqual } from 'node:crypto';

const hmac = (data: string) => createHmac('sha256', process.env.PAYOS_CHECKSUM_KEY ?? '').update(data).digest('hex');

/** Xác thực webhook: sắp xếp khóa của `data` theo bảng chữ cái, nối key=value bằng &, HMAC-SHA256. */
export function verifyWebhook(payload: { data?: Record<string, unknown>; signature?: string }): boolean {
  if (!payload?.data || !payload.signature) return false;
  const str = Object.keys(payload.data)
    .sort()
    .map((k) => {
      let v = payload.data![k];
      if (v === null || v === undefined || v === 'null' || v === 'undefined') v = '';
      else if (Array.isArray(v)) v = JSON.stringify(v.map((x) => (x && typeof x === 'object' ? sortObj(x as Record<string, unknown>) : x)));
      else if (typeof v === 'object') v = JSON.stringify(sortObj(v as Record<string, unknown>));
      return `${k}=${v}`;
    })
    .join('&');
  const a = Buffer.from(hmac(str));
  const b = Buffer.from(String(payload.signature));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sortObj(o: Record<string, unknown>) {
  return Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
}

