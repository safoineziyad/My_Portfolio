'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

function CountUp({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-primary md:text-4xl">{count}+</div>
      <div className="mt-1 text-sm text-text-main/50">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="relative flex items-center justify-center">
              <div className="relative h-72 w-72 overflow-hidden rounded-3xl border border-border sm:h-80 sm:w-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="flex h-full items-center justify-center">
                  <div className="select-none text-center font-mono text-6xl font-bold text-primary/30">
                    {'<Z />'}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl border border-secondary/30 bg-secondary/5 blur-sm" />
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-xl border border-primary/30 bg-primary/5 blur-sm" />
            </div>

            <div>
              <h2 className="font-heading text-3xl font-bold text-text-heading md:text-4xl">
                About Me
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />

              <p className="mt-6 leading-relaxed text-text-main/60">
                Hey! I&apos;m Ziyad, a 14-year-old developer from Morocco with a deep passion for building
                things on the web. I started coding young and quickly fell in love with
                the creative process of turning ideas into fully functional products.
              </p>
              <p className="mt-4 leading-relaxed text-text-main/60">
                I work with React, Next.js, Node.js, and modern tooling to build
                fast, beautiful interfaces. I love collaborating with clients and turning their visions
                into polished, production-ready projects.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-6">
                <CountUp target={15} label="Projects Completed" />
                <CountUp target={8} label="Happy Clients" />
                <CountUp target={12} label="Technologies" />
              </div>

              <div className="mt-8">
                <a
                  href="mailto:safoineziyad@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  <Mail size={16} />
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
