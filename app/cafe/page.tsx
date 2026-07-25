'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { MenuItem } from '@/lib/cafe/types';
import Reveal from '@/components/cafe/RevealOnScroll';
import MenuCard from '@/components/cafe/MenuCard';

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
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800"
              alt="Cafe Interior"
            />
          </Reveal>
        </div>
      </section>

      <section className="cafe-section">
        <Reveal>
          <h2 className="section-title">Today&apos;s Specials</h2>
        </Reveal>
        <Reveal>
          <p className="section-subtitle">Handcrafted just for you</p>
        </Reveal>
        <div className="menu-grid">
          {loading ? (
            <p className="loading-text">Loading specials...</p>
          ) : specials.length > 0 ? (
            specials.map((item) => <MenuCard key={item.id} item={item} />)
          ) : (
            <p className="loading-text">No specials available today.</p>
          )}
        </div>
      </section>
    </>
  );
}
