'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmed Benali',
    role: 'Startup Founder',
    content: 'Ziyad built our entire e-commerce platform from scratch. His attention to detail and ability to deliver on time was impressive. Highly recommend for any web project.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Marketing Director',
    content: 'Working with Ziyad was a great experience. He understood our vision for the cafe platform and delivered something even better than we imagined. Very professional.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Youssef Amrani',
    role: 'Restaurant Owner',
    content: 'The Cafe NOMAD ordering system Ziyad built has transformed our business. Orders are smoother, customers love the interface, and the admin panel makes management effortless.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Maria Garcia',
    role: 'E-Commerce Manager',
    content: 'Ziyad delivered a full-featured admin dashboard that our team uses daily. His technical skills in Next.js and database design are top-notch for someone his age.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-text-main/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-text-heading md:text-4xl">
              What Clients Say
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="relative mt-12 mx-auto max-w-2xl">
            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
              <Quote size={32} className="mx-auto mb-4 text-primary/30" />
              <p className="text-lg leading-relaxed text-text-main/70">
                &ldquo;{testimonials[current].content}&rdquo;
              </p>
              <div className="mt-4 flex justify-center">
                <StarRating rating={testimonials[current].rating} />
              </div>
              <div className="mt-6">
                <p className="font-heading font-semibold text-text-heading">
                  {testimonials[current].name}
                </p>
                <p className="text-sm text-text-main/50">
                  {testimonials[current].role}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-main/50 transition-all hover:border-primary/50 hover:text-primary"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i === current ? 'bg-primary w-6' : 'bg-text-main/20'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-main/50 transition-all hover:border-primary/50 hover:text-primary"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
