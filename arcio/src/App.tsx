import { Routes, Route, Navigate } from "react-router-dom"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import Navbar from './components/navbar'
import PortfolioIQHero from './components/Hero'
import TrustBar from './components/Trustbar'
import Features from './components/features'
import HowItWorks from './components/HowitWorks'
import CTA from './components/Cta'
import Footer from './components/footer'

// Auth Pages
import Login from './pages/Login'
import Register from "./pages/Register"

// Dashboard Pages
import IdeaEngine from './pages/IdeaEngine'
import Analyzer from './pages/Analyzer'
import Market from './pages/Market'
import Community from './pages/Community'

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
  )
}

// Wrapper — if not logged in, redirect to login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  )
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* Protected — must be logged in */}
      <Route path="/ideas" element={<ProtectedRoute><IdeaEngine /></ProtectedRoute>} />
      <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="/dashboard" element={<Navigate to="/ideas" replace />} />
    </Routes>
  )
}

export default App