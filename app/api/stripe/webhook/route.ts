import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';
import prisma from '@/ecommerce/lib/db';
import { createOrdersFromCart } from '@/ecommerce/lib/orders';
import { sendOrderConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!webhookSecret || webhookSecret.includes('your_stripe')) {
    logger.warn('STRIPE_WEBHOOK_SECRET is not configured; webhook signature not verified');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logger.info('Payment successful', { sessionId: session.id });

        try {
          const userId = session.metadata?.userId;

          if (session.metadata?.kind === 'cafe') {
            const existing = await prisma.cafeOrder.findUnique({ where: { stripeSessionId: session.id } });
            if (!existing && session.metadata?.customerName && session.metadata?.customerEmail) {
              const items = session.line_items?.data || [];
              let total = 0;
              const orderItems = items.map((li) => {
                const price = (li.amount_total || 0) / 100 / Math.max(li.quantity || 1, 1);
                total += price * (li.quantity || 1);
                return { menuItemId: 0, name: li.description || 'Item', quantity: li.quantity || 1, priceAtTime: price };
              });
              const tax = Math.round(total * 0.1 * 100) / 100;
              total = Math.round((total + tax) * 100) / 100;

              await prisma.cafeOrder.create({
                data: {
                  id: Date.now().toString(),
                  orderNumber: 'CAFE-' + Date.now(),
                  customerName: session.metadata.customerName,
                  customerEmail: session.metadata.customerEmail,
                  customerPhone: session.metadata.customerPhone || '',
                  address: session.metadata.address || '',
                  specialInstructions: session.metadata.specialInstructions || '',
                  status: 'pending',
                  paymentMethod: 'card',
                  paymentStatus: 'paid',
                  stripeSessionId: session.id,
                  total,
                  createdAt: new Date().toISOString(),
                  items: { create: orderItems },
                },
              });
            }
          } else if (userId) {
            const existing = await prisma.marketplaceOrder.findFirst({ where: { stripeSessionId: session.id } });
            if (!existing) {
              try {
                await createOrdersFromCart(userId, {
                  paymentMethod: 'card',
                  paymentStatus: 'paid',
                  shippingAddress: session.metadata?.shippingAddress || undefined,
                  stripeSessionId: session.id,
                });
              } catch (err) {
                logger.error('Webhook order creation failed', { error: err, sessionId: session.id });
              }
            }
          }
        } catch (err) {
          logger.error('Webhook order recording failed', { error: err, sessionId: session.id });
        }

        if (session.customer_details?.email) {
          sendOrderConfirmation({
            customerEmail: session.customer_details.email,
            customerName: session.customer_details.name || 'Customer',
            orderNumber: session.id,
            items: [{ name: 'Order', quantity: 1, price: (session.amount_total || 0) / 100 }],
            total: (session.amount_total || 0) / 100,
          }).catch((err) => logger.error('Failed to send payment confirmation email', { error: err }));
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        logger.warn('Payment failed', { paymentIntentId: intent.id });
        break;
      }
      default:
        logger.info('Unhandled Stripe event', { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error('Webhook verification failed', { error: err });
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
