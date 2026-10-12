import { BirthError, DEFAULT_CONVENTIONS, resolveBirth, type BirthInput } from '@/lib/engine/birth';

export { DEFAULT_CONVENTIONS };

/** Trả về thông báo lỗi nếu ngày sinh không hợp lệ, ngược lại null. */
export function lunarOrSolarValid(base: Omit<BirthInput, 'timeType' | 'certainty'>): string | null {
  try {
    resolveBirth({ ...base, timeType: 'branch', branch: 0, certainty: 'khong-ro' } as BirthInput);
    return null;
  } catch (e) {
    return e instanceof BirthError ? e.message : 'Ngày sinh không hợp lệ.';
  }
}
