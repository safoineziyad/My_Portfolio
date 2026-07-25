'use client';

import { useEffect, useState, useMemo } from 'react';
import type { MenuItem, MenuCategory } from '@/lib/cafe/types';
import Reveal from '@/components/cafe/RevealOnScroll';
import FilterBar from '@/components/cafe/FilterBar';
import MenuCard from '@/components/cafe/MenuCard';
import MenuSkeleton from '@/components/cafe/MenuSkeleton';

export default function MenuPage() {
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [search, setSearch] = useState('');
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

  const filtered = useMemo(() => {
    let items = allItems;
    if (activeCategory !== 'All') {
      items = items.filter((item) => item.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, activeCategory, search]);

  return (
    <section className="cafe-section" style={{ marginTop: 80 }}>
      <Reveal>
        <h2 className="section-title">Our Menu</h2>
      </Reveal>
      <Reveal>
        <p className="section-subtitle">Fresh ingredients, bold flavors</p>
      </Reveal>

      <Reveal>
        <div className="search-bar">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Reveal>

      <Reveal>
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </Reveal>

      <div className="menu-grid">
        {loading ? (
          <MenuSkeleton />
        ) : filtered.length > 0 ? (
          filtered.map((item) => <MenuCard key={item.id} item={item} />)
        ) : (
          <p className="loading-text">
            {search
              ? `No items found for "${search}"`
              : 'No items in this category.'}
          </p>
        )}
      </div>
    </section>
  );
}
