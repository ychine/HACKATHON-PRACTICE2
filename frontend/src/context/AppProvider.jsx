import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { getOrganizations } from "@/api";

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

  // Organizations come from the backend; the active one drives the Members tab.
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    let active = true;
    getOrganizations()
      .then((orgs) => {
        if (!active) return;
        setOrganizations(orgs);
        // pick the first org by default (or keep current if it still exists)
        setSelectedOrg((prev) => {
          if (prev && orgs.some((o) => o.id === prev.id)) return prev;
          return orgs[0] ?? null;
        });
      })
      .catch(() => {
        /* backend may be down — UI still works with empty list */
      });
    return () => {
      active = false;
    };
  }, []);

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
      organizations,
      selectedOrg,
      setSelectedOrg,
    }),
    [role, theme, dark, viewState, logged, go, organizations, selectedOrg],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
