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
