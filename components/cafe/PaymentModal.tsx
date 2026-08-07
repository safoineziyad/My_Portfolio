'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useCartStore } from '@/lib/cafe/cart-store';
import {
  luhnCheck,
  detectCardType,
  formatCardNumber,
  formatExpiry,
  validateExpiry,
  validateCvv,
  sanitizeInput,
} from '@/lib/cafe/payment-utils';

type View = 'select' | 'card' | 'processing' | 'success';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderNumber: string) => void;
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    specialInstructions: string;
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  onOrderSuccess,
  formData,
}: PaymentModalProps) {
  const { items, getGrandTotal, getTax, getTotal, clear } = useCartStore();
  const [view, setView] = useState<View>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardTypeIcon, setCardTypeIcon] = useState('');
  const [cardTypeColor, setCardTypeColor] = useState('');
  const [cardTypeVisible, setCardTypeVisible] = useState(false);
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [cvvVisible, setCvvVisible] = useState(false);
  const lastSubmitRef = useRef(0);
  const cardNumberRef = useRef<HTMLInputElement>(null);

  const RATE_LIMIT_MS = 3000;

  useEffect(() => {
    if (isOpen) {
      setView('select');
      setIsProcessing(false);
      setErrors({ cardNumber: '', cardExpiry: '', cardCvv: '' });
    }
  }, [isOpen]);

  const showView = useCallback((v: View) => {
    setView(v);
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isProcessing) {
        onClose();
      }
    },
    [isProcessing, onClose]
  );

  const handleCardNumberChange = (val: string) => {
    const formatted = formatCardNumber(val);
    setCardNumber(formatted);
    const ct = detectCardType(formatted);
    if (ct) {
      setCardTypeIcon(ct.icon);
      setCardTypeColor(ct.color);
      setCardTypeVisible(true);
    } else {
      setCardTypeVisible(false);
    }
    setErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (val: string) => {
    setCardExpiry(formatExpiry(val));
    setErrors((prev) => ({ ...prev, cardExpiry: '' }));
  };

  const handleCvvChange = (val: string) => {
    setCardCvv(val.replace(/\D/g, '').slice(0, 4));
    setErrors((prev) => ({ ...prev, cardCvv: '' }));
  };

  const clearErrors = () => {
    setErrors({ cardNumber: '', cardExpiry: '', cardCvv: '' });
  };

  const submitOrder = async (method: string, methodLabel: string) => {
    setIsProcessing(true);
    showView('processing');

    const orderData = {
      ...formData,
      customerName: sanitizeInput(formData.customerName),
      customerEmail: sanitizeInput(formData.customerEmail),
      customerPhone: sanitizeInput(formData.customerPhone),
      address: sanitizeInput(formData.address),
      specialInstructions: sanitizeInput(formData.specialInstructions),
      paymentMethod: method,
      paymentLabel: methodLabel,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    };

    if (orderData.items.length === 0) {
      setIsProcessing(false);
      showView('card');
      alert('Your cart is empty.');
      return;
    }

    try {
      if (method === 'card') {
        const checkoutRes = await fetch('/api/stripe/cafe-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            address: orderData.address,
            specialInstructions: orderData.specialInstructions,
          }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }
        setIsProcessing(false);
        showView('card');
        alert(checkoutData.error || 'Unable to start payment. Please try again.');
        return;
      }

      const res = await fetch('/api/cafe-api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        showView('success');
        clear();
        await new Promise((r) => setTimeout(r, 1200));
        onOrderSuccess(result.order.orderNumber);
        onClose();
      } else {
        setIsProcessing(false);
        showView('card');
        alert(result.message || 'Payment failed. Please try again.');
      }
    } catch {
      setIsProcessing(false);
      showView('card');
      alert('Network error. Check your connection and try again.');
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    clearErrors();
    let hasError = false;
    const cardNum = cardNumber.replace(/\s/g, '');
    const isAmex = detectCardType(cardNumber)?.type === 'Amex';

    if (!luhnCheck(cardNum)) {
      setErrors((prev) => ({ ...prev, cardNumber: 'Invalid card number' }));
      hasError = true;
    }
    if (!validateExpiry(cardExpiry)) {
      setErrors((prev) => ({
        ...prev,
        cardExpiry: 'Invalid or expired date',
      }));
      hasError = true;
    }
    if (!validateCvv(cardCvv, isAmex)) {
      setErrors((prev) => ({
        ...prev,
        cardCvv: isAmex ? 'CVV must be 4 digits' : 'CVV must be 3 digits',
      }));
      hasError = true;
    }
    if (hasError) return;

    const now = Date.now();
    if (now - lastSubmitRef.current < RATE_LIMIT_MS) {
      alert('Please wait a moment before trying again.');
      return;
    }
    lastSubmitRef.current = now;

    await submitOrder('card', 'Credit Card ending in ' + cardNum.slice(-4));
  };

  const grandTotal = getGrandTotal();

  return (
    <div
      className={`payment-modal-overlay${isOpen ? ' active' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="payment-modal">
        <button
          className="payment-modal-close"
          onClick={() => {
            if (!isProcessing) onClose();
          }}
        >
          &times;
        </button>

        <div className="payment-modal-header">
          <h3>Complete Your Order</h3>
          <div className="payment-modal-summary">
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
              <span>{grandTotal} MAD</span>
            </div>
          </div>
        </div>

        <div className="payment-modal-body">
          {/* Select Method View */}
          <div className={`payment-view${view !== 'select' ? ' hidden' : ''}`}>
            <p className="payment-view-label">Choose Payment Method</p>
            <div className="payment-method-grid">
              <button
                className="payment-method-btn"
                onClick={() => {
                  showView('card');
                  setTimeout(() => cardNumberRef.current?.focus(), 100);
                }}
              >
                <div className="payment-method-icon">&#128179;</div>
                <span>Credit / Debit Card</span>
                <small>Visa, Mastercard, Amex</small>
              </button>
            </div>
          </div>

          {/* Card View */}
          <div className={`payment-view${view !== 'card' ? ' hidden' : ''}`}>
            <button
              className="payment-back-btn"
              onClick={() => {
                clearErrors();
                showView('select');
              }}
            >
              &larr; Back
            </button>
            <p className="payment-view-label">&#128179; Card Payment</p>
            <form onSubmit={handleCardSubmit} noValidate>
              <div className="form-group">
                <label>Card Number</label>
                <div className="card-input-wrap">
                  <input
                    ref={cardNumberRef}
                    type="text"
                    className={`form-control${errors.cardNumber ? ' input-error' : ''}`}
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <span
                    className={`card-type-icon${cardTypeVisible ? ' visible' : ''}`}
                    style={{ color: cardTypeColor }}
                  >
                    {cardTypeIcon}
                  </span>
                </div>
                <div className="field-error">{errors.cardNumber}</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    className={`form-control${errors.cardExpiry ? ' input-error' : ''}`}
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                    placeholder="MM / YY"
                    required
                  />
                  <div className="field-error">{errors.cardExpiry}</div>
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <div className="card-input-wrap">
                    <input
                      type={cvvVisible ? 'text' : 'password'}
                      className={`form-control${errors.cardCvv ? ' input-error' : ''}`}
                      value={cardCvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      placeholder="&bull;&bull;&bull;"
                      required
                    />
                    <button
                      type="button"
                      className="cvv-toggle"
                      title="Show CVV"
                      onClick={() => setCvvVisible(!cvvVisible)}
                    >
                      &#128065;
                    </button>
                  </div>
                  <div className="field-error">{errors.cardCvv}</div>
                </div>
              </div>
              <div className="form-group">
                <label className="save-card-toggle">
                  <input type="checkbox" /> Save this card for next time
                </label>
              </div>
              <div className="security-badge">
                <span>&#128274;</span> Your payment info is encrypted and secure
              </div>
              <button
                type="submit"
                className="cafe-btn payment-submit-btn"
                disabled={isProcessing}
              >
                <span className="btn-text">Pay {grandTotal} MAD</span>
                <span className={`btn-spinner${isProcessing ? '' : ' hidden'}`} />
              </button>
            </form>
          </div>

          {/* Processing View */}
          <div className={`payment-view${view !== 'processing' ? ' hidden' : ''}`}>
            <div className="processing-animation">
              <div className="processing-spinner" />
              <p className="processing-text">Verifying payment...</p>
              <p className="processing-subtext">
                Please do not close this window
              </p>
            </div>
          </div>

          {/* Success View */}
          <div className={`payment-view${view !== 'success' ? ' hidden' : ''}`}>
            <div className="payment-success-content">
              <svg
                className="checkmark-svg checkmark-svg--lg"
                viewBox="0 0 52 52"
              >
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
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>
                Payment Successful
              </h3>
              <p style={{ color: 'var(--coffee)', marginTop: '0.5rem' }}>
                Placing your order...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
