/**
 * Gửi email qua Resend (REST API, không cần SDK).
 *
 * Tuân thủ Nghị định 91/2020/NĐ-CP với email QUẢNG CÁO:
 *  - Tiêu đề bắt đầu bằng nhãn "[QC]" (Điều 18).
 *  - Có thông tin người quảng cáo (Điều 19) và giá dịch vụ (Điều 17).
 *  - Có chức năng từ chối nhận, xử lý ngay, gửi 1 thư xác nhận không quảng cáo (Điều 20).
 * Email GIAO DỊCH (gửi link lá số theo yêu cầu, biên nhận) không phải quảng cáo nên không gắn nhãn.
 */
import 'server-only';
import { config, vnd } from './config';
import { sign } from './tokens';
import { db, dbEnabled } from './db';

export const emailEnabled = () => !!process.env.RESEND_API_KEY;

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  chartId?: string;
  kind: string;
  unsubscribeUrl?: string;
}

export async function sendEmail(a: SendArgs): Promise<boolean> {
  if (!emailEnabled()) {
    console.log(`[email:dry-run] ${a.kind} → ${a.to}: ${a.subject}`);
    return false;
  }
  const headers: Record<string, string> = {};
  if (a.unsubscribeUrl) {
    headers['List-Unsubscribe'] = `<${a.unsubscribeUrl}>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: config.emailFrom, to: [a.to], subject: a.subject, html: a.html, text: a.text, headers }),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (dbEnabled()) {
    await db()
      .from('email_log')
      .insert({ chart_id: a.chartId ?? null, kind: a.kind, provider_id: body.id ?? null, ok: res.ok, error: res.ok ? null : body.message ?? String(res.status) });
  }
  return res.ok;
}

export const unsubscribeUrl = (chartId: string) =>
  `${config.siteUrl}/api/unsubscribe?id=${chartId}&t=${sign('unsub', chartId)}`;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function layout(inner: string, footer: string) {
  return `<!doctype html><html lang="vi"><body style="margin:0;background:#f3f0f8;font-family:Arial,Helvetica,sans-serif;color:#1e1630">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #dcd5e8;border-radius:6px" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px 8px;font-size:13px;font-weight:bold;color:#4b2a7b">${esc(config.brand)}</td></tr>
<tr><td style="padding:0 28px 24px;font-size:16px;line-height:1.6">${inner}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #dcd5e8;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#6e6585">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

const ownerFooter = () =>
  `${esc(config.owner.name)} · ${esc(config.owner.address)} · ${esc(config.owner.email)}${config.owner.phone ? ` · ${esc(config.owner.phone)}` : ''}`;

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="background:#4b2a7b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:4px;font-family:Arial,sans-serif;font-size:15px">${esc(label)}</a></p>`;

/* ------------------------------ Giao dịch ------------------------------ */

export function chartReadyEmail(chartId: string, name: string | null) {
  const url = `${config.siteUrl}/la-so/${chartId}`;
  const hi = name ? `Chào ${esc(name)},` : 'Chào bạn,';
  return {
    subject: 'Lá số Tử Vi của bạn đã sẵn sàng',
    html: layout(
      `<p>${hi}</p><p>Lá số của bạn đã được lập. Đây là đường link riêng — hãy giữ kín, ai có link đều xem được lá số.</p>${button(url, 'Xem lá số của tôi')}<p style="font-size:14px;color:#6e6585">Trên lá số, chạm vào bất kỳ thuật ngữ nào (Tuần, Triệt, Hóa Kỵ, Miếu, Hãm...) để xem giải thích.</p>`,
      `Bạn nhận email này vì đã yêu cầu lập lá số. Muốn xóa dữ liệu: mở lá số → "Xóa dữ liệu của tôi".<br>${ownerFooter()}`,
    ),
    text: `${name ? `Chào ${name},` : 'Chào bạn,'}\n\nLá số của bạn: ${url}\nĐây là link riêng, hãy giữ kín.\n\n${config.owner.name} · ${config.owner.email}`,
  };
}

export function myChartsEmail(rows: { id: string; display_name: string | null; created_at: string }[]) {
  const items = rows
    .map(
      (r) =>
        `<li style="margin:8px 0"><a href="${config.siteUrl}/la-so/${r.id}" style="color:#4b2a7b">${esc(r.display_name || 'Lá số không tên')}</a> <span style="color:#6e6585;font-size:13px">— lập ngày ${new Date(r.created_at).toLocaleDateString('vi-VN')}</span></li>`,
    )
    .join('');
  return {
    subject: 'Các lá số bạn đã lưu',
    html: layout(`<p>Đây là các lá số gắn với email này:</p><ul>${items}</ul>`, ownerFooter()),
    text: rows.map((r) => `${r.display_name || 'Lá số'}: ${config.siteUrl}/la-so/${r.id}`).join('\n'),
  };
}

export function receiptEmail(chartId: string, amount: number, orderCode: number) {
  const url = `${config.siteUrl}/la-so/${chartId}`;
  return {
    subject: `Đã mở khóa bản Pro — đơn #${orderCode}`,
    html: layout(
      `<p>Cảm ơn bạn! Thanh toán ${vnd(amount)} cho đơn #${orderCode} đã được ghi nhận. Bản luận giải Pro đã mở khóa.</p>${button(url, 'Đọc bản Pro')}`,
      ownerFooter(),
    ),
    text: `Đã mở khóa bản Pro (đơn #${orderCode}, ${vnd(amount)}): ${url}`,
  };
}

