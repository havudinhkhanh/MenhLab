# Hướng dẫn setup MệnhLab từng bước

Tài liệu này dẫn bạn từ repo GitHub đến một trang web chạy thật, có lưu lá số, gửi email, thu tiền và email teaser tự động. Không cần viết code. Thời gian: khoảng 1,5–2 giờ cho lần đầu.

---

## 0. Bức tranh tổng thể

| Thành phần | Dùng để | Dịch vụ | Chi phí khởi đầu |
|---|---|---|---|
| Mã nguồn | Lưu code, tự động deploy khi sửa | GitHub (repo `MenhLab`) | Miễn phí |
| Hosting | Chạy trang web | Vercel | Miễn phí (xem lưu ý) |
| Cơ sở dữ liệu | Lưu lá số, đơn hàng, bằng chứng đồng ý | Supabase | Miễn phí |
| Email | Gửi link lá số, biên nhận, email teaser | Resend | Miễn phí (giới hạn số email/ngày) |
| Thanh toán | Thu tiền gói Pro qua VietQR | payOS, hoặc chuyển khoản thủ công | Miễn phí |

**Lưu ý quan trọng về Vercel:** gói Hobby (miễn phí) chỉ dành cho mục đích cá nhân, phi thương mại. Khi bắt đầu thu tiền, hãy nâng lên gói Pro của Vercel (hoặc chuyển sang nền tảng khác cho phép thương mại). Kiểm tra điều khoản hiện hành trên vercel.com trước khi bán.

Giới hạn gói miễn phí của từng dịch vụ có thể thay đổi — kiểm tra lại trên trang giá của họ.

Chạy được tối thiểu chỉ cần **Vercel**: chế độ "xem nhanh" (không lưu) hoạt động mà không cần gì khác. Thêm Supabase để lưu lá số, Resend để gửi email, payOS/ngân hàng để thu tiền.

---

## 1. Chuẩn bị 3 chuỗi bí mật

Bạn cần 3 chuỗi ngẫu nhiên dài cho `APP_SECRET`, `HASH_SALT`, `CRON_SECRET`, và 1 mật khẩu cho `ADMIN_KEY`.

Cách tạo nhanh: mở Chrome → nhấn `F12` → tab **Console** → dán dòng dưới rồi Enter, làm 3 lần:

```js
crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '')
```

Lưu tạm các chuỗi này vào ghi chú riêng (không chia sẻ cho ai). `ADMIN_KEY` là mật khẩu bạn tự đặt để vào trang `/admin`.

---

## 2. Supabase — cơ sở dữ liệu

1. Vào **supabase.com** → Sign in bằng GitHub → **New project**.
   - Name: `menhlab`
   - Database password: đặt mật khẩu mạnh, lưu lại.
   - Region: **Southeast Asia (Singapore)** — gần Việt Nam nhất.
2. Đợi khoảng 2 phút cho project khởi tạo.
3. Menu trái → **SQL Editor** → **New query** → mở file [`supabase/schema.sql`](supabase/schema.sql) trên GitHub, copy toàn bộ, dán vào → **Run**. Thấy "Success. No rows returned" là xong.
4. Menu trái → **Project Settings** → **API** (hoặc **Data API** / **API Keys**). Lấy:
   - **Project URL** → dùng cho `SUPABASE_URL`
   - Khóa **service_role** (secret) → dùng cho `SUPABASE_SERVICE_ROLE_KEY`

> ⚠ Khóa `service_role` có toàn quyền với dữ liệu. Chỉ dán vào Vercel, không bao giờ để trong code hay gửi qua chat.

Ghi chú: project Supabase miễn phí có thể tự tạm dừng nếu không có truy cập trong một thời gian; vào dashboard bấm "Restore" để chạy lại.

---

## 3. Resend — gửi email

1. Vào **resend.com** → đăng ký.
2. **Domains** → **Add Domain** → nhập tên miền của bạn (ví dụ `menhlab.vn`). Resend hiện ra vài bản ghi DNS (TXT, MX). Vào nơi bạn mua tên miền (Mắt Bão, PA Vietnam, Cloudflare...) thêm đúng các bản ghi đó. Đợi trạng thái **Verified** (vài phút đến vài giờ).
3. **API Keys** → **Create API Key** (quyền Sending access) → copy → dùng cho `RESEND_API_KEY`.
4. `EMAIL_FROM` = `MệnhLab <hello@menhlab.vn>` (địa chỉ thuộc tên miền đã xác thực).

