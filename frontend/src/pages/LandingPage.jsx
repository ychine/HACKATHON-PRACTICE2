/**
 * LandingPage.jsx
 * Uses the shared AppContext dark/setDark — same toggle as the dashboard.
 * data-theme is set on <html> by AppProvider, so no local style injection needed.
 */
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { useApp } from "@/context/AppContext";
import { LandingNav }        from "@/components/landing/LandingNav";
import { LandingHero }       from "@/components/landing/LandingHero";
import { LandingProblem }    from "@/components/landing/LandingProblem";
import { LandingFeatures }   from "@/components/landing/LandingFeatures";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingRoles }      from "@/components/landing/LandingRoles";
import { LandingTrust }      from "@/components/landing/LandingTrust";
import { LandingCTA }        from "@/components/landing/LandingCTA";
import { LandingFooter }     from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const navigate       = useNavigate();
  const { dark, setDark } = useApp();

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {/* Nav */}
          <LandingNav
            onLogin={() => navigate("/login")}
            onRegister={() => navigate("/login?signup=true")}
            isDark={dark}
            onToggleDark={() => setDark((d) => !d)}
          />

          <main>
            <LandingHero
              onRegister={() => navigate("/login?signup=true")}
              onLogin={() => navigate("/login")}
              onDemo={() => navigate("/app/dashboard")}
            />
            <LandingProblem />
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingRoles />
            <LandingTrust />
            <LandingCTA
              onRegister={() => navigate("/login?signup=true")}
              onContact={() => navigate("/app/help")}
            />
          </main>

          <LandingFooter />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
