import { redirect } from 'next/navigation';

/** Trang cũ "Lá số của tôi" — nay là Tài khoản. */
export default function OldMyCharts() {
  redirect('/tai-khoan');
}
