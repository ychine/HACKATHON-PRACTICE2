import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [role, setRole]           = useState("Org Member");
  const [theme, setTheme]         = useState("blue");
  const [viewState, setViewState] = useState("ready");
  const [logged, setLogged]       = useState(true);

  /* ── Dark mode — single source of truth for the whole app ── */
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("app-theme");
    if (stored) return stored === "dark";
    // default: dark (brand IS dark per DESIGN.md)
    return true;
  });

  /* Sync data-theme on <html> and persist whenever dark changes */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("app-theme", dark ? "dark" : "light");
  }, [dark]);

  const go = useCallback(
    (path) => {
      setViewState("ready");
      navigate(path);
    },
    [navigate],
  );

  const value = useMemo(
    () => ({
      role,
      setRole,
      theme,
      setTheme,
      dark,
      setDark,
      viewState,
      setViewState,
      logged,
      login:  () => setLogged(true),
      logout: () => setLogged(false),
      go,
    }),
    [role, theme, dark, viewState, logged, go],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
