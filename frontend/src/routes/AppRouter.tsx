import { Routes, Route } from "react-router-dom"
import AuthPage from "../pages/Auth"
import DashboardPage from "../pages/Dashboard"
import NotFound from "../pages/NotFound"
import ProtectedRoute from "../components/layout/ProtectedRoute"
import AppShell from "../components/layout/AppShell"
import LandingPage from "../pages/LandingPage"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
