import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { WalletCards } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
} from "@/components/ui";
import { Field } from "@/components/Field";
import { useApp } from "@/context/AppContext";

export default function AuthPage() {
  const [signup, setSignup] = useState(false);
  const { logged, login } = useApp();
  const navigate = useNavigate();

  if (logged) return <Navigate to="/app/orgs" replace />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--canvas)] p-4">
      {/* Gradient atmosphere — behind the card */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full blur-[120px] opacity-30"
          style={{ background: "radial-gradient(ellipse, #3b1f6e 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-[14px] bg-[var(--surface-2)] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
            <WalletCards className="size-6 text-[var(--ink)]" />
          </div>
          <span className="text-[20px] font-[500] tracking-[-0.03em] text-[var(--ink)]">
            Org Budget Tracker
          </span>
        </div>

        <Card className="bg-[var(--surface-1)]">
          <CardHeader>
            <CardTitle className="text-[22px] tracking-[-0.03em]">
              {signup ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {signup
                ? "Get started with your student organization."
                : "Sign in to access your organization budgets."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.form
                key={signup ? "signup" : "login"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                  navigate("/app/orgs");
                }}
              >
                <Field label="School email" id="email">
                  <Input id="email" type="email" required placeholder="you@university.edu" />
                </Field>
                <Field label="Password" id="password">
                  <Input id="password" type="password" required placeholder="••••••••" />
                </Field>
                {signup && (
                  <Field label="Confirm password" id="confirm">
                    <Input id="confirm" type="password" placeholder="••••••••" />
                  </Field>
                )}
                <Button className="w-full mt-2">
                  {signup ? "Create account" : "Log in"}
                </Button>
              </motion.form>
            </AnimatePresence>

            <Separator className="my-5" />
            <p className="text-center text-[13px] text-[var(--ink-muted)]">
              {signup ? "Already have an account?" : "New here?"}{" "}
              <button
                type="button"
                onClick={() => setSignup(!signup)}
                className="font-[500] text-[var(--ink)] underline-offset-2 hover:underline"
              >
                {signup ? "Log in" : "Sign up"}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
