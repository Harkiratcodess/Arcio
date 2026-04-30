import { useState } from 'react'

import './App.css'
import Navbar from './components/navbar'
import PortfolioIQHero from './components/Hero'
import TrustBar from './components/Trustbar'


function App() {
return(
  <div className="min-h-screen bg-slate-50">
    <Navbar/>
   <PortfolioIQHero/>
   <TrustBar/>
  </div>
)
}
 

export default App