// Browser-side helper: report a conversion to whichever analytics tools are active.

export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  };
  w.gtag?.("event", name, params);
  w.clarity?.("event", name);
}
