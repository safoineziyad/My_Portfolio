'use client';

import { MENU_CATEGORIES, type MenuCategory } from '@/lib/cafe/types';

interface FilterBarProps {
  active: MenuCategory;
  onChange: (cat: MenuCategory) => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="filters">
      {MENU_CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-btn${active === cat ? ' active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
