import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Features", to: "/features" },
    { label: "How it Works", to: "/pricing" },
    { label: "Changelog", to: "/community" },
    { label: "Blog", to: "/blog" },
  ];

  return (
    <div
      className="sticky top-0 z-50 w-full flex justify-center"
      style={{
        padding: scrolled ? "12px 16px 0" : "0",
        transition: "padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <nav
        ref={menuRef}
        className={`w-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "bg-white/85 backdrop-blur-md border-stone-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            : "bg-white border-b border-stone-200/60 border-x-0 border-t-0"
        }`}
        style={{
          maxWidth: scrolled ? "56rem" : "100%",
          borderRadius: scrolled ? "16px" : "0px",
          transition: "max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
      >
        <div className="px-5 lg:px-6">
          <div className="flex items-center justify-between h-14">

            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">A</span>
              </div>
              <span className="text-[14px] font-semibold text-stone-900 tracking-tight">
                Arcio
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 bg-stone-100/60 rounded-lg px-1 py-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[12px] font-medium text-stone-500 hover:text-stone-900 hover:bg-white px-3 py-1.5 rounded-md transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-[12px] font-medium text-stone-500 hover:text-stone-900 transition-colors duration-150"
              >
                Log in
              </Link>
              <Link
                to="/get-started"
                className="text-[12px] font-medium text-white bg-stone-900 hover:bg-stone-800 px-3.5 py-1.5 rounded-lg transition-colors duration-150"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100 transition-colors duration-150"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col items-center justify-center gap-[4px]">
                <span className={`block h-[1.5px] w-3.5 bg-current rounded-full transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-[5.5px]" : ""}`} />
                <span className={`block h-[1.5px] w-3.5 bg-current rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-[1.5px] w-3.5 bg-current rounded-full transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[5.5px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-250 ease-in-out ${mobileOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pb-4 pt-1 space-y-0.5 border-t border-stone-100">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-[13px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-150">
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-stone-100 space-y-1">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-[13px] font-medium text-stone-600">Log in</Link>
              <Link to="/get-started" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-[13px] font-medium text-center text-white bg-stone-900">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
