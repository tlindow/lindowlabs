"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Bot,
  Search,
  FileText,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchKnowledge, SearchResult } from "@/data/aiKnowledge";
import { BEGINNER_HAPI_URL, BEGINNER_URL } from "@/data/urls";

interface AILauncherModalProps {
  isOpen: boolean;
  initialTab?: "instant" | "providers";
  onClose: () => void;
}

const AI_PROMPT_TEMPLATE = `You are an AI assistant helping me learn about Tyler Lindow. Here is his verified background and context:

• Name: Tyler Lindow (Founder, Software Developer, Mentor)
• Location: San Diego, California (92102)
• Origins: Transitioned from evolutionary biology research at Chicago's Field Museum into software development after observing an interactive terminal kiosk.
• Beginner Work (Founder, Mar–Jul 2026): Ran Beginner Work as sole founder from March to July 2026. Built Tinker; validated across successive prototypes through 92 in-person conversations (including 5 VCs) and 28 early users. Beginner's research phase ended in July 2026.
• Tinker (IDE): Helped technical founders explain their work in their own voice — ${BEGINNER_URL} (source: https://github.com/beginner-work/tinker)
• hāpi (Maker): San Diego botanical craft hop elixir brand & mobile ordering PWA — ${BEGINNER_HAPI_URL}
• Keynote Speaking: Featured Keynote "Human Minds & AI Models" at DEVx Network San Diego (April 18, 2026), connecting cognitive science and autonomous AI agent design — Video: https://www.youtube.com/watch?v=STI5pw5F5Lo&t=631s
• 1:1 Mentoring: Live code reviews, pair programming, and career coaching — https://calendly.com/tylerlindow/elevate

Please give me an overview of Tyler, his ventures, keynote insights, and how I can collaborate with him.`;

const aiProviders = [
  {
    id: "gemini",
    name: "Google Gemini",
    tag: "Gemini 2.0",
    badge: "Recommended",
    badgeColor: "bg-sky-light text-sky border-sky/30",
    iconColor: "text-sky",
    url: "https://gemini.google.com/app",
    description: "Copies full prompt and launches Gemini in a new tab.",
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    tag: "Claude 3.7 Sonnet",
    badge: "tinker Engine",
    badgeColor: "bg-rose-light text-rose border-rose/30",
    iconColor: "text-rose",
    url: "https://claude.ai/new",
    description: "Copies full prompt and opens Claude for structured discussion.",
  },
  {
    id: "chatgpt",
    name: "OpenAI ChatGPT",
    tag: "GPT-4o & Search",
    badge: "Direct Prompt",
    badgeColor: "bg-mint-light text-mint-dark border-mint/30",
    iconColor: "text-sky",
    url: "https://chatgpt.com",
    description: "Copies full prompt and launches ChatGPT.",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    tag: "Live Web Search",
    badge: "Auto-Queries",
    badgeColor: "bg-violet-light text-violet border-violet/30",
    iconColor: "text-violet",
    url: `https://www.perplexity.ai/search?q=${encodeURIComponent(
      "Tyler Lindow founder beginner tinker hapi DEVx keynote San Diego"
    )}`,
    description: "Direct preloaded search query with real-time web sources.",
  },
];

