import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Award,
  CalendarCheck,
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  Mail,
  WifiOff,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { LoginErrorCode } from "../context/AuthContext";

type ViewState = "login" | "forgotPassword" | "resetSent";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const sessionExpired = (location.state as { reason?: string } | null)?.reason === "session-expired";

  const [view, setView] = useState<ViewState>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    sessionExpired ? "Your session has expired. Please sign in again." : null
  );
  const [errorCode, setErrorCode] = useState<LoginErrorCode | null>(sessionExpired ? null : null);

  const [resetIdentifier, setResetIdentifier] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Please enter both your registered ID/email and password.");
      return;
    }

    setIsLoading(true);
    const result = await login(identifier.trim(), password);
    setIsLoading(false);

    if (result.success) {
      navigate("/", { replace: true });
      return;
    }

    setErrorMessage(result.error ?? "Invalid credentials. Please verify your details.");
    setErrorCode(result.code ?? "invalid");
  };

  const handleQuickFill = (role: "student" | "parent") => {
    setErrorMessage(null);
    setErrorCode(null);
    if (role === "student") {
      setIdentifier("arjun.r@student.school.in");
      setPassword("student123");
    } else {
      setIdentifier("rajan.m@example.com");
      setPassword("parent123");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) return;
    setView("resetSent");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 lg:grid lg:grid-cols-2">
        {/* Left: brand + highlights (desktop only) */}
        <div className="hidden flex-col justify-between bg-zinc-900 p-10 text-white lg:flex">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                <GraduationCap size={20} className="text-cyan-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-base font-bold leading-none">Ravion</p>
                <p className="mt-0.5 text-[11px] font-medium text-zinc-400 leading-none">Student &amp; Parent Portal</p>
              </div>
            </div>

            <h2 className="mt-10 text-2xl font-bold leading-snug tracking-tight">
              One window into your child&rsquo;s school day.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Attendance, homework, exams, fees and school updates — all in one calm,
              easy-to-scan place for parents and students.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3">
              {[
                { icon: BookOpen, label: "Homework & exam status", color: "text-blue-400" },
                { icon: CalendarCheck, label: "Live attendance & leave", color: "text-emerald-400" },
                { icon: Award, label: "Report cards & progress", color: "text-amber-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <item.icon size={16} className={item.color} strokeWidth={1.5} />
                  <span className="text-xs font-medium text-zinc-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck size={13} className="text-emerald-400" />
            Your school data stays private and secure.
          </div>
        </div>

        {/* Right: form */}
        <div className="p-6 sm:p-10">
          {view === "login" && (
            <>
              <div className="mb-6 flex items-center gap-2.5 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
                  <GraduationCap size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 leading-none">Ravion</p>
                  <p className="mt-0.5 text-[10px] font-medium text-zinc-500 leading-none">Student Portal</p>
                </div>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-zinc-900">Sign in to your portal</h1>
              <p className="mt-1 text-sm text-zinc-500">
                For parents and students of Ravion School. Use your registered email and password.
              </p>

              {errorMessage && (
                <div
                  role="alert"
                  className={`mt-5 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${
                    errorCode === "network"
                      ? "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200"
                      : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
                  }`}
                >
                  {errorCode === "network" ? (
                    <WifiOff size={16} className="mt-0.5 shrink-0" />
                  ) : errorCode === "locked" ? (
                    <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  )}
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Registered email / student ID
                  </label>
                  <div className="relative">
                    <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-zinc-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setView("forgotPassword")}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  Keep me signed in on this device
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in&hellip;
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Prototype demo only &mdash; sample accounts
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("student")}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    <GraduationCap size={12} /> Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("parent")}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    <Users size={12} /> Parent
                  </button>
                </div>
              </div>

              <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck size={13} className="text-emerald-500" />
                Your credentials are protected. Trouble signing in? Contact the school office.
              </p>
            </>
          )}

          {view === "forgotPassword" && (
            <>
              <button
                type="button"
                onClick={() => setView("login")}
                className="mb-6 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900"
              >
                <ArrowLeft size={14} /> Back to sign in
              </button>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">Reset your password</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Enter your registered email or mobile number and we&rsquo;ll send you a link to reset your password.
              </p>
              <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">Registered email / mobile number</label>
                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Send reset link
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}

          {view === "resetSent" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-zinc-900">Check your inbox</h1>
              <p className="mt-1.5 max-w-xs text-sm text-zinc-500">
                If an account exists for <span className="font-medium text-zinc-700">{resetIdentifier}</span>, a
                password reset link is on its way.
              </p>
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setResetIdentifier("");
                }}
                className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
              >
                <ArrowLeft size={14} /> Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
