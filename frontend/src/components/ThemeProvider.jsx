/**
 * ThemeProvider
 * Applies the org's accent color as a CSS custom property.
 * Dark / light mode is handled globally via data-theme on <html>
 * (set by AppProvider) — ThemeProvider is accent-only.
 */
import { themes } from "@/lib/data";

export function ThemeProvider({ theme, children }) {
  const accent = themes[theme]?.[3] ?? "#0099ff";
  return (
    <div
      style={{
        "--accent-blue": accent,
        "--ring":        accent,
      }}
    >
      {children}
    </div>
  );
}
