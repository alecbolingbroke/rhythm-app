import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import supabase from "../../lib/supabaseClient";

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Topbar with Popout Trigger */}
      <header className="w-full flex items-center justify-between p-4 border-b bg-muted">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-6 bg-background text-foreground border-r border-border shadow-md sm:rounded-r-xl"
          >
            <SheetHeader className="items-center">
              <SheetTitle className="text-xl font-bold tracking-tight">
                Rhythm 🏃‍♂️
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-4 text-left">
              <a
                href="/tasks"
                className="block px-2 py-1 rounded hover:bg-muted transition-colors"
              >
                Tasks
              </a>
              <a
                href="/calendar"
                className="block px-2 py-1 rounded hover:bg-muted transition-colors"
              >
                Calendar
              </a>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full mt-6"
              >
                Sign Out
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold">Rhythm 🏃‍♂️</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
