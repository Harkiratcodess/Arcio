import { useState } from "react";
import { Link } from "react-router-dom";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </>
    )}
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div className="relative min-h-screen bg-[#fafaf8] flex overflow-hidden">
 
      <div className="pointer-events-none absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[440px] w-[440px] rounded-full bg-stone-900/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] [background-size:68px_68px]" />

            <section className="hidden lg:flex w-[56%] bg-stone-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(45,212,191,0.2),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(45,212,191,0.14),transparent_42%)]" />

        <div className="relative z-10 w-full px-14 py-12 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
              <span className="text-stone-950 font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">Arcio</span>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
              <span className="text-teal-300 text-[11px] font-semibold tracking-wider uppercase">
                Beta · Free access
              </span>
            </div>

            <h1 className="mt-8 text-6xl leading-[0.94] font-bold tracking-tight text-white">
              Your portfolio,
              <br />
              <span className="font-serif italic font-normal text-teal-400">quantified.</span>
            </h1>

            <p className="mt-6 text-stone-300 text-[15px] leading-relaxed max-w-md">
              Analyze your GitHub repos, get AI-powered project ideas, and see exactly where you stand in the market.
            </p>

            <div className="mt-10 flex gap-3 max-w-[560px]">
              {[
                { label: "Avg score boost", value: "+24pts" },
                { label: "Setup time", value: "~30s" },
                { label: "Cost", value: "$0" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex-1 rounded-xl border border-stone-800 bg-stone-900/60 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:bg-stone-900"
                >
                  <p className="text-white font-bold font-mono text-lg">{s.value}</p>
                  <p className="text-stone-500 text-[10px] mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-stone-500 text-[11px]">© 2026 Arcio · Built by one developer</p>
        </div>
      </section>

   
      <section className="w-full lg:w-[44%] flex items-center justify-center px-6 sm:px-12 lg:px-14 py-12">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-7 h-7 rounded-md bg-stone-950 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-stone-900 font-semibold text-[15px]">Arcio</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Welcome back</h2>
            <p className="text-stone-500 text-[14px] mt-1.5">Sign in to your account to continue</p>
          </div>

          <div className="space-y-2.5 mb-6">
            <button className="group w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 text-[13.5px] font-medium text-stone-700 hover:-translate-y-0.5 hover:shadow active:scale-[0.98]">
              <span className="transition-transform duration-200 group-hover:scale-110"><GitHubIcon /></span>
              Continue with GitHub
            </button>
            <button className="group w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 text-[13.5px] font-medium text-stone-700 hover:-translate-y-0.5 hover:shadow active:scale-[0.98]">
              <span className="transition-transform duration-200 group-hover:scale-110"><GoogleIcon /></span>
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] text-stone-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 tracking-wide">Email</label>
              <div
                className={`relative rounded-xl border bg-white transition-all duration-200 ${
                  focused === "email"
                    ? "border-stone-400 shadow-[0_0_0_4px_rgba(120,113,108,0.1)]"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 text-[14px] text-stone-800 placeholder-stone-300 bg-transparent rounded-xl outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-semibold text-stone-600 tracking-wide">Password</label>
                <Link to="/forgot-password" className="text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div
                className={`relative rounded-xl border bg-white transition-all duration-200 ${
                  focused === "password"
                    ? "border-stone-400 shadow-[0_0_0_4px_rgba(120,113,108,0.1)]"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-[14px] text-stone-800 placeholder-stone-300 bg-transparent rounded-xl outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 hover:scale-110 transition-all duration-200"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white text-[14px] font-semibold hover:bg-stone-800 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(28,25,23,0.28)] active:scale-[0.98] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5">
                    <path
                      fillRule="evenodd"
                      d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-stone-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-stone-700 font-semibold hover:text-teal-600 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-teal-400"
            >
              Create one free
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}