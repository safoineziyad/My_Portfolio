'use client';

import type { MenuItem } from '@/lib/cafe/types';
import { useCartStore } from '@/lib/cafe/cart-store';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="menu-card">
      {item.image && (
        <div className="menu-card-img-wrap">
          <img
            src={item.image}
            alt={item.name}
            className="menu-card-img"
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
            className="cafe-btn cafe-btn-sm"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image || '',
              })
            }
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
