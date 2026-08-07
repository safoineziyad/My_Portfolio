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
      <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-12 text-left mb-12">
        <div>
          <h4 className="font-[Playfair_Display] text-[1.4rem] text-[var(--gold)] mb-4">
            Café NOMAD
          </h4>
          <p className="text-[0.9rem] leading-[1.8] opacity-70">
            Born in the heart of the Marrakech Medina. A sanctuary for coffee
            lovers and travelers alike.
          </p>
        </div>

        <div>
          <h4 className="font-[Playfair_Display] text-[1.1rem] text-[var(--cream)] mb-4">
            Opening Hours
          </h4>
          <div className="text-[0.9rem] opacity-70 leading-8">
            <p>Mon - Fri: 7:00 AM - 10:00 PM</p>
            <p>Saturday: 8:00 AM - 11:00 PM</p>
            <p>Sunday: 8:00 AM - 9:00 PM</p>
          </div>
        </div>

        <div>
          <h4 className="font-[Playfair_Display] text-[1.1rem] text-[var(--cream)] mb-4">
            Location
          </h4>
          <div className="text-[0.9rem] opacity-70 leading-8">
            <p>Rue Sidi Bouamar, Medina</p>
            <p>Marrakech 40000, Morocco</p>
            <p className="mt-1">+212 5 24 00 00 00</p>
          </div>
        </div>

        <div>
          <h4 className="font-[Playfair_Display] text-[1.1rem] text-[var(--cream)] mb-4">
            Follow Us
          </h4>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="w-[42px] h-[42px] rounded-full border border-[var(--terracotta)] flex items-center justify-center text-[var(--terracotta)] text-[0.75rem] font-bold font-[Poppins] tracking-normal hover:bg-[var(--terracotta)] hover:text-[var(--cream)] transition-all duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 text-center">
        <p>&copy; 2026 Cafe NOMAD. Made with &#10084;&#65039; by Ziyad.</p>
      </div>
    </footer>
  );
}
