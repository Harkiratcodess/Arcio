import React from "react";

const PortfolioIQHero: React.FC = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden font-sans">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 max-w-7xl mx-auto flex pointer-events-none">
        {[...Array(13)].map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-stone-100 h-full last:border-r-0"
          />
        ))}
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-33 items-center">
         
          <div className="lg:col-span-4 space-y-10">
            <div>
              <p className="text-[13px] font-medium text-teal-700 tracking-wider uppercase mb-5">
                For developers who want to stand out
              </p>

              <h1 className="text-[42px] md:text-[54px] lg:text-[60px] leading-[1.06] font-bold text-stone-950 tracking-tighter mb-6">
                Your portfolio,{" "}
                <span className="font-serif italic text-teal-700 font-normal">
                  quantified.
                </span>
              </h1>

              <p className="text-[17px] text-stone-500 leading-relaxed max-w-lg">
                Analyze your GitHub repos, get AI-generated project ideas
                matched to your target role, and benchmark your skills against
                thousands of developers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <button className="inline-flex items-center gap-2.5 px-6 py-3.5 text-[15px] font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 active:scale-[0.98] transition-all duration-150 shadow-sm">
                Analyze My GitHub
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="inline-flex items-center gap-2.5 px-6 py-3.5 text-[15px] font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:border-stone-300 hover:bg-stone-50 active:scale-[0.98] transition-all duration-150">
                See How It Works
              </button>
            </div>

            <div className="flex items-center gap-5 text-[12px] text-stone-400 font-medium pt-2">
              <span>Free to start</span>
              <span className="w-px h-3.5 bg-stone-100" />
              <span>No credit card</span>
              <span className="w-px h-3.5 bg-stone-100" />
              <span>3 free analyses</span>
            </div>
          </div>

       
          <div className="lg:col-span-7 relative pt-12 lg:pt-0 min-h-[520px]">
          
            <div className="absolute top-1/2 left-1/3 w-80 h-80 -translate-y-1/2 -translate-x-1/2 bg-teal-100 rounded-full blur-[100px] opacity-40 z-0" />

            <div className="relative z-10 w-[88%] ml-auto rounded-xl border border-stone-200 bg-white shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
            
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-100 bg-stone-50/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-md bg-white border border-stone-100">
                    <span className="text-[10px] text-stone-400 font-medium">
                      portfolioiq.dev/dashboard
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                      Developer Score
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-extrabold text-stone-950 tracking-tighter">
                        92
                      </span>
                      <span className="text-sm font-semibold text-stone-300">
                        /100
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-md bg-teal-50 border border-teal-100">
                    <span className="text-[10px] font-semibold text-teal-700">
                      +12 this week
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: "92%" }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4 pt-1">
                  {[
                    { label: "Repos", value: "42" },
                    { label: "Rank", value: "Top 5%" },
                    { label: "Commits", value: "1.2k" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-stone-100 bg-stone-50/50 p-4"
                    >
                      <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                        {s.label}
                      </p>
                      <p className="text-xl font-bold text-stone-950 mt-1">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                             <div className="pt-3">
                  <div className="flex justify-end gap-1.5 h-16 items-end">
                    {[15, 25, 12, 18, 30, 22, 28, 45, 33, 40].map(
                      (height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-stone-100 rounded-t-sm group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="h-full w-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-stone-400 font-medium pt-3 border-t border-stone-100 mt-1">
                    <span>Commits</span>
                    <span>14 Days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-16 -top-[-200px] z-20 w-[65%] max-w-[340px] pointer-events-none">
              <img
                src="1.png"
                alt="Developer collaboration illustration"
                className="w-full h-50 drop-shadow-2xl"
              />
            </div>

            
            <div className="absolute -right-[-65px] top-3/5 z-20 w-[30%] max-w-[200px] pointer-events-none">
              <img
                src="2.svg"
                alt="Developer with tablet"
                className="w-full h-auto drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioIQHero;