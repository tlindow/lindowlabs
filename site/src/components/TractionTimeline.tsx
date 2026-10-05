"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AffirmLogo,
  GalvanizeLogo,
  TheTechLogo,
  CHMLogo,
} from "@/components/brand/PartnerLogos";
import { BeginnerSeedMark } from "@/components/brand/BeginnerMarks";

export interface VolumeLineItem {
  id: string;
  year: string;
  title: string;
  volume?: string;
  users: string;
  ownership: string;
  description: string;
}

export interface BeginnerStyleCard {
  id: string;
  companyName: string;
  wordmark: string;
  cardKind: string;
  cardNumber: string;
  holderName: string;
  frontBgStyle: React.CSSProperties;
  boxShadow: string;
  borderClass: string;
  trimColor: string;
  brandMark: React.ReactNode;
  linkedinUrl: string;
  totalVolumeSummary: string;
  lineItems: VolumeLineItem[];
}

export const companyCards: BeginnerStyleCard[] = [
  // 1. Computer History Museum (2017) — Plum / Violet
  {
    id: "chm",
    companyName: "Computer History Museum",
    wordmark: "chm",
    cardKind: "",
    cardNumber: "•••• 2017",
    holderName: "Tyler Lindow",
    frontBgStyle: { background: "#ffffff" },
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    borderClass: "border-purple-200",
    trimColor: "#C4B5FD",
    brandMark: <CHMLogo className="h-5 w-auto" />,
    linkedinUrl: "https://www.linkedin.com/in/tlindow/details/experience/",
    totalVolumeSummary: "500+ young developers educated",
    lineItems: [
      {
        id: "chm-1",
        year: "2017",
        title: "Design Code Build & Physical Computing Event Support",
        users: "500+ DEVs",
        ownership: "Workshop Instructor",
        description: "500+ young developers educated",
      },
    ],
  },

  // 2. The Tech Interactive (2017 - 2018) — Teal / Cyan
  {
    id: "tech-interactive",
    companyName: "The Tech Interactive",
    wordmark: "the tech",
    cardKind: "",
    cardNumber: "•••• 2018",
    holderName: "Tyler Lindow",
    frontBgStyle: { background: "#ffffff" },
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    borderClass: "border-indigo-200",
    trimColor: "#A5B4FC",
    brandMark: <TheTechLogo className="h-5 w-auto" />,
    linkedinUrl: "https://www.linkedin.com/in/tlindow/details/experience/",
    totalVolumeSummary: "1000+ young engineers inspired",
    lineItems: [
      {
        id: "tech-1",
        year: "2018",
        title: "Sustainability Exhibit Prototyping & Google Data Literacy",
        users: "1000+ DEVs",
        ownership: "Curriculum Specialist & Studio Lead",
        description: "1000+ young engineers inspired",
      },
    ],
  },

  // 3. Galvanize Inc (2019) — Galvanize Orange
  {
    id: "galvanize",
    companyName: "Galvanize",
    wordmark: "galvanize",
    cardKind: "Volume",
    cardNumber: "•••• 2019",
    holderName: "Tyler Lindow",
    frontBgStyle: { background: "#ffffff" },
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    borderClass: "border-sky-200",
    trimColor: "#7DD3FC",
    brandMark: <GalvanizeLogo className="h-4 sm:h-5 w-auto" />,
    linkedinUrl: "https://www.linkedin.com/in/tlindow/details/experience/",
    totalVolumeSummary: "$400k revenue & 20 developers onboarded",
    lineItems: [
      {
        id: "galv-1",
        year: "2019",
        title: "Developer Onboarding & Multi-Repo Reviews",
        volume: "$400K volume",
        users: "20 DEVs",
        ownership: "Lead Immersive Resident",
        description: "$400k revenue & 20 developers onboarded",
      },
    ],
  },

  // 4. Affirm (2019 - 2026) — Affirm Royal Blue
  {
    id: "affirm",
    companyName: "Affirm",
    wordmark: "affirm",
    cardKind: "Volume",
    cardNumber: "•••• 2024",
    holderName: "Tyler Lindow",
    frontBgStyle: { background: "#ffffff" },
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    borderClass: "border-emerald-200",
    trimColor: "#6EE7B7",
    brandMark: <AffirmLogo className="h-5 sm:h-6 w-auto" />,
    linkedinUrl: "https://www.linkedin.com/in/tlindow/details/experience/",
    totalVolumeSummary: "Flagship partner volume & 300+ developers supported",
    lineItems: [
      {
        id: "aff-1",
        year: "2024",
        title: "Enterprise Scale, SLA & Merchant Telemetry",
        volume: "Flagship partner volume",
        users: "300+ DEVs",
        ownership: "Engineering Lead, Flagship SRE",
        description: "Flagship partner volume & 300+ developers supported",
      },
    ],
  },

  // 5. Beginner (2026) — Authentic Beginner Forest Green
  {
    id: "beginner",
    companyName: "Beginner",
    wordmark: "beginner",
    cardKind: "",
    cardNumber: "•••• 2026",
    holderName: "Tyler Lindow",
    frontBgStyle: { background: "#ffffff" },
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    borderClass: "border-orange-200",
    trimColor: "#FDBA74",
    brandMark: <BeginnerSeedMark className="w-6 h-6 rounded-lg shrink-0 shadow-xs" />,
    linkedinUrl: "https://www.linkedin.com/in/tlindow/details/experience/",
    totalVolumeSummary: "92 conversations, 28 early users",
    lineItems: [
      {
        id: "beg-1",
        year: "2026",
        title: "Tinker writing tool",
        users: "28 early users",
        ownership: "Sole founder",
        description: "Validated across successive prototypes through 92 in-person conversations (including 5 VCs)",
      },
    ],
  },
];

