import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    label: "STEP 01 · CONNECT",
    title: "Paste your repo.",
    description:
      "Drop a public GitHub URL. Our AI scans architecture, code quality, naming conventions, and README completeness in seconds.",
    tags: ["Code quality", "Architecture", "README score"],
    icon: (
      <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    number: "02",
    label: "STEP 02 · DISCOVER",
    title: "Get ideas that matter.",
    description:
      "Non-generic project ideas tailored to your stack, experience level, and target role — refreshed weekly with market demand.",
    tags: ["Stack-aware", "Role-matched", "Refreshed weekly"],
    icon: (
      <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    number: "03",
    label: "STEP 03 · IMPROVE",
    title: "Track progress.",
    description:
      "Score history, percentile rank, and a personalised improvement roadmap — so every week you're measurably better.",
    tags: ["Score history", "Percentile rank", "Roadmap"],
    icon: (
      <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const gridStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #D4CFC7 1px, transparent 1px), linear-gradient(to bottom, #D4CFC7 1px, transparent 1px)",
  backgroundSize: "80px 80px",
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" },
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="relative bg-[#Fafaf8] py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={gridStyle} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[11px] font-bold tracking-[0.25em] text-stone-400 uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
            Three moves.{" "}
            <span className="font-serif italic font-normal text-teal-700">
              One sharper portfolio.
            </span>
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 z-0" />

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-24 items-center"
              >
       
                <div className={`${i % 2 === 1 ? "lg:order-2" : ""} relative`}>
                  <div
                    className={`hidden lg:flex absolute ${i % 2 === 0 ? "-right-10" : "-left-10"} top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 ${
                      activeStep === i ? "bg-teal-600 border-teal-600 shadow-lg shadow-teal-200" : "bg-stone-200 border-stone-300"
                    }`}
                  />

                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest mb-5 transition-all duration-300 ${
                    activeStep === i ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-stone-100 border-stone-200 text-stone-400"
                  }`}>
                    {step.label}
                  </div>

                  <h3 className={`text-4xl font-bold tracking-tight mb-4 transition-colors duration-300 ${
                    activeStep === i ? "text-stone-900" : "text-stone-400"
                  }`}>
                    {step.title}
                  </h3>

                  <p className={`text-[15px] leading-relaxed mb-6 transition-colors duration-300 ${
                    activeStep === i ? "text-stone-500" : "text-stone-300"
                  }`}>
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span key={tag} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all duration-300 ${
                        activeStep === i ? "bg-white border-stone-200 text-stone-700" : "bg-transparent border-stone-100 text-stone-300"
                      }`}>
                        <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div
                    className={`relative overflow-hidden rounded-xl border bg-stone-100 transition-all duration-700 ${
                      activeStep === i
                        ? "border-stone-300 shadow-2xl shadow-stone-200/50 scale-105"
                        : "border-stone-200 opacity-40 grayscale"
                    }`}
                  >
               
                    <div className="aspect-[16/10] w-full relative">
                      <img 
                        src={`step${i + 1}.png`} 
                        alt={step.title}
                        className="w-full h-full object-cover object-top" 
                      />
                      
                                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;