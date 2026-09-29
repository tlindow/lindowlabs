import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  isSupported,
  RemoteConfig,
} from "firebase/remote-config";
import { getFirebaseApp, isFirebaseConfigured } from "./config";

export type CtaStyle = "forest_solid" | "pulse_accent" | "high_contrast" | "sprout_glow";

export interface RemoteConfigValues {
  recruit_cta_label: string;
  recruit_cta_style: CtaStyle;
  hero_headline_variant: string;
  hero_subtitle_variant: string;
}

// ----------------------------------------------------------------------
// Curated Content Variation Presets for Conversion Optimization
// ----------------------------------------------------------------------
export const VARIANT_PRESETS: Record<string, RemoteConfigValues> = {
  baseline: {
    recruit_cta_label: "Let's talk",
    recruit_cta_style: "forest_solid",
    hero_headline_variant: "Engineering Manager, Developer Fintech",
    hero_subtitle_variant:
      "Elevating Developer Fintech: engineering leadership for merchant platforms, partner integrations, and enterprise B2B portals.",
  },
  action_oriented: {
    recruit_cta_label: "Let's talk",
    recruit_cta_style: "pulse_accent",
    hero_headline_variant: "Engineering Manager, Developer Fintech",
    hero_subtitle_variant:
      "Elevating Developer Fintech: engineering leadership for merchant platforms, partner integrations, and enterprise B2B portals.",
  },
  low_friction: {
    recruit_cta_label: "Connect on LinkedIn",
    recruit_cta_style: "sprout_glow",
    hero_headline_variant: "Engineering Manager, Developer Fintech",
    hero_subtitle_variant: "ex-Affirm, ex-founder",
  },
  executive_authority: {
    recruit_cta_label: "Hire Fintech Product-Eng PM",
    recruit_cta_style: "high_contrast",
    hero_headline_variant: "Engineering Manager, Developer Fintech",
    hero_subtitle_variant:
      "Elevating Developer Fintech: engineering leadership for merchant platforms, partner integrations, and enterprise B2B portals.",
  },
};

export const DEFAULT_REMOTE_CONFIG: RemoteConfigValues = VARIANT_PRESETS.baseline;

let remoteConfigInstance: RemoteConfig | null = null;
let isRemoteConfigInitialized = false;

export async function initRemoteConfig(): Promise<RemoteConfig | null> {
  if (typeof window === "undefined") return null;
  if (remoteConfigInstance) return remoteConfigInstance;
  if (isRemoteConfigInitialized) return null;

  isRemoteConfigInitialized = true;

  const app = getFirebaseApp();
  if (!app || !isFirebaseConfigured) {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) return null;

    remoteConfigInstance = getRemoteConfig(app);

    // Development: fetch immediately without caching. Production: 1-hour cache.
    remoteConfigInstance.settings = {
      minimumFetchIntervalMillis:
        process.env.NODE_ENV === "development" ? 0 : 3600000,
      fetchTimeoutMillis: 10000,
    };

    // Set client-side defaults
    remoteConfigInstance.defaultConfig = {
      ...DEFAULT_REMOTE_CONFIG,
    };

    // Fetch and activate remote variants from Firebase A/B Testing
    await fetchAndActivate(remoteConfigInstance);

    if (process.env.NODE_ENV === "development") {
      console.info("[RemoteConfig] Successfully fetched and activated parameters.");
    }

    return remoteConfigInstance;
  } catch (err) {
    console.warn("[RemoteConfig] Fetch/activation error:", err);
    return null;
  }
}

export function getRemoteConfigValues(): RemoteConfigValues {
  if (!remoteConfigInstance) {
    return DEFAULT_REMOTE_CONFIG;
  }

  try {
    const rawSubtitle = getValue(remoteConfigInstance, "hero_subtitle_variant").asString();
    const cleanSubtitle =
      !rawSubtitle ||
      rawSubtitle.includes("B2B at B2C scale") ||
      rawSubtitle.includes("B2B at B2B scale") ||
      rawSubtitle.includes("B2B Fintech on DevX Rails") ||
      rawSubtitle.includes("B2B Fintech on Developer Rails") ||
      rawSubtitle.includes("B2B Scale on DevX Rails") ||
      rawSubtitle.includes("B2B SaaS Scale on GenAI Rails") ||
      rawSubtitle.includes("B2B SaaS on GenAI Rails") ||
      rawSubtitle.includes("B2B SaaS on Safe, GenAI Rails") ||
      rawSubtitle.includes("B2B SaaS on Builder-safe GenAI Rails") ||
      rawSubtitle.includes("· $0 – $10B+ GMV enterprises")
        ? DEFAULT_REMOTE_CONFIG.hero_subtitle_variant
        : rawSubtitle.replace(/\s*·\s*\$0\s*–\s*\$10B\+\s*GMV\s*enterprises/gi, "").trim();

    const rawHeadline = getValue(remoteConfigInstance, "hero_headline_variant").asString();
    const cleanHeadline =
      !rawHeadline ||
      rawHeadline.includes("Staff") ||
      rawHeadline.includes("Staff B2B Product Manager") ||
      rawHeadline.includes("Staff Developer Product Manager") ||
      rawHeadline.includes("Staff Product Manager") ||
      rawHeadline === "Fintech Eng Product Manager" ||
      rawHeadline === "Fintech Eng-Product Manager" ||
      rawHeadline === "Fintech Product Eng Manager"
        ? DEFAULT_REMOTE_CONFIG.hero_headline_variant
        : rawHeadline;

    return {
      recruit_cta_label:
        getValue(remoteConfigInstance, "recruit_cta_label").asString() ||
        DEFAULT_REMOTE_CONFIG.recruit_cta_label,
      recruit_cta_style:
        (getValue(remoteConfigInstance, "recruit_cta_style").asString() as CtaStyle) ||
        DEFAULT_REMOTE_CONFIG.recruit_cta_style,
      hero_headline_variant: cleanHeadline,
      hero_subtitle_variant: cleanSubtitle,
    };
  } catch {
    return DEFAULT_REMOTE_CONFIG;
  }
}
