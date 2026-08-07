'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cafe/cart-store';
import PaymentModal from '@/components/cafe/PaymentModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, initialized, init, getTotal, getTax, getGrandTotal, clear } =
    useCartStore();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    specialInstructions: '',
  });

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      fetch('/api/stripe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order?.orderNumber) {
            clear();
            setOrderNumber(data.order.orderNumber);
            setOrderSuccess(true);
          }
        })
        .catch(() => undefined);
    }
  }, [initialized, items, clear]);

  useEffect(() => {
    if (initialized && items.length === 0 && !orderSuccess) {
      router.push('/cafe/cart');
    }
  }, [initialized, items.length, orderSuccess, router]);

  if (!initialized) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    setPaymentOpen(true);
  };

  const handleOrderSuccess = (num: string) => {
    setOrderNumber(num);
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <section className="form-section" style={{ marginTop: 80 }}>
        <div style={{ maxWidth: 650, margin: '0 auto' }}>
          <div className="cafe-form-container" style={{ textAlign: 'center' }}>
            <div className="order-success-icon">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              Order Confirmed!
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Your order number is:
            </p>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--terracotta)',
                marginBottom: '1.5rem',
              }}
            >
              {orderNumber}
            </p>
            <p style={{ marginBottom: '2rem' }}>
              You can check your order status anytime using your email.
            </p>
            <Link href="/cafe" className="cafe-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="form-section" style={{ marginTop: 80 }}>
      <h2 className="section-title">Checkout</h2>

      <div className="cafe-form-container">
        <form onSubmit={handleOpenPayment}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--terracotta)' }}>
            Delivery Details
          </h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                className="form-control"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, city, area..."
              maxLength={200}
              required
            />
          </div>
          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              className="form-control"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={2}
              maxLength={300}
              placeholder="Ring bell, leave at door..."
            />
          </div>

          <div className="cart-summary" style={{ maxWidth: '100%', marginTop: '2rem' }}>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{getTotal()} MAD</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{getTax()} MAD</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{getGrandTotal()} MAD</span>
            </div>
          </div>

          <button
            type="submit"
            className="cafe-btn"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            Pay Now
          </button>
        </form>
      </div>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        formData={formData}
      />
    </section>
  );
}
