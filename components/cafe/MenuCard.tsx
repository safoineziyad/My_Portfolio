'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MenuItem } from '@/lib/cafe/types';
import { useCartStore } from '@/lib/cafe/cart-store';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="menu-card">
      {item.image && (
        <div className="menu-card-img-wrap">
          <Image
            src={item.image}
            alt={item.name}
            className="menu-card-img"
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}
      <div className="menu-card-body">
        <span className="menu-cat">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-card-footer">
          <div className="menu-price">{item.price} MAD</div>
          <button
            className={`cafe-btn cafe-btn-sm ${added ? 'cafe-btn-success' : ''}`}
            onClick={handleAdd}
            style={{
              transition: 'all 0.3s ease',
              minWidth: 110,
            }}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