Chưa có tên miền? Resend vẫn cho gửi thử bằng `onboarding@resend.dev`, nhưng **chỉ gửi được đến chính email bạn đăng ký Resend** — đủ để test, chưa dùng cho khách thật.

---

## 4. Vercel — đưa trang web lên mạng

1. Vào **vercel.com** → **Continue with GitHub**.
2. **Add New… → Project** → chọn repo **MenhLab** → **Import**.
3. Framework Preset tự nhận **Next.js**. Mở mục **Environment Variables**, thêm từng biến theo bảng dưới (tên biến phải đúng y hệt, xem thêm [`.env.example`](.env.example)):

| Biến | Giá trị | Bắt buộc? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Tạm để `https://menhlab.vercel.app`, sửa sau khi có địa chỉ thật | Có |
| `NEXT_PUBLIC_BRAND` | `MệnhLab` | Không |
| `NEXT_PUBLIC_PRICE_PRO` | `149000` (giá gói Pro, đơn vị đồng) | Không |
| `OWNER_NAME` | Tên người/tổ chức bán hàng | **Có** — bắt buộc theo luật trong email quảng cáo |
| `OWNER_ADDRESS` | Địa chỉ liên hệ | **Có** |
| `OWNER_EMAIL` | Email nhận hỗ trợ, yêu cầu xóa dữ liệu | **Có** |
| `OWNER_PHONE` | Số điện thoại (nếu muốn) | Không |
| `APP_SECRET` | Chuỗi bí mật 1 | Có |
| `HASH_SALT` | Chuỗi bí mật 2 | Có |
| `CRON_SECRET` | Chuỗi bí mật 3 | Có (cho email teaser) |
| `ADMIN_KEY` | Mật khẩu trang /admin | Có |
| `SUPABASE_URL` | Từ bước 2 | Có (để lưu lá số) |
| `SUPABASE_SERVICE_ROLE_KEY` | Từ bước 2 | Có |
| `RESEND_API_KEY` | Từ bước 3 | Có (để gửi email) |
| `EMAIL_FROM` | Từ bước 3 | Có |

4. Bấm **Deploy**. Khoảng 1–2 phút sau bạn có địa chỉ dạng `https://menhlab-xxxx.vercel.app`.
5. Quay lại **Settings → Environment Variables**, sửa `NEXT_PUBLIC_SITE_URL` thành địa chỉ thật (hoặc tên miền riêng) → **Deployments** → bấm `⋯` ở bản mới nhất → **Redeploy**.
6. (Tùy chọn) Gắn tên miền: **Settings → Domains → Add** → làm theo hướng dẫn thêm bản ghi DNS.

**Email teaser tự động:** file [`vercel.json`](vercel.json) đã khai báo lịch chạy mỗi ngày lúc 02:00 UTC (9:00 sáng giờ Việt Nam). Vercel tự gửi kèm `CRON_SECRET` khi gọi. Kiểm tra trong **Settings → Cron Jobs**.

Từ giờ, mỗi lần code trên GitHub thay đổi, Vercel tự deploy lại.

---

## 5. Thanh toán — chọn một trong hai

### Cách A: Chuyển khoản thủ công (nhanh nhất để bắt đầu)

Thêm 3 biến vào Vercel rồi Redeploy:

| Biến | Ví dụ |
|---|---|
| `BANK_BIN` | Mã BIN ngân hàng theo chuẩn VietQR, ví dụ Vietcombank `970436`, Techcombank `970407`, MB `970422`, ACB `970416` (tra đầy đủ trên vietqr.io) |
| `BANK_ACCOUNT` | Số tài khoản |
| `BANK_HOLDER` | Tên chủ tài khoản, viết HOA không dấu |

Khách bấm "Thanh toán" → thấy mã QR có sẵn số tiền và nội dung `ML<mã đơn>`. Khi tiền về, bạn vào `https://<trang của bạn>/admin`, đăng nhập bằng `ADMIN_KEY`, đối chiếu nội dung chuyển khoản và bấm **Đã nhận tiền** → hệ thống mở khóa Pro và gửi email biên nhận cho khách.

