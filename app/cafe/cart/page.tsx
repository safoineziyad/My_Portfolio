'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cafe/cart-store';

export default function CartPage() {
  const {
    items,
    initialized,
    init,
    changeQuantity,
    removeItem,
    getTotal,
    getTax,
    getGrandTotal,
  } = useCartStore();

  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) return null;

  const isEmpty = items.length === 0;

  return (
    <section className="form-section" style={{ marginTop: 80 }}>
      <h2 className="section-title">Your Cart</h2>

      {isEmpty ? (
        <div className="cafe-form-container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Your cart is empty.
          </p>
          <Link href="/cafe/menu" className="cafe-btn">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          style={{
                            borderRadius: 8,
                            objectFit: 'cover',
                            marginRight: 8,
                            verticalAlign: 'middle',
                          }}
                        />
                      )}
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.price} MAD</td>
                    <td>
                      <button
                        className="qty-btn"
                        onClick={() => changeQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => changeQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      <strong>{item.price * item.quantity} MAD</strong>
                    </td>
                    <td>
                      <button
                        className="cafe-btn cafe-btn-danger cafe-btn-sm"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
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
            <Link
              href="/cafe/checkout"
              className="cafe-btn"
              style={{ width: '100%', marginTop: '1.5rem', display: 'block', textAlign: 'center' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
