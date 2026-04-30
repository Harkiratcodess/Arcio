import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="font-semibold text-stone-900 text-[15px]">Arcio</span>
        </Link>

               <nav className="hidden md:flex items-center gap-1 bg-white border border-stone-200 rounded-full px-2 py-1.5 shadow-sm">
          {["Features", "Pricing", "Community", "Blog"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="px-4 py-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-full transition-all duration-200"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-[13px] font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-[13px] font-semibold text-white bg-stone-900 rounded-full hover:bg-stone-700 transition-all duration-200 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        
        <button
          className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 h-0.5 bg-stone-900 mb-1 transition-all" />
          <div className="w-5 h-0.5 bg-stone-900 mb-1" />
          <div className="w-5 h-0.5 bg-stone-900" />
        </button>
      </div>

    
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 space-y-3">
          {["Features", "Pricing", "Community", "Blog"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="block text-[14px] font-medium text-stone-600 hover:text-stone-900 py-1"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-stone-100">
            <Link to="/login" className="text-[14px] font-medium text-stone-600">Log in</Link>
            <Link to="/signup" className="px-4 py-2 text-[13px] font-semibold text-white bg-stone-900 rounded-full text-center">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;