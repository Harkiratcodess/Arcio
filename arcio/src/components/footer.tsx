import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#E0DDD6] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-semibold text-stone-900 text-[15px]">Arcio</span>
            </Link>
            <p className="text-[13px] text-stone-400 leading-relaxed max-w-xs">
              Portfolio intelligence for developers who want their work to be unforgettable.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-4">
              Product
            </p>
            <ul className="space-y-3">
              {["Features", "How it works", "Community"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(/ /g, "-")}`}
                    className="text-[13px] text-stone-500 hover:text-stone-900 transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-4">
              Company
            </p>
            <ul className="space-y-3">
              {["About", "Changelog", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-[13px] text-stone-500 hover:text-stone-900 transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-4">
              Stay Sharp
            </p>
            <p className="text-[13px] text-stone-400 leading-relaxed">
              Weekly market pulse — top skills, demand, and ideas to build.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] text-stone-400">
            © 2026 Folio.IQ — Built by a developer, for developers.
          </p>
          <p className="text-[12px] text-stone-400 font-mono">
            v0.1 · made with care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;