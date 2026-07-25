import type { CardType } from './types';

export function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectCardType(num: string): CardType | null {
  const d = num.replace(/\s/g, '');
  if (/^4/.test(d)) return { type: 'Visa', icon: 'VISA', color: '#1a1f71' };
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d))
    return { type: 'Mastercard', icon: 'MC', color: '#eb001b' };
  if (/^3[47]/.test(d)) return { type: 'Amex', icon: 'AMEX', color: '#006fcf' };
  if (/^6(?:011|5)/.test(d))
    return { type: 'Discover', icon: 'DISC', color: '#ff6000' };
  if (/^35(?:2[89]|[3-8])/.test(d))
    return { type: 'JCB', icon: 'JCB', color: '#0e4c96' };
  return null;
}

export function formatCardNumber(val: string): string {
  const d = val.replace(/\D/g, '').slice(0, 16);
  const ct = detectCardType(d);
  if (ct && ct.type === 'Amex') {
    return d
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a: string, b: string, c: string) =>
        [a, b, c].filter(Boolean).join(' ')
      )
      .trim();
  }
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatExpiry(val: string): string {
  const d = val.replace(/\D/g, '').slice(0, 4);
  if (d.length >= 2) return d.slice(0, 2) + ' / ' + d.slice(2);
  return d;
}

export function validateExpiry(val: string): boolean {
  const d = val.replace(/\D/g, '');
  if (d.length < 4) return false;
  const month = parseInt(d.slice(0, 2), 10);
  const year = parseInt('20' + d.slice(2, 4), 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month);
  return expiry > now;
}

export function validateCvv(val: string, isAmex: boolean): boolean {
  const d = val.replace(/\D/g, '');
  return isAmex ? /^\d{4}$/.test(d) : /^\d{3}$/.test(d);
}

export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function sanitizeInput(val: string): string {
  return escapeHtml(String(val).trim().replace(/[<>"']/g, ''));
}

export const TAX_RATE = 0.10;

export function calculateTax(total: number): number {
  return Math.round(total * TAX_RATE * 100) / 100;
}

export function calculateGrandTotal(total: number): number {
  return Math.round((total + calculateTax(total)) * 100) / 100;
}