### Cách B: payOS (tự động mở khóa)

1. Đăng ký tại **payos.vn** (theo yêu cầu hồ sơ hiện hành của payOS cho cá nhân/doanh nghiệp), liên kết tài khoản ngân hàng.
2. Tạo **kênh thanh toán** → lấy **Client ID**, **API Key**, **Checksum Key**.
3. Thêm vào Vercel: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` → Redeploy.
4. Trong kênh thanh toán, mục **Webhook**, nhập: `https://<trang của bạn>/api/payos-webhook` → lưu/xác nhận.

Khi có cả payOS và thông tin ngân hàng, hệ thống ưu tiên payOS.

**Test thanh toán thật với số tiền nhỏ:** tạm đặt `NEXT_PUBLIC_PRICE_PRO=2000`, Redeploy, tự mua thử, kiểm tra Pro được mở và email biên nhận về; sau đó đặt lại giá thật.

---

## 6. Bản luận giải trọn đời (Pro)

Không cần cài thêm gì. Lá số Pro có nút **Bản luận giải trọn đời** (`/la-so/<id>/luan-giai`): 19 phần, khoảng 13.000–15.000 chữ, gọi khách theo "anh/chị + tên" nếu khách điền tên, in hoặc lưu PDF được. Bố cục:

- Phần 1: chân dung và nền tảng lá số.
- Phần 2: 12 khía cạnh cuộc đời — mỗi cung 5 đoạn: ấn tượng ngoài đời → sao chính và độ sáng → các sao đi kèm (có điểm số và so với 24.000 lá số) → liên hệ với các cung khác → nguyên tắc nên giữ, dấu hiệu lệch hướng, ngưỡng hành động; cuối mỗi cung có câu hỏi tự kiểm chứng.
- Phần 3–7: bốn trục liên cung, các giai đoạn đời, năm nay và từng tháng, tổng kết (đòn bẩy, điểm mù, thứ tự hành động), điều đặc biệt và lời nhắn.

Toàn bộ được dựng từ quy tắc Tử Vi và nội dung biên soạn sẵn — tính ngay khi mở trang, không lưu, không tốn chi phí. Muốn sửa câu chữ: `src/content/book.ts` (ấn tượng ngoài đời theo sao, nghĩa sao phụ theo lĩnh vực, nguyên tắc, ngưỡng hành động, câu hỏi tự kiểm chứng), `src/content/story.ts` (bản chất từng sao), `src/content/report.ts` (dấu hiệu lệch hướng). Cách ghép câu nằm ở `src/lib/book.ts`.

---

## 6b. Thử bản Pro trước khi public (không cần trả tiền)

**Cách 1 — nhanh nhất, chỉ cần Vercel:** chỉ cần đặt 2 biến `ADMIN_KEY` và `APP_SECRET` (bước 1) là đủ, chưa cần Supabase hay Resend.
1. Vào `https://<trang của bạn>/admin`, nhập `ADMIN_KEY` → Đăng nhập.
2. Bấm **Mở bản xem thử** (trang `/admin/thu-pro`).
3. Nhập ngày giờ sinh bất kỳ (nên điền cả tên để thấy cách xưng hô) → **Xem bản Pro**. Bạn thấy đúng nội dung khách nhận được sau khi mua. Bấm **Xem bản luận giải trọn đời** ở thanh trên cùng để đọc đúng cuốn khách nhận được.
4. Không lưu gì, không gửi email, không tạo đơn hàng. Bấm **Thử lá số khác** để đổi người.

**Cách 2 — thử trọn luồng thật (cần Supabase):**
1. Lập lá số ở trang chủ, nhập email của bạn, đánh dấu ô đồng ý → lá số được lưu.
2. Vào `/admin` → ô **Tặng Pro cho lá số đã lưu** → dán link lá số → **Mở Pro miễn phí**. Hệ thống ghi một đơn 0₫ (cách "gift") để đối soát.
3. Mở lại link lá số: thấy nhãn Pro và nút Bản luận giải trọn đời.

Cũng dùng ô này để tặng Pro cho người quen thử nghiệm và góp ý.

**Cách 3 — thử thanh toán thật:** xem cuối bước 5 (tạm hạ giá xuống 2.000₫).

## 7. Kiểm tra sau khi setup

Làm lần lượt, đánh dấu từng dòng:

