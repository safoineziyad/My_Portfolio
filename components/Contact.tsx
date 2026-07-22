'use client';

import { useState, type FormEvent } from 'react';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState<FormStatus>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-text-heading md:text-4xl">
              Get In Touch
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h3 className="font-heading text-xl font-semibold text-text-heading">
                Let&apos;s work together
              </h3>
              <p className="mt-4 text-text-main/50 leading-relaxed">
                Have a project in mind? Whether it is a website or a web app, I would love to hear about it.
                Fill out the form and I will get back to you as soon as possible.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="mailto:safoineziyad@gmail.com"
                  className="flex items-center gap-3 text-text-main/60 transition-colors hover:text-primary"
                >
                  <Mail size={18} />
                  <span>safoineziyad@gmail.com</span>
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm text-text-main/40">
                  I typically respond within 24 hours. For urgent matters, feel free to reach out on Discord.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="honeypot absolute left-[-9999px] opacity-0" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm text-text-main/60">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-heading outline-none transition-colors placeholder:text-text-main/30 focus:border-primary/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm text-text-main/60">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-heading outline-none transition-colors placeholder:text-text-main/30 focus:border-primary/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm text-text-main/60">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-heading outline-none transition-colors placeholder:text-text-main/30 focus:border-primary/50"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm text-text-main/60">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-text-heading outline-none transition-colors placeholder:text-text-main/30 focus:border-primary/50"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status.type && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'border border-secondary/30 bg-secondary/10 text-secondary'
                      : 'border border-red-500/30 bg-red-500/10 text-red-400'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:bg-primary/80 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
