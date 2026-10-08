/** Strict date-only validation prevents JS Date rollover and impossible life spans. */
export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateLifeDates(birthDate: unknown, deathDate: unknown): string | null {
  if (!isValidIsoDate(birthDate) || !isValidIsoDate(deathDate)) {
    return 'Please enter valid dates of birth and passing.';
  }
  if (birthDate > deathDate) {
    return 'Date of passing cannot be before date of birth.';
  }
  return null;
}
