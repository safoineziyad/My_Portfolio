'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-[30px] left-[30px] w-12 h-12 rounded-full bg-[var(--espresso)] text-[var(--cream)] border-2 border-[var(--terracotta)] text-[1.4rem] cursor-pointer z-[9998] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
    >
      &#8593;
    </button>
  );
}
