import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import { useUser } from "../../hooks/useUser";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const { session } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleLogin = async () => {
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login failed", { description: error.message });
    } else {
      toast.success("You're logged in!");
      navigate("/");
    }

    setLoginLoading(false);
  };

  const handleSignup = async () => {
    setSignupLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error("Signup failed", { description: error.message });
    } else {
      toast.success("Signup successful!", {
        description: "Check your email to confirm your account.",
      });
    }

    setSignupLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 border rounded-lg shadow-lg bg-white dark:bg-zinc-900">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div
        className="flex justify-center space-x-2"
      >
        <Button onClick={handleLogin} disabled={loginLoading}>
          {loginLoading ? "Signing in..." : "Sign In"}
        </Button>
        <Button
          variant="outline"
          onClick={handleSignup}
          disabled={signupLoading}
        >
          {signupLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
