import React from 'react';

const TrendLine = ({ data, isUp }: { data: number[], isUp: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' L ');

  const color = isUp ? '#059669' : '#e11d48'; 

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path 
        d={`M ${points}`} 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

const MarketPulse: React.FC = () => {
  const skills = [
    { rank: 1, name: 'JavaScript / TypeScript', share: '92%', roles: '14,203', salary: '$145k', change: '+2.4%', isUp: true, trend: [80, 82, 85, 84, 88, 90, 92] },
    { rank: 2, name: 'Python', share: '85%', roles: '11,840', salary: '$152k', change: '+5.1%', isUp: true, trend: [70, 75, 74, 78, 80, 82, 85] },
    { rank: 3, name: 'Rust', share: '42%', roles: '3,410', salary: '$180k', change: '+42.0%', isUp: true, isSurging: true, isActive: true, trend: [20, 25, 28, 30, 35, 38, 42] },
    { rank: 4, name: 'Go', share: '38%', roles: '6,102', salary: '$165k', change: '+12.3%', isUp: true, trend: [30, 32, 33, 35, 36, 37, 38] },
    { rank: 5, name: 'Java', share: '65%', roles: '22,050', salary: '$135k', change: '-1.2%', isUp: false, trend: [68, 67, 66, 67, 65, 66, 65] },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <div className="flex justify-between items-end mb-12 pb-8 border-b border-stone-200/60">
        <div>
          <h1 className="text-5xl font-serif italic text-stone-900 tracking-tight mb-3">Market Intelligence</h1>
          <p className="text-stone-500 text-sm max-w-md">Real-time telemetry on global skill demand, ecosystem health, and compensation benchmarks.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-all shadow-sm">
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Trailing 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-900 transition-all shadow-lg shadow-stone-900/10">
            Export Report
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-16">
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-2xl font-serif italic text-stone-900">Ecosystem Demand</h2>
            <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">Aggregated from 140k+ global requisitions</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-100">
              <span className="w-8">Rank</span>
              <span className="w-1/3">Technology Stack</span>
              <span className="w-1/6">Open Roles</span>
              <span className="w-1/6">Avg Base</span>
              <span className="w-24 text-center">Trend</span>
              <span className="w-20 text-right">Delta</span>
            </div>
            {skills.map((skill) => (
              <div 
                key={skill.rank} 
                className={`flex items-center justify-between py-6 px-4 rounded-2xl transition-all border border-transparent ${skill.isActive ? 'bg-teal-50/30 border-teal-100/50' : ''}`}
              >
                <div className="flex items-center w-1/3">
                  <span className="w-8 text-stone-300 text-sm font-black italic">{skill.rank}</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-serif italic text-stone-900 group-hover:text-teal-900 transition-colors">{skill.name}</span>
                      {skill.isSurging && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-950 text-white text-[8px] font-black tracking-[0.1em] uppercase shadow-lg shadow-stone-900/20">
                          Surging
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-1/6">
                  <span className="text-sm font-bold text-stone-900 tracking-tight">{skill.roles}</span>
                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-black">Active Req</span>
                </div>

                <div className="flex flex-col w-1/6">
                  <span className="text-sm font-bold text-stone-900 tracking-tight">{skill.salary}</span>
                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-black">Market Median</span>
                </div>

                <div className="w-24 flex justify-center scale-110">
                  <TrendLine data={skill.trend} isUp={skill.isUp} />
                </div>

                <div className="w-20 flex justify-end">
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${skill.isUp ? 'text-teal-700 bg-teal-50 border border-teal-100' : 'text-rose-700 bg-rose-50 border border-rose-100'}`}>
                    {skill.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full xl:w-[380px] space-y-8">
          <div>
            <h2 className="text-2xl font-serif italic text-stone-900 flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-600 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
              Pulse Signals
            </h2>

            <div className="relative border-l-2 border-stone-100 ml-2 space-y-10 pb-6">
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-teal-600 shadow-sm" />
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">Urgent Signal</span>
                </div>
                <p className="text-sm text-stone-800 leading-relaxed font-medium mb-4">
                  Senior Rust Engineer openings spiked by 15% in San Francisco over the last 48 hours. Enterprise demand is decoupling from startup cycles.
                </p>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-stone-50 text-stone-500 text-[9px] font-bold uppercase tracking-widest border border-stone-200/60 rounded-md">Enterprise</span>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-[9px] font-bold uppercase tracking-widest border border-teal-100 rounded-md">$180k+ Target</span>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-stone-200 shadow-sm" />
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Trend Shift</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  New contract volume for React Native developers decreased slightly, favoring native Swift/Kotlin roles as performance requirements tighten.
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-stone-200 shadow-sm" />
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Ecosystem Note</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Kubernetes dominance in cloud infrastructure roles persists, with a 12% MoM increase in "Platform Engineer" requisitions.
                </p>
              </div>
            </div>
          </div>

          <div className="premium-card p-6 bg-stone-900 text-white relative overflow-hidden group">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 w-24 h-24 bg-teal-500 rounded-full blur-3xl opacity-20 transition-opacity" />
            <h3 className="text-lg font-bold mb-2 relative z-10">Premium Insights</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6 relative z-10">Get deep-tier hiring data and direct recruiter contact points for high-urgency roles.</p>
            <button className="w-full py-3 bg-white text-stone-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-100 transition-all shadow-lg shadow-white/5 relative z-10">
              Upgrade to Intelligence Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
