import { Routes, Route } from "react-router-dom"
import Navbar from './components/navbar'
import PortfolioIQHero from './components/Hero'
import TrustBar from './components/Trustbar'
import Features from './components/features'
import HowItWorks from './components/HowitWorks'
import CTA from './components/Cta'
import Footer from './components/footer'
import Login from './pages/Login'
import Register from "./pages/Register"

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
  )
}

export default App