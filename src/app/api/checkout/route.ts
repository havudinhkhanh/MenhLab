import { NextResponse } from 'next/server';
import { db, getChartRow } from '@/lib/db';
import { config } from '@/lib/config';
import { createPaymentLink, newOrderCode, payosEnabled } from '@/lib/payos';

export async function POST(req: Request) {
  const { chartId } = (await req.json().catch(() => ({}))) as { chartId?: string };
  const row = chartId ? await getChartRow(chartId) : null;
  if (!row) return NextResponse.json({ error: 'Không tìm thấy lá số.' }, { status: 404 });
  if (row.is_pro) return NextResponse.json({ error: 'Lá số này đã là bản Pro.' }, { status: 400 });

  const orderCode = newOrderCode();
  const amount = config.pricePro;
  const sb = db();

  if (payosEnabled()) {
    try {
      const link = await createPaymentLink({
        orderCode,
        amount,
        description: `ML${orderCode}`.slice(0, 25),
        returnUrl: `${config.siteUrl}/la-so/${row.id}?tt=ok`,
        cancelUrl: `${config.siteUrl}/la-so/${row.id}?tt=huy`,
        buyerEmail: row.email ?? undefined,
      });
      await sb.from('orders').insert({ order_code: orderCode, chart_id: row.id, amount, method: 'payos', payos_link_id: link.paymentLinkId });
      return NextResponse.json({ checkoutUrl: link.checkoutUrl, orderCode });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Không tạo được thanh toán. Vui lòng thử lại sau ít phút.' }, { status: 502 });
    }
  }

  if (config.bank.bin && config.bank.account) {
    const content = `ML${orderCode}`;
    await sb.from('orders').insert({ order_code: orderCode, chart_id: row.id, amount, method: 'bank_transfer' });
    const qr = `https://img.vietqr.io/image/${config.bank.bin}-${config.bank.account}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(config.bank.holder)}`;
    return NextResponse.json({
      orderCode,
      bank: { qr, account: config.bank.account, holder: config.bank.holder, amount, content, bankBin: config.bank.bin },
    });
  }

  return NextResponse.json({ error: 'Thanh toán chưa được bật. Vui lòng liên hệ quản trị viên.' }, { status: 503 });
}
