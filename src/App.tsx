import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Equipment from "@/pages/Equipment";
import ReportDowntime from "@/pages/ReportDowntime";
import Downtimes from "@/pages/Downtimes";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const DashboardGuard = () => {
  const { canViewDashboard } = useRoleAccess();
  if (!canViewDashboard) return <Navigate to="/equipment" replace />;
  return <Dashboard />;
};

const DowntimesGuard = () => {
  const { canViewDowntimes } = useRoleAccess();
  if (!canViewDowntimes) return <Navigate to="/equipment" replace />;
  return <Downtimes />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardGuard />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/report-downtime" element={<ReportDowntime />} />
        <Route path="/downtimes" element={<DowntimesGuard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
