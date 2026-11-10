/**
 * Logo.jsx — OrgBudget brand mark
 *
 * A three-layer stacked-card glyph (budget records) with a ₱ accent
 * drawn in --accent-blue. Uses currentColor by default so it inherits
 * the nearest text color and works in both dark and light mode without
 * any prop changes.
 *
 * Props:
 *   size    — number px (default 32) — controls the icon square
 *   mark    — bool  — icon-only, no wordmark (default false)
 *   className — string — applied to the outer <span>
 */
import { cn } from "@/lib/utils";

export function Logo({ size = 32, mark = false, className }) {
  const accent = "var(--accent-blue)";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center gap-[0.55em]",
        className,
      )}
    >
      {/* ── Icon glyph ─────────────────────────────── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Layer 3 — deepest, most transparent */}
        <rect x="2"  y="11" width="28" height="16" rx="5" fill="currentColor" fillOpacity="0.12" />
        {/* Layer 2 — middle */}
        <rect x="4"  y="7"  width="24" height="17" rx="5" fill="currentColor" fillOpacity="0.28" />
        {/* Layer 1 — top card, solid */}
        <rect x="6"  y="3"  width="20" height="17" rx="5" fill="currentColor" />

        {/* ₱ symbol on top card — two horizontal bars */}
        <rect x="11" y="8"  width="10" height="1.8" rx="0.9" fill={accent} />
        <rect x="11" y="11" width="10" height="1.8" rx="0.9" fill={accent} />
        {/* vertical stem */}
        <rect x="13.5" y="7" width="2.5" height="10" rx="1.25" fill={accent} />
      </svg>

      {/* ── Wordmark ───────────────────────────────── */}
      {!mark && (
        <span
          className="text-[var(--ink)]"
          style={{
            fontSize:      Math.round(size * 0.47),
            fontWeight:    500,
            letterSpacing: "-0.025em",
            lineHeight:    1,
          }}
        >
          OrgBudget
        </span>
      )}
    </span>
  );
}
