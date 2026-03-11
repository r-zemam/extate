import { formatDate, formatTimestamp, getPropertyAddressLabel } from '../formatting';

describe('formatDate', () => {
  it('should format ISO date string to readable format', () => {
    const result = formatDate('2026-03-01');
    expect(result).toBe('March 1, 2026');
  });

  it('should format date with different month', () => {
    const result = formatDate('2025-12-25');
    expect(result).toBe('December 25, 2025');
  });

  it('should handle ISO timestamp format', () => {
    const result = formatDate('2026-03-01T10:30:00Z');
    expect(result).toContain('2026');
    expect(result).toContain('March');
  });
});

describe('formatTimestamp', () => {
  it('should format ISO timestamp to readable format with time', () => {
    const result = formatTimestamp('2026-03-01T14:30:00Z');
    expect(result).toContain('2026');
    expect(result).toContain('March');
    expect(result).toContain('PM');
  });

  it('should include AM/PM indicator', () => {
    const morningResult = formatTimestamp('2026-03-01T09:00:00Z');
    const eveningResult = formatTimestamp('2026-03-01T20:00:00Z');
    
    // One should have AM or PM (depending on timezone)
    expect(morningResult).toMatch(/AM|PM/);
    expect(eveningResult).toMatch(/AM|PM/);
  });
});

describe('getPropertyAddressLabel', () => {
  it('should return "Property Address" for deed', () => {
    expect(getPropertyAddressLabel('deed')).toBe('Property Address');
  });

  it('should return "Property Address" for title', () => {
    expect(getPropertyAddressLabel('title')).toBe('Property Address');
  });

  it('should return "Estate / Property Description" for inheritance_record', () => {
    expect(getPropertyAddressLabel('inheritance_record')).toBe('Estate / Property Description');
  });

  it('should return "Tax Parcel / Property Address" for tax_document', () => {
    expect(getPropertyAddressLabel('tax_document')).toBe('Tax Parcel / Property Address');
  });

  it('should be case insensitive', () => {
    expect(getPropertyAddressLabel('DEED')).toBe('Property Address');
    expect(getPropertyAddressLabel('Inheritance_Record')).toBe('Estate / Property Description');
  });

  it('should return default "Property Address" for unknown types', () => {
    expect(getPropertyAddressLabel('unknown')).toBe('Property Address');
    expect(getPropertyAddressLabel('')).toBe('Property Address');
  });
});
