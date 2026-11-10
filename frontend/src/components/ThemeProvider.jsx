/**
 * ThemeProvider
 * The design is ALWAYS dark-canvas. The "theme" just shifts
 * the accent-blue tint for the organization's brand color.
 * Per DESIGN.md: accent-blue is the signal color; it never
 * becomes a background fill, only focus rings / links.
 */
import { themes } from "@/lib/data";

export function ThemeProvider({ theme, children }) {
  // themes[k][3] is the brand hex — we map it into accent-blue slot
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
