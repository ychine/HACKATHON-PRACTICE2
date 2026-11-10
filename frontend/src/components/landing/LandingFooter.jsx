/**
 * LandingFooter.jsx — clean version
 * Only real app routes. No social icons, no hackathon badge, no GitHub.
 */
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const COLS = [
  {
    heading: "Product",
    links: [
      { label: "Features",        href: "#features",    external: false },
      { label: "How It Works",    href: "#how-it-works", external: false },
      { label: "For Org Leaders", href: "#roles",        external: false },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In",    href: "/login",             external: false },
      { label: "Sign Up",   href: "/login?signup=true", external: false },
      { label: "Dashboard", href: "/app/dashboard",     external: false },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help",    href: "/app/help",    external: false },
      { label: "Contact", href: "#contact",     external: false },
      { label: "Settings", href: "/app/settings", external: false },
    ],
  },
];

function FooterLink({ label, href }) {
  const isAnchor = href.startsWith("#");
  const isExternal = href.startsWith("http");

  if (isAnchor || isExternal) {
    return (
      <a
        href={href}
        className="text-[13px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
      >
        {label}
      </a>
    );
  }
  return (
    <Link
      to={href}
      className="text-[13px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
    >
      {label}
    </Link>
  );
}

export function LandingFooter() {
  return (
    <footer
      className="border-t border-[var(--hairline-soft)] px-6 pb-10 pt-14"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-5xl">
        {/* Top: logo + columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo size={26} />
            <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-[var(--ink-muted)]">
              A role-based group finance platform for orgs that take trust seriously.
            </p>
          </div>

          {/* Nav columns */}
          {COLS.map(({ heading, links }) => (
            <div key={heading}>
              <p className="mb-3 text-[11px] font-[600] uppercase tracking-[0.07em] text-[var(--ink-muted)]">
                {heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <FooterLink label={label} href={href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start gap-2 border-t border-[var(--hairline-soft)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--ink-muted)]">
            © 2026 OrgBudget. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[12px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">Privacy</a>
            <a href="#" className="text-[12px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