- [ ] Mở trang chủ, bấm thử chữ "Tuần", "Triệt" và tên sao trên lá số mẫu → hiện giải thích.
- [ ] Nhập ngày giờ sinh, **không** nhập email → bấm "Lập lá số" → ra lá số (chế độ xem nhanh).
- [ ] Nhập lại, **có** email và đánh dấu ô đồng ý bắt buộc → lá số được lưu, email "Lá số Tử Vi của bạn đã sẵn sàng" về hộp thư.
- [ ] Trong Supabase → **Table Editor** → bảng `charts` có dòng mới; bảng `consent_log` có 3 dòng (processing/marketing/research).
- [ ] Trang `/tim-la-so` → nhập email → nhận lại link.
- [ ] Bấm "Thanh toán" → ra QR (cách A) hoặc chuyển sang trang payOS (cách B).
- [ ] Sau khi xác nhận thanh toán → tải lại trang lá số → thấy nhãn **Pro**, đọc được 12 cung.
- [ ] Test email teaser: lập một lá số có đánh dấu đồng ý nhận email giới thiệu. Trong Supabase sửa cột `created_at` của dòng đó lùi lại 2 ngày. Rồi chạy lệnh (thay giá trị):
  ```bash
  curl -H "Authorization: Bearer <CRON_SECRET>" https://<trang của bạn>/api/cron/drip
  ```
  → nhận email có tiêu đề bắt đầu bằng `[QC]`.
- [ ] Bấm "Từ chối nhận email quảng cáo" ở cuối email → xác nhận → nhận đúng 1 email xác nhận; cột `unsubscribed_at` có giá trị.
- [ ] Bấm "Xóa dữ liệu của tôi" trên một lá số test → dòng trong `charts` biến mất.

---

## 8. Thông tin đầu vào (input) và cách hệ thống làm rõ

| Trường | Bắt buộc | Vì sao cần | Kiểm tra / làm rõ |
|---|---|---|---|
| Tên hiển thị | Không | Chỉ để in lên lá số | Cho phép biệt danh, tối đa 60 ký tự |
| Giới tính | Có | Xác định Âm/Dương Nam/Nữ → chiều chạy đại vận | Giải thích ngay dưới ô chọn |
| Lịch (dương/âm) | Có | Giấy khai sinh ghi dương lịch; gia đình đôi khi nhớ âm lịch | Âm lịch: hỏi thêm "tháng nhuận"; báo lỗi nếu ngày/tháng nhuận không tồn tại |
| Ngày, tháng, năm | Có | An sao | Năm 1900–2100; kiểm tra ngày hợp lệ |
| Kiểu giờ sinh | Có | Biết giờ phút / chỉ biết canh giờ / không biết | "Không biết" → cảnh báo luận giải chỉ mang tính minh họa |
| Giờ, phút | Khi biết giờ | Xác định canh giờ | Cảnh báo nếu cách ranh giới canh giờ dưới 15 phút |
| Mức chắc chắn của giờ | Có | Chính xác / ±30 phút / ±1–2 tiếng | Quyết định khoảng thời gian dùng cho "Độ nhạy giờ sinh" |
| Nơi sinh | Có | Múi giờ lịch sử (Bắc/Nam), kinh độ cho giờ Mặt Trời | 63 tỉnh theo tên cũ + "Nước ngoài" (nhập múi giờ, giờ mùa hè, kinh độ) |
| Quy ước nâng cao | Không | Giờ chuẩn / đồng hồ / Mặt Trời; giờ Tý đổi ngày lúc 23h hay 0h; cách tính tháng nhuận | Mặc định theo thông lệ; lá số luôn cho xem kết quả theo quy ước khác |
| Email | Chỉ khi muốn lưu | Gửi link lá số, mua Pro | Bỏ trống = xem nhanh, dữ liệu không rời khỏi máy người dùng |

**Bước làm rõ ("clarify"):** ngay khi người dùng điền đủ thông tin, khung **"Hệ thống hiểu là:"** hiện ra trước nút Lập lá số, liệt kê từng bước: đổi âm/dương lịch, múi giờ đồng hồ thời điểm đó (ví dụ Sài Gòn 1970 dùng UTC+8), giờ sau hiệu chỉnh, canh giờ, ngày âm lịch, và các cảnh báo. Người dùng thấy sai chỗ nào thì sửa trước khi lập.

