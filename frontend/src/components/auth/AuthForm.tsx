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
  const [name, setName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const { session } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/tasks");
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isSigningUp) {
          handleSignup();
        } else {
          handleLogin();
        }
      }}
      className="max-w-md mx-auto p-6 space-y-6 border rounded-lg shadow-lg bg-white dark:bg-zinc-900"
    >
      {" "}
      <div className="space-y-4">
        {isSigningUp && (
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={isSigningUp ? handleSignup : handleLogin}
          disabled={loginLoading || signupLoading}
        >
          {loginLoading || signupLoading
            ? "Loading..."
            : isSigningUp
            ? "Sign Up"
            : "Sign In"}
        </Button>

        <button
          className="text-sm text-muted-foreground hover:underline"
          type="button"
          onClick={() => setIsSigningUp((prev) => !prev)}
        >
          {isSigningUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </form>
  );
}
