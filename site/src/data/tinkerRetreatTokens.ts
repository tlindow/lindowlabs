/**
 * Tinker design tokens ported for /get-your-time-back (scoped CSS vars).
 *
 * Source: github.com/beginner-work/tinker
 *   - src/renderer/design-tokens.css
 *   - src/renderer/styles.css (:root paper / accent)
 *   - src/renderer/tokens/rainbow-web.json (logo palette)
 *   - src/renderer/heatmap.js PALETTE (same rainbow order)
 *
 * Tinker has no shipped Waveform React component; the retreat waveform uses
 * this rainbow-web palette as equalizer bars (brand flourish, not product chrome).
 */

/** Rainbow-web / heatmap palette (pink → orange → yellow → leaf → sky → purple → mint). */
export const TINKER_RAINBOW_PALETTE = [
  "#F9A8D4",
  "#FDBA74",
  "#FDE68A",
  "#7BC47A",
  "#7DD3FC",
  "#C8B6E2",
  "#6EE7B7",
] as const;

export const TINKER_RETREAT_SOURCE =
  "https://github.com/beginner-work/tinker (design-tokens.css, styles.css :root, rainbow-web.json / heatmap.js palette)";
