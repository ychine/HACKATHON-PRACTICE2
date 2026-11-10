/**
 * AuthPage.jsx
 * Login + Sign-up — single page, mode toggled by ?signup=true or inline button.
 *
 * Visual language:
 *  - Full dark canvas matching the landing page
 *  - Atmosphere glow behind the form (violet + magenta, same as landing hero)
 *  - Logo component (identical to landing nav and sidebar)
 *  - Form card uses surface-1 / surface-2 tokens — not shadcn Card
 *  - Pill CTAs, negative letter-spacing, body Inter with OT variants
 *  - AnimatePresence mode-switch between login and signup
 *  - Dark/light toggle bottom-right (shared AppContext)
 */
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  RiArrowRightLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMoonLine,
  RiSunLine,
} from "react-icons/ri";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";

const ease = [0.16, 1, 0.3, 1];

/* ── Reusable field ───────────────────────────────────────────── */
function AuthField({ id, label, type = "text", placeholder, required, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword && show ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-[500] text-[var(--ink-muted)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="
            h-10 w-full rounded-[10px] border border-[var(--hairline)]
            bg-[var(--surface-2)] px-3 text-[14px] text-[var(--ink)]
            placeholder:text-[var(--ink-muted)] outline-none
            transition-shadow duration-150
            focus-visible:shadow-[0_0_0_1.5px_rgba(0,153,255,0.6)]
            pr-10
          "
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
          >
            {show ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function AuthPage() {
  const [searchParams]    = useSearchParams();
  const [signup, setSignup] = useState(searchParams.get("signup") === "true");
  const { logged, login, dark, setDark } = useApp();
  const navigate = useNavigate();

  if (logged) return <Navigate to="/app/orgs" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    login();
    navigate("/app/orgs");
  }

  return (
    <div className="relative min-h-screen bg-[var(--canvas)] text-[var(--ink)]">

      {/* ── Atmosphere — mirrors landing hero ───────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(107,59,222,0.24) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed right-0 top-0 h-[400px] w-[400px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 85% 5%, rgba(174,30,138,0.1) 0%, transparent 65%)",
        }}
      />

      {/* ── Top bar: Logo + back link ────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease }}
        className="relative flex h-14 items-center justify-between px-6"
      >
        <Link to="/" aria-label="Back to home">
          <Logo size={26} className="text-[var(--ink)]" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[var(--ink-muted)]">
            {signup ? "Already have an account?" : "New here?"}
          </span>
          <button
            type="button"
            onClick={() => setSignup((s) => !s)}
            className="rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-[7px] text-[13px] font-[500] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]"
          >
            {signup ? "Log in" : "Sign up"}
          </button>
        </div>
      </motion.nav>

      {/* ── Centred form card ───────────────────────────────────── */}
      <div className="relative flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.5, ease, delay: 0.06 }}
          className="w-full max-w-[400px]"
        >
          {/* Card */}
          <div className="rounded-[24px] border border-[var(--hairline)] bg-[var(--surface-1)] shadow-[0_32px_80px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.08)_inset]">

            {/* Card header */}
            <div className="border-b border-[var(--hairline)] px-7 pb-5 pt-7">
              {/* Large logo mark — centred, only the icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex size-14 items-center justify-center rounded-[18px] bg-[var(--surface-2)] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
                  {/* Render just the SVG mark at a large size */}
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <rect x="2"  y="11" width="28" height="16" rx="5" fill="currentColor" fillOpacity="0.12" />
                    <rect x="4"  y="7"  width="24" height="17" rx="5" fill="currentColor" fillOpacity="0.28" />
                    <rect x="6"  y="3"  width="20" height="17" rx="5" fill="currentColor" />
                    <rect x="11" y="8"  width="10" height="1.8" rx="0.9" fill="var(--accent-blue)" />
                    <rect x="11" y="11" width="10" height="1.8" rx="0.9" fill="var(--accent-blue)" />
                    <rect x="13.5" y="7" width="2.5" height="10" rx="1.25" fill="var(--accent-blue)" />
                  </svg>
                </div>
              </div>

              {/* Headline */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={signup ? "signup-head" : "login-head"}
                  initial={{ opacity: 0, y: 8  }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{    opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease }}
                >
                  <h1 className="text-[22px] font-[500] leading-tight tracking-[-0.035em] text-[var(--ink)]">
                    {signup ? "Create your account" : "Welcome back"}
                  </h1>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-muted)]">
                    {signup
                      ? "Get started — set up your org's treasury in minutes."
                      : "Sign in to access your organization budgets."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Form body */}
            <div className="px-7 pb-7 pt-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.form
                  key={signup ? "form-signup" : "form-login"}
                  initial={{ opacity: 0, x: signup ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{    opacity: 0, x: signup ? -16 : 16 }}
                  transition={{ duration: 0.26, ease }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  noValidate
                >
                  {signup && (
                    <AuthField
                      id="name"
                      label="Full name"
                      placeholder="Mariel Santos"
                      required
                      autoComplete="name"
                    />
                  )}

                  <AuthField
                    id="email"
                    label="School email"
                    type="email"
                    placeholder="you@university.edu"
                    required
                    autoComplete="email"
                  />

                  <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete={signup ? "new-password" : "current-password"}
                  />

                  {signup && (
                    <AuthField
                      id="confirm"
                      label="Confirm password"
                      type="password"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  )}

                  {/* Forgot password — login only */}
                  {!signup && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="-mt-1 text-[12px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.14, ease }}
                    className="
                      mt-1 flex h-10 w-full items-center justify-center gap-2
                      rounded-full bg-[var(--ink)] px-4
                      text-[14px] font-[500] tracking-[-0.01em] text-[var(--canvas)]
                      transition-opacity hover:opacity-90
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]
                    "
                  >
                    {signup ? "Create account" : "Log in"}
                    <RiArrowRightLine size={15} />
                  </motion.button>
                </motion.form>
              </AnimatePresence>

              {/* Divider + toggle */}
              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--hairline-soft)]" />
                <span className="text-[12px] text-[var(--ink-muted)]">or</span>
                <div className="h-px flex-1 bg-[var(--hairline-soft)]" />
              </div>

              <p className="mt-4 text-center text-[13px] text-[var(--ink-muted)]">
                {signup ? "Already have an account?" : "New to OrgBudget?"}{" "}
                <button
                  type="button"
                  onClick={() => setSignup((s) => !s)}
                  className="font-[500] text-[var(--ink)] underline-offset-2 transition-opacity hover:opacity-70 hover:underline"
                >
                  {signup ? "Log in instead" : "Create an account"}
                </button>
              </p>
            </div>
          </div>

          {/* Below-card hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-5 text-center text-[12px] text-[var(--ink-muted)]"
          >
            Free for student organizations · No credit card required
          </motion.p>
        </motion.div>
      </div>

      {/* ── Dark/light toggle — bottom-right ─────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={() => setDark(!dark)}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] text-[var(--ink-muted)] shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
            animate={{ opacity: 1, rotate:   0, scale: 1   }}
            exit={{    opacity: 0, rotate:  30, scale: 0.6 }}
            transition={{ duration: 0.2, ease }}
          >
            {dark ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
