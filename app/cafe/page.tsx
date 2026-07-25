'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MenuItem } from '@/lib/cafe/types';
import Reveal from '@/components/cafe/RevealOnScroll';
import MenuCard from '@/components/cafe/MenuCard';
import MenuSkeleton from '@/components/cafe/MenuSkeleton';

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800',
    alt: 'Cafe interior with warm lighting',
    label: 'Our Space',
  },
  {
    src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=600',
    alt: 'Freshly brewed coffee',
    label: 'Fresh Brews',
  },
  {
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600',
    alt: 'Latte art in a ceramic cup',
    label: 'Latte Art',
  },
  {
    src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600',
    alt: 'Colorful pastries and desserts',
    label: 'Sweet Treats',
  },
  {
    src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600',
    alt: 'Brunch plate with waffles',
    label: 'Brunch',
  },
];

export default function CafeHomePage() {
  const [specials, setSpecials] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cafe-api/menu?popular=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setSpecials(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="cafe-hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Café NOMAD</h1>
          <p>
            Experience the finest coffee in Marrakech. Crafted with passion,
            served with art.
          </p>
          <Link href="/cafe/reservation" className="cafe-btn cafe-btn-outline">
            Book a Table
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <div className="about-container">
          <Reveal className="about-text">
            <h2>Our Story</h2>
            <p>
              Born in the heart of the Marrakech Medina, Café NOMAD is a
              sanctuary for coffee lovers and travelers alike. We blend
              traditional Moroccan hospitality with modern coffee culture.
            </p>
            <p>
              Our beans are ethically sourced from the Atlas Mountains and
              roasted in small batches every morning. Every cup tells a story of
              dedication, from the farmer to the roaster, straight to your
              hands.
            </p>
            <Link href="/cafe/menu" className="cafe-btn">
              Explore Menu
            </Link>
          </Reveal>
          <Reveal className="about-image">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800"
              alt="Cafe Interior"
              width={800}
              height={500}
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* Today's Specials */}
      <section className="cafe-section">
        <Reveal>
          <h2 className="section-title">Today&apos;s Specials</h2>
        </Reveal>
        <Reveal>
          <p className="section-subtitle">Handcrafted just for you</p>
        </Reveal>
        <div className="menu-grid">
          {loading ? (
            <MenuSkeleton />
          ) : specials.length > 0 ? (
            specials.map((item) => <MenuCard key={item.id} item={item} />)
          ) : (
            <p className="loading-text">No specials available today.</p>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="cafe-section">
        <Reveal>
          <h2 className="section-title">The NOMAD Experience</h2>
        </Reveal>
        <Reveal>
          <p className="section-subtitle">A glimpse into our world</p>
        </Reveal>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img, i) => (
            <Reveal key={i} className="gallery-item">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 25vw"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span>{img.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