## 9. Sự đồng ý (consent) — đã làm sẵn theo luật

Thiết kế theo Luật Bảo vệ dữ liệu cá nhân 2025 (hiệu lực 01/01/2026) và Nghị định 91/2020/NĐ-CP về chống thư rác:

- **Ba ô đồng ý tách riêng, mặc định không đánh dấu:** (1) xử lý dữ liệu để lập & lưu lá số — bắt buộc khi lưu; (2) nhận email giới thiệu — không bắt buộc; (3) dùng phản hồi đúng/sai cho thống kê ẩn danh — không bắt buộc. Không đánh dấu (im lặng) không được tính là đồng ý.
- **Lưu bằng chứng:** bảng `consent_log` ghi thời điểm, nội dung văn bản đồng ý, phiên bản, mã băm email và IP (không lưu email gốc trong nhật ký).
- **Xem nhanh không lưu:** không nhập email thì dữ liệu sinh chỉ nằm trong trình duyệt.
- **Email quảng cáo:** chỉ gửi người đã đồng ý, chưa mua Pro, chưa từ chối; tiêu đề bắt đầu bằng `[QC]`; có thông tin người quảng cáo, giá dịch vụ; nút từ chối nhận có hiệu lực ngay và gửi đúng 1 email xác nhận không quảng cáo; tối đa 4 email, không quá 1 email/ngày; dừng ngay khi khách mua Pro.
- **Quyền xóa:** nút "Xóa dữ liệu của tôi" trên mỗi lá số.

Khi đổi nội dung văn bản đồng ý trong `src/lib/config.ts`, hãy tăng `CONSENT_VERSION`.

> Đây là thiết kế kỹ thuật bám theo quy định, không phải tư vấn pháp lý. Trước khi bán chính thức, nên nhờ luật sư rà lại chính sách bảo mật, điều khoản, và các nghĩa vụ đăng ký kinh doanh, thuế, hóa đơn cho dịch vụ bán online.

---

## 10. Chuỗi email teaser

| Email | Gửi sau khi lưu lá số | Nội dung (cá nhân hóa theo lá số) |
|---|---|---|
| 1 | 1 ngày | Chính tinh cung Mệnh nghĩa là gì — mở 2 nhận định đầu |
| 2 | 3 ngày | Cung Quan Lộc và Tài Bạch — mở 1 nhận định |
| 3 | 6 ngày | Đại vận 10 năm hiện tại — Tứ Hóa đại vận bị khóa |
| 4 | 10 ngày | Năm nay theo lá số + ưu đãi gói Pro; báo đây là email cuối |

Sửa lịch gửi trong `src/app/api/cron/drip/route.ts` (`SCHEDULE_DAYS`), sửa lời văn trong `src/lib/email.ts` (`dripEmail`) và nội dung teaser trong `src/lib/reading.ts` (`teaserFor`).

---

## 11. Tùy biến nội dung

| Muốn sửa | File |
|---|---|
| Giải thích thuật ngữ, Từ điển | `src/content/glossary.ts` |
| Ý nghĩa 14 chính tinh theo từng lĩnh vực, phụ tinh, Tứ Hóa | `src/content/stars.ts` |
| Ý nghĩa 12 cung | `src/content/palaces.ts` |
| Quy tắc luận giải, bộ sao đồng cung | `src/lib/reading.ts` |
| Giá, văn bản đồng ý | biến `NEXT_PUBLIC_PRICE_PRO`, file `src/lib/config.ts` |
| Màu sắc, giao diện | `src/app/globals.css` |

Sửa trực tiếp trên GitHub (bấm biểu tượng bút chì) → Commit → Vercel tự deploy.

---

## 12. Chạy trên máy tính (dành cho người làm kỹ thuật)

```bash
npm install
cp .env.example .env.local   # điền giá trị
npm run dev                  # mở http://localhost:3000
npm test                     # kiểm thử engine lá số và luận giải
```

## 13. Công cụ "Tìm giờ sinh" (`/chinh-gio`)

