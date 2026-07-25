'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [msg, setMsg] = useState({ type: '' as 'error' | '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    setSubmitting(true);
    try {
      const res = await fetch('/api/cafe-api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.setItem('apiKey', result.apiKey);
        router.push('/cafe/admin/dashboard');
      } else {
        setMsg({ type: 'error', text: result.message });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--espresso)', minHeight: '100vh' }}>
      <div className="login-box">
        <h2>Staff Login</h2>
        {msg.text && <div className={`message ${msg.type}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" name="username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              required
            />
          </div>
          <button
            type="submit"
            className="cafe-btn"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
