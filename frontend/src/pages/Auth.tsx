import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          {/* insert running emoji */}
          <h1 className="text-6xl font-bold">🏃‍♂️</h1>
          <h1 className="text-3xl font-bold">Sign in to Rhythm</h1>
          <p className="text-sm text-muted-foreground">
            Keep your life on pace — one task at a time.
          </p>
        </div>
        <AuthForm />
        <p className="text-center text-sm mt-6">
          <a href="/" className="text-black-600 hover:underline">
            ← Back
          </a>
        </p>
      </div>
    </div>
  );
}
