import Navbar from "../components/navbar";
import Hero from "../components/Hero";
import Trustbar from "../components/Trustbar";
import Features from "../components/features";
import HowItWorks from "../components/HowitWorks";
import Cta from "../components/Cta";
import Footer from "../components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Trustbar />
      
      {/* These IDs must match exactly what you put 
          in the 'to' field of your navLinks array! 
      */}
      <div id="features">
        <Features />
      </div>
      
      <div id="how" style={{ scrollMarginTop: '100px' }}>
        <HowItWorks />
      </div>
      
      <Cta />
      <Footer />
    </>
  );
}