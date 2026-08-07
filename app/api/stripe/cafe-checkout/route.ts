import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { items, customerName, customerEmail, customerPhone, address, specialInstructions } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    if (!customerName || !customerEmail || !customerPhone || !address) {
      return NextResponse.json({ error: 'Delivery details are required' }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'mad',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'}/cafe/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000'}/cafe/checkout`,
      metadata: {
        kind: 'cafe',
        customerName,
        customerEmail,
        customerPhone,
        address,
        specialInstructions: specialInstructions || '',
      },
    });

    logger.info('Cafe Stripe session created', { sessionId: session.id });
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    logger.error('Cafe Stripe checkout error', { error });
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
