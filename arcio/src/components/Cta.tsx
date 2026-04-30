import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="bg-[#fafaf8] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-stone-200  overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 bg-[#F8F6F2] px-10 py-14 lg:px-14 lg:py-16 border-b lg:border-b-0 lg:border-r border-stone-200">

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-stone-400" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                  (04) Open Invitation
                </span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.05] mb-6">
                Make your next
                <br />
                commit{" "}
                <span className="font-serif italic font-normal text-teal-700">
                  count.
                </span>
              </h2>

              <p className="text-[15px] text-stone-500 leading-relaxed max-w-md mb-10">
                Arcio is free while in beta. No card, no team seats, no
                tricks — just a quieter way to see your work.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-white bg-stone-900 rounded-full hover:bg-stone-700 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  Create an account
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center text-[14px] font-medium text-stone-500 hover:text-stone-800 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-500 transition-all duration-200 py-3.5"
                >
                  I already have one
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 px-10 py-14 lg:px-12 lg:py-16">
              <div className="flex items-center justify-between mb-10">
                <span className="text-[11px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                  Currently
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-stone-600">LIVE · V0.1</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-10">
                {[
                  { label: "PRICE", value: "$0" },
                  { label: "SETUP", value: "~30s" },
                  { label: "ACCESS", value: "read-only" },
                  { label: "BUILT BY", value: "one dev" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-stone-400 uppercase mb-1.5">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-stone-900 font-mono">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-stone-200 mb-6" />

              <p className="text-[12px] text-stone-400 leading-relaxed">
                Early access — feedback shapes the roadmap.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;