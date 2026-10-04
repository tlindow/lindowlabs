"use client";

import {
  Code2,
  Compass,
  FolderOpen,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import MagneticButton from "@/components/animations/MagneticButton";

const offerings = [
  {
    icon: Code2,
    title: "Code Reviews & Pairing",
    description:
      "Walk through your code together, talk through trade-offs, and sharpen your problem-solving.",
    color: "bg-sky-light",
    iconColor: "text-sky",
  },
  {
    icon: Compass,
    title: "Career Coaching",
    description:
      "Navigate bootcamps, self-study, the job search, or your next career move with someone who's been there.",
    color: "bg-peach-light",
    iconColor: "text-peach",
  },
  {
    icon: FolderOpen,
    title: "Portfolio & Brand Building",
    description:
      "Build a GitHub presence, personal site, and project portfolio that shows what you can really do.",
    color: "bg-mint-light",
    iconColor: "text-mint",
  },
  {
    icon: MessageCircle,
    title: "Open Office Hours",
    description:
      "No agenda needed — bring your questions, your ideas, or just come to think out loud.",
    color: "bg-violet-light",
    iconColor: "text-violet",
  },
];

export default function Mentoring() {
  return (
    <section id="mentoring" className="relative overflow-hidden">
      {/* Pastel violet banner */}
      <div className="relative bg-gradient-to-br from-violet via-indigo to-sky py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet/0 via-white/10 to-violet/0"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <ScrollReveal direction="none">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white/90 mb-6 backdrop-blur-sm">
              <Sparkles size={14} />
              Now booking 1:1 sessions
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
              Work With Me
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-white/85 max-w-2xl mx-auto">
              I love helping developers grow. Whether you&rsquo;re just starting
              out, switching careers, or looking to level up &mdash; I&rsquo;d
              genuinely enjoy working with you. Let&rsquo;s figure it out together.
            </p>

            <MagneticButton
              href="https://calendly.com/tylerlindow/elevate"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-violet hover:bg-white/90 transition-all hover:shadow-xl hover:shadow-white/20"
            >
              Book a Session
              <ArrowRight size={15} />
            </MagneticButton>
          </ScrollReveal>
        </div>
      </div>

      {/* Offerings grid on cream */}
      <div className="bg-surface-alt py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-violet mb-10 sm:mb-12">
              How I can help
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:gap-6 sm:grid-cols-2" staggerDelay={0.1}>
            {offerings.map((o) => {
              const Icon = o.icon;
              return (
                <StaggerItem key={o.title}>
                  <div className="rounded-2xl bg-surface p-5 sm:p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${o.color} ${o.iconColor}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-foreground">
                      {o.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">
                      {o.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <ScrollReveal delay={0.2}>
            <div className="mt-10 sm:mt-12 rounded-2xl bg-surface border border-border p-6 sm:p-8 text-center">
              <p className="text-base sm:text-lg font-medium text-foreground">
                Not sure where to start? That&rsquo;s totally fine.
              </p>
              <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
                Send me a message and tell me a bit about where you&rsquo;re at.
                We&rsquo;ll find the right way to work together &mdash; no
                pressure, just a conversation.
              </p>
              <a
                href="mailto:tyler@lindowlabs.dev"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet hover:underline group"
              >
                Send me a message
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
