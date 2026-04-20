import type { AccountResponse } from '../src/api/account';
import { formatAmount, formatCurrency, toBlocks } from '../src/utils/accountBlocks';

const sample: AccountResponse = {
  accountType: 'Savings',
  accountNumber: '1234567890',
  availableBalance: 12000,
  currency: 'NGN',
  dateAdded: '15/05/20, 10:03 AM',
  transactions: [
    { name: 'John Ogaga', bank: 'Zenith Bank', time: '12:03 AM', amount: 20983 },
    { name: 'The Place Restaurant', bank: 'GT-Bank', time: '12:03 AM', amount: -983 },
  ],
};

describe('toBlocks()', () => {
  it('always starts with a profile block and ends with a logout button', () => {
    const blocks = toBlocks(sample);
    expect(blocks[0]).toMatchObject({ type: 'profile', title: 'Kuda Bank' });
    // Profile block carries a local image asset (require() returns a number).
    expect((blocks[0] as { type: 'profile'; icon: unknown }).icon).toBeDefined();
    expect(blocks[blocks.length - 1]).toEqual({
      type: 'button',
      label: 'Log out',
      action: { kind: 'logout' },
    });
  });

  it('places available balance as a success-tone row', () => {
    const blocks = toBlocks(sample);
    const info = blocks.find((b) => b.type === 'infoCard')! as Extract<
      ReturnType<typeof toBlocks>[number],
      { type: 'infoCard' }
    >;
    const balance = info.rows.find((r) => r.label === 'Avaliable Balance');
    expect(balance?.tone).toBe('success');
    expect(balance?.value).toBe('N12,000.00');
  });

  it('maps each transaction into a normalized item', () => {
    const blocks = toBlocks(sample);
    const tx = blocks.find((b) => b.type === 'transactionsCard')! as Extract<
      ReturnType<typeof toBlocks>[number],
      { type: 'transactionsCard' }
    >;
    expect(tx.items).toHaveLength(2);
    expect(tx.items[0]).toEqual({
      name: 'John Ogaga',
      subtitle: 'Zenith Bank 12:03 AM',
      amount: '+N20,983',
      positive: true,
      initial: 'J',
    });
    expect(tx.items[1].positive).toBe(false);
    expect(tx.items[1].amount).toBe('-N983');
  });
});

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
