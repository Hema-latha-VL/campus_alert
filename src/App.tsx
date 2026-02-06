import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AppStateProvider } from "@/state/AppState";
import LandingPage from "./pages/LandingPage";
import CampusPulsePage from "./pages/CampusPulsePage";
import DashboardPage from "./pages/DashboardPage";
import TimelinePage from "./pages/TimelinePage";
import ArchivePage from "./pages/ArchivePage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RoleLoginPage from "./pages/RoleLoginPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import AdvisorDashboardPage from "./pages/AdvisorDashboardPage";
import AdvisorFeedbackPage from "./pages/AdvisorFeedbackPage";
import AdminAdvisorsPage from "./pages/AdminAdvisorsPage";
import AdminPage from "./pages/AdminPage";
import AdminCreateNoticePage from "./pages/admin/AdminCreateNoticePage";
import AdminDepartmentAnalyticsPage from "./pages/admin/AdminDepartmentAnalyticsPage";
import EventManagementPage from "./pages/EventManagementPage";
import MockTestPage from "./pages/MockTestPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SafeRedirect } from "./components/SafeRedirect";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:role" element={<RoleLoginPage />} />
        <Route path="/signup/student" element={<StudentSignupPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pulse"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <CampusPulsePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <TimelinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <ArchivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-tests"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MockTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["student", "advisor", "admin"]}>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/advisor"
          element={
            <ProtectedRoute allowedRoles={["advisor"]}>
              <AdvisorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/events"
          element={
            <ProtectedRoute allowedRoles={["advisor"]}>
              <EventManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/feedback"
          element={
            <ProtectedRoute allowedRoles={["advisor", "admin"]}>
              <AdvisorFeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SafeRedirect to="/admin/advisors" title="Admin Area" description="Loading admin tools…" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/advisors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAdvisorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateNoticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDepartmentAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EventManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-preview"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppStateProvider>
          <AppContent />
        </AppStateProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
