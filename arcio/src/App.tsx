import { Routes, Route, Navigate } from "react-router-dom"
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* Dashboard Routes */}
      <Route path="/ideas" element={<IdeaEngine />} />
      <Route path="/analyzer" element={<Analyzer />} />
      <Route path="/market" element={<Market />} />
      <Route path="/community" element={<Community />} />
      
      {/* Fallback route if they try to access the old /dashboard URL */}
      <Route path="/dashboard" element={<Navigate to="/ideas" replace />} />
    </Routes>
  )
}

export default App
