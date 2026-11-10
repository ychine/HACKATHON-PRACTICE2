import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppProvider";
import { useApp } from "@/context/AppContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { MobileDrawer, Sidebar, SIDEBAR_W, SIDEBAR_W_COLLAPSED } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { visibleNav } from "@/lib/nav";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import OrgsPage from "@/pages/OrgsPage";
import DashboardPage from "@/pages/DashboardPage";
import RemittancesPage from "@/pages/RemittancesPage";
import NewRemittancePage from "@/pages/NewRemittancePage";
import RemittanceDetailPage from "@/pages/RemittanceDetailPage";
import MembersPage from "@/pages/MembersPage";
import HistoryPage from "@/pages/HistoryPage";
import ReportsPage from "@/pages/ReportsPage";
import AuditPage from "@/pages/AuditPage";
import SettingsPage from "@/pages/SettingsPage";
import HelpPage from "@/pages/HelpPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Root />
      </AppProvider>
    </BrowserRouter>
  );
}

function Root() {
  const { theme } = useApp();
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
        <Routes>
          {/* Public routes — no shell */}
          <Route path="/"       element={<LandingPage />} />
          <Route path="/login"  element={<AuthPage />} />

          {/* App shell */}
          <Route path="/app" element={<Shell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="orgs"               element={<OrgsPage />} />
            <Route path="dashboard"          element={<DashboardPage />} />
            <Route path="remittances"        element={<RemittancesPage />} />
            <Route path="remittances/new"    element={<NewRemittancePage />} />
            <Route path="remittances/detail" element={<RemittanceDetailPage />} />
            <Route path="members"            element={<MembersPage />} />
            <Route path="history"            element={<HistoryPage />} />
            <Route path="reports"            element={<ReportsPage />} />
            <Route path="audit"              element={<AuditPage />} />
            <Route path="settings"           element={<SettingsPage />} />
            <Route path="help"               element={<HelpPage />} />
          </Route>

          {/* Legacy paths — redirect into /app */}
          <Route path="/dashboard"          element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/remittances"        element={<Navigate to="/app/remittances" replace />} />
          <Route path="/remittances/new"    element={<Navigate to="/app/remittances/new" replace />} />
          <Route path="/remittances/detail" element={<Navigate to="/app/remittances/detail" replace />} />
          <Route path="/members"            element={<Navigate to="/app/members" replace />} />
          <Route path="/history"            element={<Navigate to="/app/history" replace />} />
          <Route path="/reports"            element={<Navigate to="/app/reports" replace />} />
          <Route path="/audit"              element={<Navigate to="/app/audit" replace />} />
          <Route path="/settings"           element={<Navigate to="/app/settings" replace />} />
          <Route path="/help"               element={<Navigate to="/app/help" replace />} />
          <Route path="/orgs"               element={<Navigate to="/app/orgs" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

function Shell() {
  const { logged, role, setViewState } = useApp();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const visible = visibleNav(role);
  const allowed =
    visible.some((n) => n.path === location.pathname) ||
    ["/app/orgs", "/app/remittances/new", "/app/remittances/detail"].includes(location.pathname);

  useEffect(() => {
    setViewState?.("ready");
    setMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!logged) return <Navigate to="/login" replace />;
  if (!allowed) return <Navigate to="/app/dashboard" replace />;

  /* Use inline style so the value tracks Motion sidebar width exactly.
     The max-lg:!pl-0 override removes padding on mobile. */
  const sidebarW = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;
  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        style={{
          paddingLeft: sidebarW,
          transition: "padding-left 260ms cubic-bezier(0.16,1,0.3,1)",
        }}
        className="max-lg:!pl-0"
      >
        <Header onMenu={() => setMobile(true)} />
        {mobile && <MobileDrawer onClose={() => setMobile(false)} />}
        <main className="mx-auto max-w-[1100px] px-4 pb-28 pt-8 sm:px-6 lg:pb-12">
          <Outlet />
        </main>
        <BottomNav onMore={() => setMobile(true)} />
      </div>
      <Toaster richColors theme="dark" />
    </>
  );
}
