'use client';

import { useState } from 'react';
import { CONSENT_TEXT } from '@/lib/config';

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
  return data as T;
}

export default function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError ?? '');
  const [devCode, setDevCode] = useState('');
  const [password, setPassword] = useState('');
  const [sentAt, setSentAt] = useState(0);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await post<{ devCode?: string; password?: boolean }>('/api/auth/request', { email, consent, next });
      if (r.password) {
        setStep('password');
        return;
      }
      setDevCode(r.devCode ?? '');
      setStep('code');
      setSentAt(Date.now());
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await post<{ next: string }>('/api/auth/verify', { email, code, next });
      window.location.href = r.next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
      setBusy(false);
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await post<{ next: string }>('/api/auth/password', { email, password, next });
      window.location.href = r.next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
      setBusy(false);
    }
  }

  if (step === 'password') {
    return (
      <form onSubmit={signIn} className="login-card" noValidate>
        <h2>Nhập mật khẩu</h2>
        <p className="muted">
          Đăng nhập bằng <b>{email}</b>.
        </p>
        <div className="field">
          <label htmlFor="password">Mật khẩu</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button className="btn" type="submit" disabled={busy || !password} style={{ width: '100%' }}>
          {busy ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </button>
        <p className="small" style={{ marginTop: 14 }}>
          <button type="button" className="linklike" onClick={() => setStep('email')}>
            Đổi email
          </button>
        </p>
      </form>
    );
  }

  if (step === 'code') {
    return (
      <form onSubmit={verify} className="login-card" noValidate>
        <h2>Nhập mã trong email</h2>
        <p className="muted">
          Mã 6 số vừa được gửi tới <b>{email}</b>. Có thể mất một phút để đến; nhớ xem cả mục Quảng cáo hoặc Thư rác. Bạn cũng có thể bấm nút
          Đăng nhập ngay trong email.
        </p>
        {devCode && <p className="note">Chạy thử trên máy, chưa có máy chủ email: mã của bạn là {devCode}.</p>}
        <div className="field">
          <label htmlFor="code">Mã đăng nhập</label>
          <input
            id="code"
            className="code-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
        </div>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button className="btn" type="submit" disabled={busy || code.length !== 6} style={{ width: '100%' }}>
          {busy ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </button>
        <p className="small" style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button type="button" className="linklike" disabled={busy || Date.now() - sentAt < 30_000} onClick={() => send()}>
            Gửi lại mã
          </button>
          <button type="button" className="linklike" onClick={() => setStep('email')}>
            Đổi email
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={send} className="login-card" noValidate>
      <h2>Đăng nhập</h2>
      <p className="muted">Không cần mật khẩu. Nhập email, chúng tôi gửi mã 6 số để bạn đăng nhập.</p>
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ten@vidu.com" autoFocus />
        <span className="hint">Dùng đúng email bạn đã nhập khi lưu lá số — các lá số đó sẽ tự hiện trong tài khoản.</span>
      </div>
      <label className="check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{CONSENT_TEXT.account}</span>
      </label>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
        {busy ? 'Đang gửi…' : 'Gửi mã đăng nhập'}
      </button>
      <p className="hint" style={{ marginTop: 12 }}>
        Chi tiết trong <a href="/bao-mat">Chính sách bảo mật</a>.
      </p>
    </form>
  );
}