export default function AILauncherModal({
  isOpen,
  initialTab = "instant",
  onClose,
}: AILauncherModalProps) {
  const [copied, setCopied] = useState(false);
  const [userTab, setUserTab] = useState<"instant" | "providers" | null>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTab = userTab ?? initialTab;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLaunchProvider = async (provider: (typeof aiProviders)[0]) => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
    } catch {
      // Fallback
    }

    setToastMessage(`Prompt copied! Paste (Cmd+V) in ${provider.name}.`);
    setTimeout(() => setToastMessage(null), 4000);

    window.open(provider.url, "_blank", "noopener,noreferrer");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = searchKnowledge(query);
    setResult(res);
  };

  const handleQuickQuestion = (q: string) => {
    setQuery(q);
    const res = searchKnowledge(q);
    setResult(res);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Top Tinker Rainbow Spectrum Line */}
            <div className="h-1 tinker-rainbow-gradient w-full" />

            {/* Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-light px-2.5 py-0.5 text-[11px] font-mono font-medium text-violet">
                    <Sparkles size={12} />
                    AI Knowledge Gateway
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-normal tracking-tight">
                  Read Tyler&rsquo;s Story via AI
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-sans text-muted leading-relaxed">
                  Ask questions in-browser or launch directly in Gemini, Claude, or ChatGPT with
                  pre-copied context.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full text-muted hover:text-foreground hover:bg-surface-alt transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Notification Toast if prompt copied */}
            {toastMessage && (
              <div className="bg-surface-alt border-b border-violet/30 px-5 py-2 text-xs font-mono text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-violet">
                  <Check size={14} className="text-sprout" />
                  {toastMessage}
                </span>
                <span className="text-muted text-[11px]">Just press Cmd+V</span>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <div className="flex items-center border-b border-border bg-surface-alt/60 px-5 sm:px-6 gap-2">
              <button
                type="button"
                onClick={() => setUserTab("instant")}
                className={`py-3 px-3 text-xs sm:text-sm font-mono font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "instant"
                    ? "border-violet text-foreground font-semibold"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Search size={15} className="text-sky" />
                Instant In-Browser Concierge
              </button>
              <button
                type="button"
                onClick={() => setUserTab("providers")}
                className={`py-3 px-3 text-xs sm:text-sm font-mono font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "providers"
                    ? "border-violet text-foreground font-semibold"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Bot size={15} className="text-violet" />
                Launch in External AI (Gemini, Claude, GPT)
              </button>
            </div>

            {/* Tab 1: Built-in In-Browser Instant Concierge */}
            {activeTab === "instant" && (
              <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything (e.g. 'What is beginner?', 'Tell me about the DEVx talk')..."
                    className="w-full rounded-2xl border border-border bg-surface-alt px-4 py-3 pl-10 text-xs sm:text-sm font-sans text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet"
                  />
                  <Search size={16} className="absolute left-3.5 top-3.5 text-muted" />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 rounded-xl bg-foreground text-background px-3 py-1.5 text-xs font-mono font-medium hover:bg-foreground/85 cursor-pointer"
                  >
                    Ask
                  </button>
                </form>

                {/* Suggested Quick Questions */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-muted mr-1">Suggestions:</span>
                  {[
                    "What is beginner?",
                    "Tell me about the DEVx talk",
                    "What is tinker?",
                    "How does mentoring work?",
                    "Where is Tyler based?",
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQuickQuestion(q)}
                      className="rounded-full bg-surface-alt hover:bg-violet-light border border-border px-2.5 py-1 text-[11px] font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Instant Query Answer Card */}
                {result ? (
                  <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <h4 className="font-serif text-base sm:text-lg text-foreground font-normal">
                        {result.topic.title}
                      </h4>
                      <span className="text-[11px] font-mono text-sprout bg-sprout-light px-2 py-0.5 rounded-md">
                        {Math.round(result.confidence * 100)}% match
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-foreground/90 leading-relaxed">
                      {result.topic.summary}
                    </p>

                    <div className="space-y-1.5 bg-surface-alt rounded-xl p-3 text-xs font-sans text-muted">
                      {result.topic.details.map((d, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-violet font-bold text-xs mt-0.5">&rarr;</span>
                          <span className="text-foreground/90">{d}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      {result.topic.actions.map((act) => (
                        <a
                          key={act.label}
                          href={act.href}
                          target={act.isExternal ? "_blank" : undefined}
                          rel={act.isExternal ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt hover:bg-violet-light border border-border px-3 py-1 text-xs font-mono text-foreground transition-colors"
                        >
                          <span>{act.label}</span>
                          {act.isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted space-y-2">
                    <Bot size={28} className="mx-auto text-muted/60" />
                    <p className="text-xs font-mono">
                      Type a question above or click a suggestion for instant in-browser answers.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: External AI Providers */}
            {activeTab === "providers" && (
              <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                {/* 1-Click Clipboard Copy Banner */}
                <div className="rounded-2xl bg-surface-alt border border-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-serif font-normal text-foreground">
                      Universal LLM Context Prompt
                    </p>
                    <p className="text-[11px] font-sans text-muted">
                      Copy Tyler&rsquo;s verified background, projects, talks &amp; links into any prompt window.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background hover:bg-foreground/85 px-4 py-2 text-xs font-mono font-medium transition-all hover:shadow-sm cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-sprout" />
                        <span>Copied Context!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Full AI Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Providers Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {aiProviders.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleLaunchProvider(prov)}
                      className="group p-4 rounded-2xl bg-surface border border-border hover:border-violet/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base text-foreground font-normal group-hover:text-violet transition-colors">
                              {prov.name}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${prov.badgeColor}`}
                          >
                            {prov.badge}
                          </span>
                        </div>
                        <p className="text-xs font-sans text-muted leading-relaxed">
                          {prov.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted group-hover:text-foreground">
                        <span>Copy &amp; Open &rarr;</span>
                        <ExternalLink
                          size={13}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Standards & MCP Bar */}
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
                  <div className="flex items-center gap-3">
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/llms-full.txt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-2"
                    >
                      <FileText size={13} className="text-sky" />
                      <span>/llms-full.txt</span>
                    </a>
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/mcp.json`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-2"
                    >
                      <Cpu size={13} className="text-sprout" />
                      <span>/mcp.json</span>
                    </a>
                  </div>

                  <span className="text-[11px] text-muted/80">Public story context</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
