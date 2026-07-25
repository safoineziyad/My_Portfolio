'use client';

import { useState } from 'react';
import Reveal from '@/components/cafe/RevealOnScroll';
import FormMessage from '@/components/cafe/FormMessage';

export default function StatusPage() {
  const [msg, setMsg] = useState({ type: '' as 'success' | 'error' | '', text: '' });
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (new FormData(form).get('email') as string) || '';

    setMsg({ type: '', text: 'Checking...' });
    setChecking(true);

    try {
      const res = await fetch(
        `/api/cafe-api/reservations/status?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (data.success && data.found) {
        const r = data.reservation;
        const statusClass =
          r.status === 'confirmed'
            ? 'success'
            : r.status === 'cancelled'
              ? 'error'
              : '';
        setMsg({
          type: statusClass as 'success' | 'error',
          text: `Status: ${r.status.toUpperCase()}\nName: ${r.name}\nDate: ${new Date(r.date).toLocaleDateString()} at ${r.time}\nGuests: ${r.guests}\n\n${data.capacityMsg}`,
        });
      } else {
        setMsg({ type: 'error', text: data.message });
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error.' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="form-section" style={{ marginTop: 80 }}>
      <Reveal>
        <h2 className="section-title">Check Your Reservation</h2>
      </Reveal>
      <Reveal>
        <p className="section-subtitle">Enter your email to see your status</p>
      </Reveal>

      <Reveal className="cafe-form-container">
        <FormMessage type={msg.type} text={msg.text} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="e.g., ahmed@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="cafe-btn"
            style={{ width: '100%' }}
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
