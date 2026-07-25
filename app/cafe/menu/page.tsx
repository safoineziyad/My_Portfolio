'use client';

import { useEffect, useState } from 'react';
import type { MenuItem, MenuCategory } from '@/lib/cafe/types';
import Reveal from '@/components/cafe/RevealOnScroll';
import FilterBar from '@/components/cafe/FilterBar';
import MenuCard from '@/components/cafe/MenuCard';

export default function MenuPage() {
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cafe-api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAllItems(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === 'All'
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  return (
    <section className="cafe-section" style={{ marginTop: 80 }}>
      <Reveal>
        <h2 className="section-title">Our Menu</h2>
      </Reveal>
      <Reveal>
        <p className="section-subtitle">Fresh ingredients, bold flavors</p>
      </Reveal>

      <Reveal>
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </Reveal>

      <div className="menu-grid">
        {loading ? (
          <p className="loading-text">Loading menu...</p>
        ) : filtered.length > 0 ? (
          filtered.map((item) => <MenuCard key={item.id} item={item} />)
        ) : (
          <p className="loading-text">No items in this category.</p>
        )}
      </div>
    </section>
  );
}