Dành cho người không biết hoặc không chắc giờ sinh. Người dùng nhập ngày sinh, chọn các canh giờ có thể, chấm vài mô tả tính cách (ẩn tên sao), và nhập 3–8 sự kiện lớn có năm (kết hôn, sinh con, đổi việc, chuyển nhà, đi xa...). Hệ thống chấm từng canh giờ theo tiểu hạn, lưu Thái Tuế, đại vận và lưu Tứ Hóa năm đó, rồi xếp hạng — kèm lý do của từng điểm.

- Chạy hoàn toàn trên trình duyệt, không lưu gì lên máy chủ, không cần cấu hình thêm.
- Ngưỡng kết luận được hiệu chuẩn bằng mô phỏng: với sự kiện ngẫu nhiên, "khá rõ" chỉ xảy ra khoảng 5% số lần. Chạy lại hiệu chuẩn khi đổi cách chấm điểm: `npx tsx scripts/calibrate-rectify.ts` rồi dán kết quả vào `src/lib/engine/rectify.ts`.
- Đổi danh sách loại sự kiện và cung tương ứng trong `EVENT_KINDS`, cách chấm điểm trong `scoreEvent` (cùng file).
- Nếu muốn thu phí tính năng này, có thể chuyển nó thành quyền lợi của gói Pro.

## 14. Bảng độ sáng sao theo trường phái

Mặc định dùng bảng sách Tử Vi Việt Nam (thang 5 mức M/V/Đ/B/H, dữ liệu từ dự án mã nguồn mở lasotuvi, giấy phép MIT). Người dùng có thể chọn bảng Tử Vi Đẩu Số Toàn Thư trong "Tùy chọn nâng cao". Mỗi lá số liệt kê những sao hai bảng xếp khác nhau. Sửa bảng sách Việt trong `src/lib/engine/brightness.ts`.

## 15. Phòng thí nghiệm mở, cách cục, Học đọc lá số, trang sao × cung

**Cập nhật cơ sở dữ liệu (bắt buộc nếu bạn đã chạy schema cũ):** vào Supabase → SQL Editor → chạy phần cuối file `supabase/schema.sql` (đoạn "Phòng thí nghiệm mở", tạo bảng `lab_results`). Chạy lại cả file cũng an toàn.

- **Thí nghiệm ghép cặp mù:** ngay sau khi lập lá số (chế độ xem nhanh, hoặc lần đầu mở lá số vừa lưu), người dùng được mời chọn 1 trong 4 mô tả giống mình nhất trước khi thấy lá số. Kết quả chỉ ghi đúng/sai khi người dùng đồng ý. Trang `/nghien-cuu` hiển thị số liệu trực tiếp, thiết kế đăng ký trước và kết luận tự động khi đủ cỡ mẫu.
- **Tỷ lệ nền:** `src/data/base-rates.json` và `rates-lite.json` sinh bằng `npx tsx scripts/compute-base-rates.ts 24000` (khoảng 11 phút). Chạy lại khi đổi quy tắc an sao hoặc danh sách cách cục, rồi chạy đoạn tách bản gọn (xem cuối script).
- **Cách cục:** 20 cách phổ biến trong `src/lib/engine/patterns.ts`, mỗi cách là danh sách điều kiện tường minh.
- **Cách an sao:** mỗi lá số hiển thị từng bước an sao trên chính dữ liệu người dùng, tự đối chiếu với engine (`src/lib/engine/derivation.ts`).
- **Học đọc lá số:** 9 bài có câu hỏi kiểm tra, sửa trong `src/content/lessons.ts`.
- **168 trang sao × cung** (`/sao/<sao>/<cung>`) và 14 trang từng sao, dựng tĩnh, có `sitemap.xml` và `robots.txt`. Sau khi có tên miền thật, khai báo sitemap trong Google Search Console: `https://<tên miền>/sitemap.xml`.

## 16. Những gì chưa có (gợi ý làm tiếp)

- Chưa xuất hóa đơn điện tử tự động.
- Chưa có giới hạn tốc độ (rate limit) ở tầng hạ tầng; hiện chỉ chặn 10 lá số/email/giờ. API `/api/lab` nhận kết quả ẩn danh nên có thể bị gửi rác — khi lưu lượng lớn nên thêm Cloudflare Turnstile hoặc giới hạn theo IP.
- Công cụ tìm giờ sinh chưa lưu kết quả vào lá số đã lưu.
- So sánh hai lá số, lưu nguyệt 12 tháng, phi hóa Tứ Hóa.
