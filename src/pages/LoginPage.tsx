import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Parent (2 children)", email: "rajan.m@example.com", password: "parent123" },
  { label: "Parent (1 child)", email: "suresh.n@example.com", password: "parent123" },
  { label: "Student login", email: "arjun.r@student.school.in", password: "student123" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error ?? "Login failed. Please try again.");
    }
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 shadow-lg">
            <GraduationCap size={28} className="text-cyan-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Ravion School</h1>
          <p className="mt-1 text-sm text-zinc-500">Student & Parent Portal</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/60 px-6 py-4">
            <h2 className="text-sm font-semibold text-zinc-700">Sign in to your account</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Enter your registered email and password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-10 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Demo Accounts</p>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc)}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-left transition hover:border-zinc-200 hover:bg-white"
              >
                <div>
                  <p className="text-xs font-semibold text-zinc-700">{acc.label}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">{acc.email}</p>
                </div>
                <span className="text-xs text-zinc-400">Use →</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          ABC Matriculation Higher Secondary School · Ravion School Platform
        </p>
      </div>
    </div>
  );
}
