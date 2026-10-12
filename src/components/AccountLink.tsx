'use client';

import { useEffect, useState } from 'react';

/** Nút trên thanh menu: "Đăng nhập" hoặc "Tài khoản", đọc từ cookie gợi ý (không chứa dữ liệu cá nhân). */
export default function AccountLink() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    setSignedIn(document.cookie.split('; ').some((c) => c === 'menhlab_user=1'));
  }, []);
  return (
    <a href={signedIn ? '/tai-khoan' : '/dang-nhap'} className="nav-account">
      {signedIn ? 'Tài khoản' : 'Đăng nhập'}
    </a>
  );
}
