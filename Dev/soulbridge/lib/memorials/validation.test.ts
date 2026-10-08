import { describe, it, expect } from 'vitest';
import { isValidIsoDate, validateLifeDates } from './validation';

describe('memorial life dates', () => {
  it('accepts valid ISO date-only values and leap years', () => {
    expect(isValidIsoDate('2000-02-29')).toBe(true);
    expect(isValidIsoDate('2026-10-08')).toBe(true);
  });
  it('rejects invalid and rolled-over dates', () => {
    for (const value of ['', null, '2023-02-29', '2025-13-01', '2026-02-30', '01/01/2020']) {
      expect(isValidIsoDate(value)).toBe(false);
    }
  });
  it('rejects reversed dates and allows the same day', () => {
    expect(validateLifeDates('2020-01-01', '2019-01-01')).toContain('before');
    expect(validateLifeDates('2020-01-01', '2020-01-01')).toBe(null);
  });
});
