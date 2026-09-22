import type Lenis from "lenis";

// The page's smooth-scroll instance, so in-page links can glide to a target.
export const lenisRef: { current: Lenis | null } = { current: null };

// Scroll to a page offset, smoothly when Lenis is running.
export function scrollToY(y: number) {
  if (lenisRef.current) lenisRef.current.scrollTo(y);
  else window.scrollTo({ top: y, behavior: "smooth" });
}
