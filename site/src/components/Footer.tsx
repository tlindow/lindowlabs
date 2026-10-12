"use client";

import { Calendar, ArrowUpRight, Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import { resumeContact } from "@/data/resumeData";

/** Shared Let's talk Calendly connect CTA (non-home pages). */
const CONNECT_URL = "https://calendly.com/tylerlindow/connect";

/**
 * Icon-only contacts. Use bg-foreground + text-background so #contact theme
 * maps to lavender fill and deep purple (#3B2A5C) glyphs (WCAG 3:1+).
 */
const CONTACT_ICON_BTN_CLASS =
  "inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border/60 bg-foreground text-background shadow-2xs transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B2A5C] motion-reduce:hover:scale-100";

/** Light pill + dark ink on deep #contact; matches Download resume shape/weight. */
const CONNECT_CTA_CLASS =
  "inline-flex items-center gap-2 rounded-xl bg-foreground text-background border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer";

export type FooterContactCta =
  /** Homepage: LinkedIn + email icons only (no Calendly text button). */
  | { kind: "icons" }
  /** /engineering-leaders and default: Calendly connect pill. */
  | { kind: "calendly"; href?: string; label?: string };

export type FooterPhilosophyBook = {
  src: string;
  title: string;
  author: string;
};

const DEFAULT_PHILOSOPHY_BOOK: FooterPhilosophyBook = {
  src: "/book-marie-kondo.jpg",
  title: "The Life-Changing Magic of Tidying Up",
  author: "Marie Kondo",
};

type FooterProps = {
  /** Contact leaf: drop duplicate Let's talk heading; hide unused avatar slot. */
  contactLeaf?: boolean;
  /**
   * Mark the Let's talk static photo as a profile-photo anchor (hides the nav
   * photo while in view). Used on homepage and retreat dock leaves.
   */
  profilePhotoAnchor?: boolean;
  /**
   * Contact actions under Let's talk. Homepage uses icons; leaders uses
   * Calendly connect (default).
   */
  contactCta?: FooterContactCta;
  /** Optional override for the open-to-roles / leaders support line. */
  contactBlurb?: string;
  /** Philosophy book cover (homepage Marie Kondo; leaders Don Norman). */
  philosophyBook?: FooterPhilosophyBook;
};

const DEFAULT_CONTACT_BLURB =
  "Open to Engineering Manager and Senior EM roles in developer experience, developer platforms, and partner integrations.";

export default function Footer({
  contactLeaf = false,
  profilePhotoAnchor = false,
  contactCta = { kind: "calendly" },
  contactBlurb = DEFAULT_CONTACT_BLURB,
  philosophyBook = DEFAULT_PHILOSOPHY_BOOK,
}: FooterProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const iconsOnly = contactCta.kind === "icons";
  const calendlyHref =
    contactCta.kind === "calendly"
      ? (contactCta.href ?? CONNECT_URL)
      : CONNECT_URL;
  const calendlyLabel =
    contactCta.kind === "calendly"
      ? (contactCta.label ?? "Let's get in touch")
      : "Let's get in touch";
  const bookSrc = philosophyBook.src.startsWith("http")
    ? philosophyBook.src
    : `${basePath}${philosophyBook.src}`;
  const bookAlt = `${philosophyBook.title} by ${philosophyBook.author}`;

  return (
    <footer className="no-print font-mono w-full">
      {/* ========================================================= */}
      {/* SECTION 3: CONTACT CTA                                    */}
      {/* ========================================================= */}
      <section
        id="contact"
        className="w-full pt-16 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6 bg-surface-alt/70 border-t border-border/70 scroll-mt-20"
      >
        <div className="mx-auto max-w-xl text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-dark block">
              Get in Touch
            </span>
            {!contactLeaf ? (
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                Let&apos;s talk
              </h3>
            ) : null}
            {/* Plain static circular photo (no WebGL / morph) on every full footer. */}
            {!contactLeaf ? (
              <div className="flex justify-center items-center py-2">
                <div
                  id="contact-avatar-target"
                  {...(profilePhotoAnchor
                    ? { "data-profile-anchor": "contact" }
                    : {})}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 ring-1 ring-border/80 shadow-2xs bg-sand/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${basePath}/profile-square.jpg`}
                    alt="Tyler Lindow"
                    width={80}
                    height={80}
                    {...(profilePhotoAnchor
                      ? { "data-profile-photo": "contact" }
                      : {})}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            ) : null}
            <p className="text-xs sm:text-sm font-mono text-muted max-w-md mx-auto leading-relaxed">
              {contactBlurb}
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-3">
            {iconsOnly ? (
              <div
                className="flex items-center justify-center gap-3"
                data-contact-cta="icons"
              >
                <a
                  href={resumeContact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONTACT_ICON_BTN_CLASS}
                  aria-label="Message me on LinkedIn"
                  title="Message me on LinkedIn"
                >
                  <span className="inline-flex" aria-hidden="true">
                    <LinkedInIcon size={16} className="shrink-0" />
                  </span>
                </a>
                <a
                  href={`mailto:${resumeContact.email}`}
                  className={CONTACT_ICON_BTN_CLASS}
                  aria-label={`Email ${resumeContact.email}`}
                  title={`Email ${resumeContact.email}`}
                >
                  <Mail size={16} className="shrink-0" aria-hidden="true" />
                </a>
              </div>
            ) : (
              <>
                <a
                  href={calendlyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONNECT_CTA_CLASS}
                  title="Let's get in touch on Calendly"
                  data-contact-cta="calendly"
                >
                  <Calendar size={15} className="shrink-0" />
                  <span>{calendlyLabel}</span>
                </a>

                {/* Icon-only mail + LinkedIn under the Calendly CTA. */}
                {!contactLeaf ? (
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={`mailto:${resumeContact.email}`}
                      className={CONTACT_ICON_BTN_CLASS}
                      aria-label={`Email ${resumeContact.email}`}
                      title={`Email ${resumeContact.email}`}
                    >
                      <Mail size={16} className="shrink-0" aria-hidden="true" />
                    </a>
                    <a
                      href={resumeContact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={CONTACT_ICON_BTN_CLASS}
                      aria-label="Message me on LinkedIn"
                      title="Message me on LinkedIn"
                    >
                      <span className="inline-flex" aria-hidden="true">
                        <LinkedInIcon size={16} className="shrink-0" />
                      </span>
                    </a>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: PHILOSOPHY (ALTERNATES TO COLOR A: BACKGROUND)  */}
      {/* ========================================================= */}
      <section
        id="philosophy"
        className="w-full py-14 sm:py-20 px-4 sm:px-6 md:px-8 bg-background border-t border-border/70"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-14 items-center">
          {/* Copy Block */}
          <div className="flex flex-col justify-center space-y-3 sm:space-y-4 text-left">
            <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark tracking-widest uppercase">
              Philosophy
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-foreground">
              It starts with home
            </h3>
            <p className="text-base sm:text-lg font-mono text-muted leading-relaxed">
              Excellence follows self-respect.
            </p>
          </div>

          {/* Book Visual Asset → public finished-books list */}
          <div className="w-full flex justify-center md:justify-end">
            <a
              href={`${basePath}/books-ive-read`}
              className="group relative flex items-center justify-center w-full max-w-md aspect-[16/10] rounded-2xl border border-border bg-surface overflow-hidden hover:border-indigo-dark/40 hover:shadow-md transition-all duration-300 cursor-pointer shadow-2xs"
              title="Books I've read"
            >
              {/* Blurred ambient book cover background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bookSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
              />

              {/* Book Cover */}
              <div className="relative z-10 h-[80%] aspect-[351/500] rounded-r-md rounded-l-xs shadow-xl border border-border/70 overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bookSrc}
                  alt={bookAlt}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                {/* Subtle book spine shadow */}
                <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Corner link cue — no text pill */}
              <div
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background/90 backdrop-blur-md border border-border text-foreground group-hover:text-indigo-dark group-hover:border-indigo-dark/50 shadow-xs transition-all"
                aria-hidden="true"
              >
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                />
              </div>
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
