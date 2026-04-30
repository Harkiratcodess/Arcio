import { useState } from 'react'

import './App.css'
import Navbar from './components/navbar'
import PortfolioIQHero from './components/Hero'
import TrustBar from './components/Trustbar'
import Features from './components/features'
import HowItWorks from './components/HowitWorks'
import CTA from './components/Cta'
import Footer from './components/footer'



function App() {
return(
  <div className="min-h-screen bg-slate-50">
    <Navbar/>
   <PortfolioIQHero/>
   <TrustBar/>
   <Features/>
   <HowItWorks/>
   <CTA/>
   <Footer/>
   
  </div>
)
}
 

export default App