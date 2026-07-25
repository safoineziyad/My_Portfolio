'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cafe/cart-store';

const NAV_ITEMS = [
  { href: '/cafe', label: 'Home' },
  { href: '/cafe/menu', label: 'Menu' },
  { href: '/cafe/reservation', label: 'Reserve' },
  { href: '/cafe/status', label: 'Status' },
  { href: '/cafe/contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { items, initialized, init } = useCartStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isAdmin = pathname.startsWith('/cafe/admin');

  if (isAdmin) return null;

  return (
    <nav className={`cafe-navbar${scrolled ? ' scrolled' : ''}`}>
      <Link href="/cafe" className="logo">
        <span>N</span> Café NOMAD
      </Link>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        &#9776;
      </button>
      <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/cafe/cart" className="cart-link" onClick={closeMenu}>
            Cart{' '}
            <span className={`cart-badge${cartCount > 0 ? ' visible' : ''}`}>
              {cartCount}
            </span>
          </Link>
        </li>
        <li>
          <Link href="/cafe/admin/login" onClick={closeMenu}>
            Staff
          </Link>
        </li>
      </ul>
    </nav>
  );
}
