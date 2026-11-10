import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("Org Member");
  const [theme, setTheme] = useState("blue");
  const [dark, setDark] = useState(false);
  const [viewState, setViewState] = useState("ready");
  const [logged, setLogged] = useState(true);

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
      login: () => setLogged(true),
      logout: () => setLogged(false),
      go,
    }),
    [role, theme, dark, viewState, logged, go],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