export default function TractionTimeline() {
  return (
    <div className="w-full select-none py-2">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {companyCards.map((card) => (
          <motion.div
            key={card.id}
            id={`wallet-card-${card.id}`}
            variants={{
              hidden: { opacity: 0, scale: 0.94, y: 16 },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] },
              },
            }}
            className="w-full max-w-[340px] sm:w-[340px] flex flex-col gap-3 mx-auto sm:mx-0 cursor-default"
          >
            {/* Debit Card Face (Fixed uniform size across desktop screens) */}
            <div className="w-full aspect-[1.586/1] rounded-[20px] cursor-default">
              <CardFace card={card} />
            </div>

            {/* Card Metadata */}
            <div className="flex flex-col gap-1 px-1">
              <span
                className="text-base font-bold font-mono text-foreground"
              >
                {card.companyName}
              </span>
              <span className="text-xs font-mono text-muted leading-relaxed">
                {card.totalVolumeSummary}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ================================================================= */
/* Shared Card Face Component                                        */
/* ================================================================= */
export function CardFace({ card }: { card: BeginnerStyleCard }) {
  return (
    <div
      style={{
        ...card.frontBgStyle,
        boxShadow: card.boxShadow,
      }}
      className={`relative w-full h-full rounded-[20px] border flex flex-col overflow-hidden ${card.borderClass}`}
    >
      {/* Color Trim Strip */}
      <div
        className="h-2 w-full shrink-0"
        style={{ background: card.trimColor }}
      />

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5">
        {/* Top Bar: Brand Mark (Holder name removed) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {card.brandMark}
          </div>
        </div>

        {/* Bottom Bar: Masked Number & Card Kind */}
        <div className="flex items-end justify-between gap-3 pt-4">
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-gray-500 tabular-nums">
            {card.cardNumber}
          </span>

          <div className="flex flex-col items-end gap-0.5">
            <span
              className="font-mono font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider leading-none"
              style={{ color: card.trimColor }}
            >
              {card.cardKind}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
