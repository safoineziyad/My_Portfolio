'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/cafe/admin')) return null;

  return (
    <footer className="cafe-footer">
      <p>&copy; 2026 Cafe NOMAD. Made with &#10084;&#65039; by Ziyad.</p>
    </footer>
  );
}
