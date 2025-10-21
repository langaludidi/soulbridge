import { describe, it, expect } from 'vitest';
import { toSlugFromFullName, memorialPathFromFullName, validateSlug } from '../lib/slug';

describe('toSlugFromFullName', () => {
  // Basic cases
  it('should handle simple names', () => {
    expect(toSlugFromFullName('Thandiwe Tini')).toBe('thandiwe-tini');
  });

  // Unicode/accented names
  it('should handle accented characters', () => {
    expect(toSlugFromFullName('Thandíwé Tíni')).toBe('thandiwe-tini');
    expect(toSlugFromFullName('Álvaro Siza')).toBe('alvaro-siza');
  });

  // Hyphenated and apostrophe names
  it('should handle apostrophes', () => {
    expect(toSlugFromFullName("O'Connor, Seán")).toBe('sean-o-connor');
  });

  it('should handle hyphenated first names', () => {
    expect(toSlugFromFullName('Jean-Michel Basquiat')).toBe('jean-michel-basquiat');
  });

  // Multi-word surnames (SA common)
  it('should handle multi-word surnames', () => {
    expect(toSlugFromFullName('Mduduzi van der Merwe')).toBe('mduduzi-van-der-merwe');
    expect(toSlugFromFullName('De Villiers, Anna')).toBe('anna-de-villiers');
    expect(toSlugFromFullName('Anna de Villiers')).toBe('anna-de-villiers');
  });

  // Honorifics
  it('should remove honorifics', () => {
    expect(toSlugFromFullName('  Mr.  Sipho   Ndlovu  ')).toBe('sipho-ndlovu');
    expect(toSlugFromFullName('Dr. Jane Smith')).toBe('jane-smith');
    expect(toSlugFromFullName('Mrs Smith')).toBe('smith-smith');
    expect(toSlugFromFullName('Prof. David Jones')).toBe('david-jones');
  });

  // Single names
  it('should handle single names by duplicating', () => {
    expect(toSlugFromFullName('Cher')).toBe('cher-cher');
    expect(toSlugFromFullName("N'Dlamini")).toBe('n-dlamini-n-dlamini');
  });

  // Edge cases
  it('should handle extra whitespace', () => {
    expect(toSlugFromFullName('  John   Doe  ')).toBe('john-doe');
  });

  it('should handle comma-separated names', () => {
    expect(toSlugFromFullName('Doe, John')).toBe('john-doe');
  });

  it('should handle special characters', () => {
    expect(toSlugFromFullName('José García')).toBe('jose-garcia');
    expect(toSlugFromFullName('François Müller')).toBe('francois-muller');
  });

  // First letter preservation tests (CRITICAL)
  describe('first letter preservation', () => {
    const testCases = [
      { name: 'Thandiwe Tini', expectedStart: 't', expectedContains: 'tini' },
      { name: 'Álvaro Siza', expectedStart: 'a', expectedContains: 'siza' },
      { name: 'Séan O\'Connor', expectedStart: 's', expectedContains: 'o-connor' },
      { name: 'Émile Zola', expectedStart: 'e', expectedContains: 'zola' },
      { name: 'Ñoño García', expectedStart: 'n', expectedContains: 'garcia' },
    ];

    testCases.forEach(({ name, expectedStart, expectedContains }) => {
      it(`should preserve first letter for "${name}"`, () => {
        const slug = toSlugFromFullName(name);

        // Check starts with normalized first letter
        expect(slug.charAt(0)).toBe(expectedStart);

        // Check contains normalized surname
        expect(slug).toContain(expectedContains);
      });
    });
  });

  // SA-specific names
  describe('South African names', () => {
    it('should handle Afrikaans names', () => {
      expect(toSlugFromFullName('Pieter van der Walt')).toBe('pieter-van-der-walt');
      expect(toSlugFromFullName('Jan du Plessis')).toBe('jan-du-plessis');
    });

    it('should handle Zulu names', () => {
      expect(toSlugFromFullName('Sipho Dlamini')).toBe('sipho-dlamini');
      expect(toSlugFromFullName('Thabo Mbeki')).toBe('thabo-mbeki');
    });

    it('should handle Xhosa names', () => {
      expect(toSlugFromFullName('Mandla Ndlovu')).toBe('mandla-ndlovu');
    });
  });

  // Complex real-world cases
  describe('complex real-world names', () => {
    it('should handle names with titles and multiple parts', () => {
      expect(toSlugFromFullName('Dr. Nelson Rolihlahla Mandela')).toBe('nelson-rolihlahla-mandela');
    });

    it('should handle names with Jr, Sr, III', () => {
      expect(toSlugFromFullName('John Smith Jr.')).toBe('john-smith-jr');
      expect(toSlugFromFullName('William Gates III')).toBe('william-gates-iii');
    });

    it('should handle compound surnames', () => {
      expect(toSlugFromFullName('Maria del Carmen García')).toBe('maria-del-carmen-garcia');
    });
  });
});