export function unsubscribeConfirmEmail(receivedAt: Date) {
  const t = receivedAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  return {
    subject: 'Xác nhận: bạn đã ngừng nhận email giới thiệu',
    html: layout(
      `<p>Chúng tôi đã nhận yêu cầu từ chối nhận email giới thiệu của bạn lúc <b>${t}</b>.</p><p>Việc gửi email giới thiệu đã dừng ngay từ thời điểm đó. Bạn vẫn có thể xem lá số qua link cũ.</p>`,
      ownerFooter(),
    ),
    text: `Đã nhận yêu cầu từ chối nhận email giới thiệu lúc ${t}. Việc gửi đã dừng ngay từ thời điểm đó.\n${config.owner.name}`,
  };
}

/* ------------------------------ Quảng cáo ------------------------------ */

export function dripEmail(
  chartId: string,
  name: string | null,
  step: number,
  teaser: { title: string; reveal: string[]; locked: string },
) {
  const url = `${config.siteUrl}/la-so/${chartId}?utm_source=email&utm_campaign=drip${step}`;
  const unsub = unsubscribeUrl(chartId);
  const hi = name ? `Chào ${esc(name)},` : 'Chào bạn,';
  const intros: Record<number, string> = {
    1: 'Phần lớn mọi người nhìn lá số mà không hiểu thuật ngữ nghĩa là gì. Hôm nay, hãy cùng đọc cung quan trọng nhất của bạn — cung Mệnh — bằng ngôn ngữ đời thường.',
    2: 'Cung Mệnh luôn "tam hợp" với cung Quan Lộc (công việc) và Tài Bạch (tiền bạc). Đây là điều lá số của bạn nói về cách bạn làm việc:',
    3: 'Tử Vi chia đời người thành các "đại vận" 10 năm. Mỗi đại vận đi qua một cung khác nhau. Bạn đang ở đây:',
    4: 'Lời nhắn cuối trong chuỗi email này — sau email này chúng tôi sẽ không gửi thêm email giới thiệu nào.',
  };
  const reveal = teaser.reveal.map((p) => `<p>${esc(p)}</p>`).join('');
  const offer = `<div style="background:#f3f0f8;border-left:3px solid #4b2a7b;padding:12px 16px;margin:20px 0;font-size:15px">🔒 ${esc(teaser.locked)}<br><span style="font-size:14px;color:#6e6585">Gói Pro: ${vnd(config.pricePro)} cho một lá số, thanh toán một lần, không gia hạn tự động.</span></div>`;
  const subject = `[QC] ${teaser.title}`.slice(0, 140);
  return {
    subject,
    html: layout(
      `<p>${hi}</p><p>${intros[step] ?? intros[4]}</p><h2 style="font-size:20px;margin:20px 0 8px">${esc(teaser.title)}</h2>${reveal}${offer}${button(url, step >= 4 ? 'Mở khóa bản Pro' : 'Xem tiếp trên lá số của tôi')}<p style="font-size:13px;color:#6e6585">Lưu ý: Tử Vi là hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán. MệnhLab không đưa ra lời khuyên y tế, pháp lý hay đầu tư.</p>`,
      `Đây là email quảng cáo. Bạn nhận vì đã đồng ý nhận email giới thiệu khi lập lá số. <a href="${unsub}" style="color:#4b2a7b">Từ chối nhận email quảng cáo</a> (có hiệu lực ngay).<br>Người quảng cáo: ${ownerFooter()}`,
    ),
    text: `${name ? `Chào ${name},` : 'Chào bạn,'}\n\n${intros[step] ?? intros[4]}\n\n${teaser.title}\n${teaser.reveal.join('\n')}\n\n${teaser.locked}\nGói Pro: ${vnd(config.pricePro)}, thanh toán một lần.\n\nXem: ${url}\n\nTừ chối nhận email quảng cáo: ${unsub}\nNgười quảng cáo: ${config.owner.name}, ${config.owner.address}, ${config.owner.email}`,
    unsubscribeUrl: unsub,
  };
}
