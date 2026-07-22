'use client';

import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { webProjects, type Project } from '@/data/projects';
import { ScrollReveal } from './ScrollReveal';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'fullstack', label: 'Full-Stack' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'react', label: 'React' },
] as const;

export default function WebProjects() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all' ? webProjects : webProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="web-projects" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-text-heading md:text-4xl">
              Web Dev Projects
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-primary text-white'
                    : 'border border-border text-text-main/60 hover:border-primary/50 hover:text-text-main'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.05}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const hasImage = !!project.image;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/30">
            <span className="font-mono text-sm">{project.tech[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-semibold text-text-heading">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text-main/50">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-main/60 transition-colors hover:text-primary"
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-main/60 transition-colors hover:text-primary"
            >
              <Github size={14} /> Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
