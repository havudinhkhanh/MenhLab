import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSessionToken, readSessionToken, safeNext, hashCode, newCode } from '../src/lib/session';

test('Phiên đăng nhập: đọc lại được, chống sửa, hết hạn sau 30 ngày', () => {
  const t = makeSessionToken('a@b.vn');
  assert.equal(readSessionToken(t), 'a@b.vn');
  const [e, exp, sig] = t.split('.');
  assert.equal(readSessionToken(`${Buffer.from('x@y.vn').toString('base64url')}.${exp}.${sig}`), null);
  assert.equal(readSessionToken(`${e}.${Number(exp) + 999}.${sig}`), null);
  assert.equal(readSessionToken(t, Date.now() + 31 * 86400_000), null);
  assert.equal(readSessionToken('rác'), null);
});

test('Mã đăng nhập 6 số, băm theo email; chỉ chuyển tới đường dẫn nội bộ', () => {
  for (let i = 0; i < 50; i++) assert.match(newCode(), /^\d{6}$/);
  assert.notEqual(hashCode('a@b.vn', '123456'), hashCode('c@d.vn', '123456'));
  assert.equal(safeNext('/la-so/abc#nam-nay'), '/la-so/abc#nam-nay');
  assert.equal(safeNext('https://evil.com'), '/tai-khoan');
  assert.equal(safeNext('//evil.com'), '/tai-khoan');
  assert.equal(safeNext(undefined), '/tai-khoan');
});
