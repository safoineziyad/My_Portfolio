'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/cafe/cart-store';

export default function Toast() {
  const toast = useCartStore((s) => s.toast);
  const hideToast = useCartStore((s) => s.hideToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return (
    <div className={`cart-toast${toast ? ' show' : ''}`}>{toast}</div>
  );
}
