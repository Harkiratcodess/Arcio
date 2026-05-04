import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  AuthenticateWithRedirectCallback,
  useSignUp,
  useClerk,
} from "@clerk/clerk-react";
import Navbar from "./components/navbar";
import PortfolioIQHero from "./components/Hero";
import TrustBar from "./components/Trustbar";
import Features from "./components/features";
import HowItWorks from "./components/HowitWorks";
import CTA from "./components/Cta";
import Footer from "./components/footer";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import IdeaEngine from "./pages/IdeaEngine";
import Analyzer from "./pages/Analyzer";
import Market from "./pages/Market";
import Community from "./pages/Community";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <PortfolioIQHero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function VerifyEmail() {
  const { setActive } = useClerk();
  const { signUp, isLoaded } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!isLoaded) return
  setLoading(true)
  setError("")
  try {
    const result = await signUp.attemptEmailAddressVerification({ code })
    
    if (result.status === "complete") {
      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId })
      }
      navigate("/ideas")
    } else {
      setError("Verification incomplete. Please try again.")
    }
  } catch (err: any) {
    // If session already exists just redirect
    if (err.errors?.[0]?.code === "session_exists") {
      navigate("/ideas")
      return
    }
    setError(err.errors?.[0]?.message || "Invalid code. Try again.")
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-7 h-7 rounded-md bg-stone-950 flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="text-stone-900 font-semibold text-[15px]">
            Arcio
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
            Check your email
          </h2>
          <p className="text-stone-500 text-[14px] mt-1.5">
            We sent a verification code to your email. Enter it below to
            continue.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-stone-600 mb-1.5 tracking-wide">
              Verification code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2.5 text-[14px] text-stone-800 placeholder-stone-300 bg-white border border-stone-200 rounded-xl outline-none focus:border-stone-400 focus:shadow-[0_0_0_4px_rgba(120,113,108,0.1)] transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white text-[14px] font-semibold hover:bg-stone-800 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(28,25,23,0.28)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              "Verify email →"
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-stone-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-stone-700 font-semibold hover:text-teal-600 transition-colors underline underline-offset-4 decoration-stone-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  React.useEffect(() => {
    handleRedirectCallback({
      afterSignInUrl: "/ideas",
      afterSignUpUrl: "/ideas",
    }).then(() => {
      navigate("/ideas", { replace: true });
    }).catch((err: any) => {
      console.error("SSO callback error:", err);
      setError("Authentication failed. Redirecting...");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-sm text-stone-500 font-medium">
          {error || "Completing sign in..."}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/sso-callback" element={<SSOCallback />} />
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected */}
      <Route
        path="/ideas"
        element={
          <ProtectedRoute>
            <IdeaEngine />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyzer"
        element={
          <ProtectedRoute>
            <Analyzer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/market"
        element={
          <ProtectedRoute>
            <Market />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/dashboard" element={<Navigate to="/ideas" replace />} />
    </Routes>
  );
}

export default App;

