'use client';

import { useState } from 'react';
import Reveal from '@/components/cafe/RevealOnScroll';
import FormMessage from '@/components/cafe/FormMessage';

export default function ContactPage() {
  const [msg, setMsg] = useState({ type: '' as 'success' | 'error' | '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));

    setSubmitting(true);
    try {
      const res = await fetch('/api/cafe-api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setMsg({
          type: 'success',
          text: 'We will get back to you soon!',
        });
        form.reset();
      } else {
        setMsg({
          type: 'error',
          text: result.message || 'Failed to send message.',
        });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error. Try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-section" style={{ marginTop: 80 }}>
      <Reveal>
        <h2 className="section-title">Get in Touch</h2>
      </Reveal>
      <Reveal>
        <p className="section-subtitle">We&apos;d love to hear from you</p>
      </Reveal>

      <Reveal className="cafe-form-container">
        <FormMessage type={msg.type} text={msg.text} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" name="name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" name="email" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              className="form-control"
              name="message"
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            className="cafe-btn"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
