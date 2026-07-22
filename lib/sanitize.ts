export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeInput(input: string): string {
  return stripHtml(input)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateContactForm(data: ContactFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!data.subject || data.subject.trim().length < 2) {
    errors.push({ field: 'subject', message: 'Subject must be at least 2 characters.' });
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters.' });
  }

  if (data.honeypot && data.honeypot.length > 0) {
    errors.push({ field: 'honeypot', message: 'Spam detected.' });
  }

  return errors;
}
