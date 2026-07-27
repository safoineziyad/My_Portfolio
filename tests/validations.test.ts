describe('Zod Validation Schemas', () => {
  test('login schema validates correct input', () => {
    const { loginSchema } = require('@/lib/validations');
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  test('login schema rejects invalid email', () => {
    const { loginSchema } = require('@/lib/validations');
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  test('login schema rejects short password', () => {
    const { loginSchema } = require('@/lib/validations');
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  test('contact schema validates correct input', () => {
    const { contactSchema } = require('@/lib/validations');
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a test message that is long enough',
    });
    expect(result.success).toBe(true);
  });

  test('contact schema rejects empty message', () => {
    const { contactSchema } = require('@/lib/validations');
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hello',
      message: '',
    });
    expect(result.success).toBe(false);
  });

  test('product schema validates correct input', () => {
    const { productSchema } = require('@/lib/validations');
    const result = productSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: 29.99,
      stock: 100,
    });
    expect(result.success).toBe(true);
  });

  test('product schema rejects negative price', () => {
    const { productSchema } = require('@/lib/validations');
    const result = productSchema.safeParse({
      name: 'Test Product',
      slug: 'test-product',
      price: -10,
    });
    expect(result.success).toBe(false);
  });

  test('review schema validates correct input', () => {
    const { reviewSchema } = require('@/lib/validations');
    const result = reviewSchema.safeParse({
      rating: 5,
      title: 'Great!',
      content: 'Really enjoyed this product.',
      productId: 'abc123',
    });
    expect(result.success).toBe(true);
  });

  test('review schema rejects rating out of range', () => {
    const { reviewSchema } = require('@/lib/validations');
    const result = reviewSchema.safeParse({
      rating: 6,
      productId: 'abc123',
    });
    expect(result.success).toBe(false);
  });

  test('cafe order schema validates correct input', () => {
    const { cafeOrderSchema } = require('@/lib/validations');
    const result = cafeOrderSchema.safeParse({
      items: [{ id: 1, name: 'Latte', quantity: 2, price: 35 }],
      customerName: 'Ziyad',
      customerPhone: '+212600000000',
    });
    expect(result.success).toBe(true);
  });

  test('cafe reservation schema validates correct input', () => {
    const { cafeReservationSchema } = require('@/lib/validations');
    const result = cafeReservationSchema.safeParse({
      name: 'Ziyad',
      phone: '+212600000000',
      date: '2026-08-01',
      time: '19:00',
      guests: 4,
    });
    expect(result.success).toBe(true);
  });
});
