'use client';

import { usePathname } from 'next/navigation';

const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://instagram.com', icon: 'IG' },
  { name: 'Facebook', url: 'https://facebook.com', icon: 'FB' },
  { name: 'TikTok', url: 'https://tiktok.com', icon: 'TK' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/cafe/admin')) return null;

  return (
    <footer className="cafe-footer">
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          textAlign: 'left',
          marginBottom: '3rem',
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              color: 'var(--gold)',
              marginBottom: '1rem',
            }}
          >
            Café NOMAD
          </h4>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.7 }}>
            Born in the heart of the Marrakech Medina. A sanctuary for coffee
            lovers and travelers alike.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              color: 'var(--cream)',
              marginBottom: '1rem',
            }}
          >
            Opening Hours
          </h4>
          <div style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 2 }}>
            <p>Mon - Fri: 7:00 AM - 10:00 PM</p>
            <p>Saturday: 8:00 AM - 11:00 PM</p>
            <p>Sunday: 8:00 AM - 9:00 PM</p>
          </div>
        </div>

        <div>
          <h4
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              color: 'var(--cream)',
              marginBottom: '1rem',
            }}
          >
            Location
          </h4>
          <div style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 2 }}>
            <p>Rue Sidi Bouamar, Medina</p>
            <p>Marrakech 40000, Morocco</p>
            <p style={{ marginTop: 4 }}>+212 5 24 00 00 00</p>
          </div>
        </div>

        <div>
          <h4
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              color: 'var(--cream)',
              marginBottom: '1rem',
            }}
          >
            Follow Us
          </h4>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '1px solid var(--terracotta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--terracotta)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.3s ease',
                  letterSpacing: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--terracotta)';
                  e.currentTarget.style.color = 'var(--cream)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--terracotta)';
                }}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(247,239,225,0.1)',
          paddingTop: '2rem',
          textAlign: 'center',
        }}
      >
        <p>&copy; 2026 Cafe NOMAD. Made with &#10084;&#65039; by Ziyad.</p>
      </div>
    </footer>
  );
}
