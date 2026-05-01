import Navbar from "../components/navbar"
import Hero from "../components/Hero"
import Trustbar from "../components/Trustbar"
import Features from "../components/features"
import HowItWorks from "../components/HowitWorks"
import Cta from "../components/Cta"
import Footer from "../components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Trustbar />
      <Features />
      <HowItWorks />
      <Cta />
      <Footer />
    </>
  )
}