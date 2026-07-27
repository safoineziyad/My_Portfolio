import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Ziyad Portfolio <onboarding@resend.dev>',
  replyTo,
}: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return { id: 'skipped', success: false };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { replyTo: [replyTo] } : {}),
    });
    return { id: result.data?.id, success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { id: null, success: false };
  }
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return sendEmail({
    to: 'safoineziyad@gmail.com',
    replyTo: email,
    subject: `[Portfolio] ${subject} - from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">Sent from Ziyad Portfolio Contact Form</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation({
  customerEmail,
  customerName,
  orderNumber,
  items,
  total,
}: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}) {
  const itemsHtml = items
    .map((item) => `<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.name}</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price.toFixed(2)}</td></tr>`)
    .join('');

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Order Confirmed!</h2>
        <p>Hi ${customerName},</p>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead><tr style="background: #f8fafc;"><th style="padding: 8px; text-align: left;">Item</th><th style="padding: 8px; text-align: center;">Qty</th><th style="padding: 8px; text-align: right;">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr><td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td><td style="padding: 8px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td></tr></tfoot>
        </table>
        <p style="color: #94a3b8; font-size: 12px;">Thank you for your order!</p>
      </div>
    `,
  });
}

export async function sendReservationConfirmation({
  customerEmail,
  customerName,
  date,
  time,
  guests,
}: {
  customerEmail: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
}) {
  return sendEmail({
    to: customerEmail,
    subject: 'Reservation Confirmed - Cafe NOMAD',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Reservation Confirmed!</h2>
        <p>Hi ${customerName},</p>
        <p>Your table at Cafe NOMAD has been reserved.</p>
        <div style="background: #fffbeb; border-radius: 8px; padding: 20px; margin: 16px 0; border: 1px solid #fde68a;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Guests:</strong> ${guests}</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">Cafe NOMAD - Marrakech</p>
      </div>
    `,
  });
}

export async function sendLowStockAlert({
  productName,
  currentStock,
  threshold,
}: {
  productName: string;
  currentStock: number;
  threshold: number;
}) {
  return sendEmail({
    to: 'safoineziyad@gmail.com',
    subject: `Low Stock Alert: ${productName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Low Stock Alert</h2>
        <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 16px 0; border: 1px solid #fecaca;">
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Current Stock:</strong> ${currentStock}</p>
          <p><strong>Threshold:</strong> ${threshold}</p>
        </div>
        <p>Please restock this item soon.</p>
      </div>
    `,
  });
}
