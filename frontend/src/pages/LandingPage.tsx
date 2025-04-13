import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <h1 className="text-6xl font-bold mb-4">🏃‍♂️</h1>
      <h1 className="text-4xl font-bold mb-4">Welcome to Rhythm</h1>
      <p className="text-lg mb-6">
        A clean way to manage your tasks and stay on pace.
      </p>
      <Button onClick={() => navigate("/auth")}>Get Started</Button>
    </div>
  );
}
