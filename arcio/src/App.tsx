import { useState } from 'react'

import './App.css'
import Navbar from './components/navbar'
import PortfolioIQHero from './components/Hero'
import TrustBar from './components/Trustbar'
import Features from './components/features'



function App() {
return(
  <div className="min-h-screen bg-slate-50">
    <Navbar/>
   <PortfolioIQHero/>
   <TrustBar/>
   <Features/>
   
  </div>
)
}
 

export default App