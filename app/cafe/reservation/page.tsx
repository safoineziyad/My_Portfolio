'use client';

import { useState } from 'react';
import Reveal from '@/components/cafe/RevealOnScroll';
import FormMessage from '@/components/cafe/FormMessage';

export default function ReservationPage() {
  const [msg, setMsg] = useState({ type: '' as 'success' | 'error' | '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const selectedDate = new Date(data.date as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setMsg({ type: 'error', text: 'Please select a future date.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/cafe-api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setMsg({
          type: 'success',
          text: 'Reservation request sent! We will confirm shortly.',
        });
        form.reset();
      } else {
        setMsg({ type: 'error', text: result.message });
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
        <h2 className="section-title">Book a Table</h2>
      </Reveal>
      <Reveal>
        <p className="section-subtitle">Secure your spot at Café NOMAD</p>
      </Reveal>

      <Reveal className="cafe-form-container">
        <FormMessage type={msg.type} text={msg.text} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" name="name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" name="email" required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" className="form-control" name="phone" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-control" name="date" required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" className="form-control" name="time" required />
            </div>
          </div>
          <div className="form-group">
            <label>Guests</label>
            <input
              type="number"
              className="form-control"
              name="guests"
              min={1}
              defaultValue={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Special Requests</label>
            <textarea className="form-control" name="specialRequests" rows={3} />
          </div>
          <button
            type="submit"
            className="cafe-btn"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
