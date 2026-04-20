import type { AccountResponse } from '../api/account';
import type { AccountBlock } from '../components/BlockRenderer';

const KUDA_LOGO = require('../../assets/kuda-bank-logo.png');

export function toBlocks(account: AccountResponse): AccountBlock[] {
  return [
    { type: 'profile', title: 'Kuda Bank', icon: KUDA_LOGO },
    {
      type: 'infoCard',
      rows: [
        { label: 'Type of account', value: account.accountType },
        { label: 'Account No', value: account.accountNumber },
        {
          label: 'Avaliable Balance',
          value: formatCurrency(account.availableBalance, account.currency),
          tone: 'success',
        },
        { label: 'Date added', value: account.dateAdded },
      ],
    },
    {
      type: 'transactionsCard',
      title: 'Recent Transactions',
      items: account.transactions.map((tx) => ({
        name: tx.name,
        subtitle: `${tx.bank} ${tx.time}`,
        amount: formatAmount(tx.amount, account.currency),
        positive: tx.amount > 0,
        initial: tx.name.slice(0, 1).toUpperCase(),
      })),
    },
    { type: 'spacer', size: 16 },
    { type: 'button', label: 'Log out', action: { kind: 'logout' } },
  ];
}

export function currencyGlyph(currency: string): string {
  switch (currency.toUpperCase()) {
    case 'NGN':
      return 'N';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return `${currency} `;
  }
}

export function formatCurrency(value: number, currency: string): string {
  return `${currencyGlyph(currency)}${formatNumber(value)}.00`;
}

export function formatAmount(value: number, currency: string): string {
  const sign = value > 0 ? '+' : '-';
  return `${sign}${currencyGlyph(currency)}${formatNumber(value)}`;
}

function formatNumber(n: number): string {
  const abs = Math.abs(n);
  return Math.trunc(abs).toLocaleString('en-US');
}
