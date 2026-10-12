-- MệnhLab — chạy một lần trong Supabase: SQL Editor → New query → dán toàn bộ → Run.
-- Mọi bảng bật Row Level Security và KHÔNG có policy công khai:
-- chỉ server (dùng service_role key) đọc/ghi được. Trình duyệt người dùng không truy cập trực tiếp.

create extension if not exists pgcrypto;

-- Lá số đã lưu. Chỉ lưu dữ liệu đầu vào; lá số được tính lại khi xem (không lưu kết quả).
create table if not exists charts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text,
  display_name text,
  birth_input jsonb not null,
  conventions jsonb not null,
  -- Gói
  is_pro boolean not null default false,
  pro_at timestamptz,
  -- Đồng ý (Luật Bảo vệ dữ liệu cá nhân 2025: tách từng mục đích, lưu bằng chứng)
  consent_processing_at timestamptz not null,
  consent_marketing boolean not null default false,
  consent_marketing_at timestamptz,
  consent_research boolean not null default false,
  consent_version text not null,
  -- Email marketing
  unsubscribed_at timestamptz,
  drip_step int not null default 0,
  last_drip_at timestamptz
);
create index if not exists charts_email_idx on charts (lower(email));
create index if not exists charts_drip_idx on charts (consent_marketing, is_pro, unsubscribed_at, drip_step);

-- Nhật ký đồng ý / rút đồng ý. Lưu hash email (không lưu email gốc) để chứng minh mà không giữ dữ liệu thừa.
create table if not exists consent_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  chart_id uuid,
  email_hash text,
  purpose text not null,          -- 'processing' | 'marketing' | 'research'
  granted boolean not null,
  consent_version text not null,
  consent_text text not null,
  user_agent text,
  ip_hash text
);

-- Đơn hàng
create table if not exists orders (
  id bigint generated always as identity primary key,
  order_code bigint not null unique,
  created_at timestamptz not null default now(),
  chart_id uuid references charts(id) on delete set null,
  amount int not null,
  status text not null default 'pending', -- pending | paid | cancelled | manual
  method text not null default 'payos',   -- payos | bank_transfer
  payos_link_id text,
  paid_at timestamptz,
  raw jsonb
);

-- Nhật ký email đã gửi (chống gửi trùng, tra soát)
create table if not exists email_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  chart_id uuid,
  kind text not null,
  provider_id text,
  ok boolean not null default true,
  error text
);

-- Phản hồi "nhận định này có đúng với bạn không?" (chỉ khi người dùng đồng ý mục đích nghiên cứu)
create table if not exists feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  chart_id uuid references charts(id) on delete cascade,
  section text not null,
  score smallint not null check (score between 1 and 5)
);

alter table charts enable row level security;
alter table consent_log enable row level security;
alter table orders enable row level security;
alter table email_log enable row level security;
alter table feedback enable row level security;

-- ============================================================================
-- Phòng thí nghiệm mở (thêm từ phiên bản 2). Nếu đã chạy schema cũ, chỉ cần chạy phần dưới đây.
-- ============================================================================

-- Kết quả bài kiểm tra ghép cặp mù: chỉ lưu đúng/sai và số phương án, KHÔNG lưu ngày giờ sinh.
-- chart_id chỉ có khi người dùng đã lưu lá số và đồng ý mục đích nghiên cứu.
create table if not exists lab_results (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  test text not null,
  n_options smallint not null,
  correct boolean not null,
  confidence smallint check (confidence between 1 and 5),
  chart_id uuid references charts(id) on delete set null
);
create unique index if not exists lab_results_chart_test on lab_results (chart_id, test) where chart_id is not null;
alter table lab_results enable row level security;


-- Đăng nhập bằng mã gửi qua email (không mật khẩu). Chỉ lưu mã đã băm, hết hạn sau 15 phút.
create table if not exists login_codes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  used_at timestamptz
);
create index if not exists login_codes_email_idx on login_codes (email, created_at desc);
alter table login_codes enable row level security;
