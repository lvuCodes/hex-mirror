import type { ThemeId } from "@lvucodes/ui";

export const SITE_THEME: ThemeId = "lvucodes";

// Pin this site to the lvuCodes theme regardless of the visitor's stored choice.
// The storage key is shared across every site on this origin, so the theme is
// set on <html> only and never written back to storage.
export function applySiteTheme(): void {
  document.documentElement.dataset.theme = SITE_THEME;
}
