/**
 * Formats a numeric value into currency format.
 * Defaults to Indian Rupee (₹) with Indian numbering system (e.g. ₹1,50,000).
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'INR',
  formatStyle: 'indian' | 'international' | 'standard' = 'indian'
): string {
  const symbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbolMap[currencyCode] || '₹';
  const val = Math.abs(amount);

  let formattedVal = '';

  if (formatStyle === 'indian' && (currencyCode === 'INR' || currencyCode === '₹')) {
    // Format according to Indian numbering system (Lakhs, Crores)
    formattedVal = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(val);
  } else {
    // Standard international formatting
    formattedVal = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(val);
  }

  return `${amount < 0 ? '-' : ''}${symbol}${formattedVal}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(yearMonthKey: string): string {
  // Key format "2026-03" -> "March 2026"
  if (!yearMonthKey) return '';
  const [year, month] = yearMonthKey.split('-');
  if (!year || !month) return yearMonthKey;
  
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

export function getYearMonthKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getAvailableMonthsList(): { label: string; key: string }[] {
  // Generate past 6 months and next 6 months for selection
  const months = [];
  const now = new Date(2026, 2, 1); // Current reference March 2026

  for (let i = -5; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = getYearMonthKey(d);
    const label = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
    months.push({ label, key });
  }

  return months;
}

export function getDaysInMonth(yearMonthKey: string): number {
  const [year, month] = yearMonthKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}
