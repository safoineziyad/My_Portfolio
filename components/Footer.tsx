'use client';

import { ArrowUp } from 'lucide-react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/safoineziyad', label: 'GitHub' },
  { icon: FaTwitter, href: 'https://x.com/ziyad_dev', label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              Ziyad
            </span>
            <p className="mt-1 text-sm text-text-main/40">
              &copy; {new Date().getFullYear()} Ziyad. Built with Next.js &amp; Tailwind.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-main/50 transition-all hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-text-main/30 transition-colors hover:text-primary"
          >
            <ArrowUp size={14} />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
