"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  initAnalytics,
  trackEvent,
  logRecruitClick,
  logResumeView,
  logMarketplaceInteraction,
  logOutboundClick,
  logScrollDepth,
  RecruitClickParams,
} from "@/lib/firebase/analytics";
import { sendSitePing } from "@/lib/sitePing";
import {
  initRemoteConfig,
  getRemoteConfigValues,
  DEFAULT_REMOTE_CONFIG,
  VARIANT_PRESETS,
  RemoteConfigValues,
} from "@/lib/firebase/remoteConfig";

interface AnalyticsContextType {
  isReady: boolean;
  config: RemoteConfigValues;
  activePresetKey: string;
  setPreset: (presetKey: string) => void;
  trackEvent: typeof trackEvent;
  logRecruitClick: (params: RecruitClickParams) => void;
  logResumeView: typeof logResumeView;
  logMarketplaceInteraction: typeof logMarketplaceInteraction;
  logOutboundClick: typeof logOutboundClick;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  isReady: false,
  config: DEFAULT_REMOTE_CONFIG,
  activePresetKey: "baseline",
  setPreset: () => {},
  trackEvent,
  logRecruitClick,
  logResumeView,
  logMarketplaceInteraction,
  logOutboundClick,
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState<RemoteConfigValues>(DEFAULT_REMOTE_CONFIG);
  const [activePresetKey, setActivePresetKey] = useState<string>("baseline");
  const pathname = usePathname();

  // Initialize Firebase Analytics & Remote Config on client mount
  useEffect(() => {
    let mounted = true;

    async function setupFirebase() {
      // Check for URL query override e.g. ?variant=action_oriented
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const variantParam = urlParams.get("variant");
        if (variantParam && VARIANT_PRESETS[variantParam]) {
          setConfig(VARIANT_PRESETS[variantParam]);
          setActivePresetKey(variantParam);
          setIsReady(true);
          return;
        }
      }

      try {
        await initAnalytics();
        await initRemoteConfig();
        if (mounted) {
          const fetchedConfig = getRemoteConfigValues();
          setConfig(fetchedConfig);
          setIsReady(true);
        }
      } catch (err) {
        console.warn("[AnalyticsProvider] Initialization warning:", err);
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    setupFirebase();

    return () => {
      mounted = false;
    };
  }, []);

  // Track page view on route change (Firebase + privacy-respecting site ping)
  useEffect(() => {
    if (pathname) {
      trackEvent("page_view", {
        page_path: pathname,
        page_title: typeof document !== "undefined" ? document.title : "",
      });
      sendSitePing(pathname);
    }
  }, [pathname]);

  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) return;

      const progress = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));

      const milestones = [25, 50, 75, 100];
      for (const m of milestones) {
        if (progress >= m && !loggedMilestones.has(m)) {
          loggedMilestones.add(m);
          logScrollDepth(m);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRecruitClick = useCallback(
    (params: RecruitClickParams) => {
      logRecruitClick({
        ...params,
        label: params.label || config.recruit_cta_label,
        variant: `${config.recruit_cta_style}:${config.recruit_cta_label}`,
      });
    },
    [config]
  );

  const setPreset = useCallback((presetKey: string) => {
    if (VARIANT_PRESETS[presetKey]) {
      setConfig(VARIANT_PRESETS[presetKey]);
      setActivePresetKey(presetKey);
      trackEvent("ab_variant_manually_selected", { preset: presetKey });
    }
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        isReady,
        config,
        activePresetKey,
        setPreset,
        trackEvent,
        logRecruitClick: handleRecruitClick,
        logResumeView,
        logMarketplaceInteraction,
        logOutboundClick,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

export function useExperiment() {
  const { config, isReady, activePresetKey, setPreset } = useContext(AnalyticsContext);
  return {
    ...config,
    activePresetKey,
    setPreset,
    isLoaded: isReady,
  };
}
