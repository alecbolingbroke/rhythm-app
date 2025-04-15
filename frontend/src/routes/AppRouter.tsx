import { Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppShell from "../components/layout/AppShell";
import LandingPage from "../pages/LandingPage";
import CalendarPage from "../pages/CalendarPage";
import TasksPage from "../pages/TasksPage";
import { TasksProvider } from "@/context/tasksProvider";
import ChatPage from "@/pages/ChatPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksProvider>
              <AppShell>
                <TasksPage />
              </AppShell>
            </TasksProvider>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <TasksProvider>
              <AppShell>
                <CalendarPage />
              </AppShell>
            </TasksProvider>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <TasksProvider>
              <AppShell>
                <ChatPage />
              </AppShell>
            </TasksProvider>
          </ProtectedRoute>
        }
      />

      {/* Error Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