describe('memorialPathFromFullName', () => {
  it('should generate correct memorial path', () => {
    expect(memorialPathFromFullName('Thandiwe Tini')).toBe('/thandiwe-tini/page');
    expect(memorialPathFromFullName('Jean-Michel Basquiat')).toBe('/jean-michel-basquiat/page');
  });
});

describe('validateSlug', () => {
  it('should validate correct slugs', () => {
    expect(validateSlug('thandiwe-tini', 'Thandiwe Tini')).toBe(true);
    expect(validateSlug('jean-michel-basquiat', 'Jean-Michel Basquiat')).toBe(true);
  });

  it('should invalidate broken slugs', () => {
    // Missing first letter
    expect(validateSlug('handiwe-tini', 'Thandiwe Tini')).toBe(false);

    // Missing surname
    expect(validateSlug('thandiwe', 'Thandiwe Tini')).toBe(false);

    // Completely wrong
    expect(validateSlug('john-doe', 'Thandiwe Tini')).toBe(false);
  });

  it('should validate slugs with year suffixes', () => {
    expect(validateSlug('thandiwe-tini-1980', 'Thandiwe Tini')).toBe(true);
    expect(validateSlug('thandiwe-tini-2', 'Thandiwe Tini')).toBe(true);
  });
});

// Additional assertion tests
describe('slug invariants', () => {
  const names = [
    'Thandiwe Tini',
    'Thandíwé Tíni',
    "O'Connor, Seán",
    'Jean-Michel Basquiat',
    'Mduduzi van der Merwe',
    'De Villiers, Anna',
    'Álvaro Siza',
    'Mr. Sipho Ndlovu',
    'Cher',
    "N'Dlamini",
  ];

  names.forEach(name => {
    it(`should never drop first letters for "${name}"`, () => {
      const slug = toSlugFromFullName(name);

      // Extract expected first character
      // Handle comma-separated names (Surname, Firstname format)
      const cleanName = name.replace(/^(mr|mrs|ms|miss|dr|prof)\.?\s+/i, '').trim();
      let firstNamePart = cleanName;

      if (cleanName.includes(',')) {
        // For "Surname, Firstname" format, take the part after the comma
        const parts = cleanName.split(',').map(p => p.trim());
        if (parts.length >= 2 && parts[1]) {
          firstNamePart = parts[1].split(/\s+/)[0]; // First word after comma
        }
      } else {
        // For normal format, take first word
        firstNamePart = cleanName.split(/\s+/)[0];
      }

      const firstChar = firstNamePart
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .charAt(0);

      // Slug must start with this character
      expect(slug.charAt(0)).toBe(firstChar);

      // Slug must not be empty
      expect(slug.length).toBeGreaterThan(0);

      // Slug must contain at least one hyphen (unless single name)
      const tokens = cleanName.split(/[\s,]+/).filter(t => t.length > 0);
      if (tokens.length > 1) {
        expect(slug).toContain('-');
      }
    });
  });
});
