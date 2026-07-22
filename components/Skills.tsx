'use client';

import { ScrollReveal } from './ScrollReveal';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiDocker,
} from 'react-icons/si';

const skills = [
  { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: SiCss, color: '#1572B6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
];

function SkillCard({ skill }: { skill: { name: string; icon: React.ElementType; color: string } }) {
  const Icon = skill.icon;
  return (
    <div className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <Icon size={36} style={{ color: skill.color }} className="transition-transform duration-300 group-hover:scale-110" />
      <span className="text-sm font-medium text-text-main/70">{skill.name}</span>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-text-heading md:text-4xl">
              Skills & Technologies
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
            <p className="mx-auto mt-4 max-w-lg text-text-main/50">
              A snapshot of the tools and technologies I use to bring ideas to life.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-12">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
