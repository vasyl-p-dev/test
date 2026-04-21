import { formatAmount, formatCurrency } from '../src/utils/accountBlocks';

describe('formatCurrency / formatAmount', () => {
  it('prefixes NGN glyph N and appends .00 for balances', () => {
    expect(formatCurrency(1234, 'NGN')).toBe('N1,234.00');
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
    expect(formatCurrency(9, 'EUR')).toBe('€9.00');
  });

  it('falls back to currency code with a space for unknown currencies', () => {
    expect(formatCurrency(5, 'GBP')).toBe('GBP 5.00');
  });

  it('prefixes +/- on transaction amounts', () => {
    expect(formatAmount(100, 'NGN')).toBe('+N100');
    expect(formatAmount(-100, 'NGN')).toBe('-N100');
  });
});
