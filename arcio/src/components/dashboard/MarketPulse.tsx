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
    <div className="flex flex-col h-full font-sans">
      
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-serif italic text-stone-900 tracking-tight mb-2">Developer Market</h1>
          <p className="text-stone-500 text-sm">Real-time intelligence on skill demand and ecosystem trends.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-stone-200 rounded text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors">
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Trailing 7 Days
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
          <div className="flex-1">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-xl font-serif italic text-stone-900">Skill Demand This Week</h2>
            <p className="text-[11px] text-stone-500 font-medium uppercase tracking-widest">Aggregated from 140k+ requisitions</p>
          </div>

          <div className="border-t border-stone-200">
            {skills.map((skill) => (
              <div 
                key={skill.rank} 
                className={`flex items-center justify-between py-4 border-b border-stone-100 ${skill.isActive ? 'bg-[#F2F8F7]' : ''}`}
              >
                              <div className="flex items-center w-1/3">
                  <span className="w-8 text-stone-400 text-sm font-medium">{skill.rank}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-serif italic text-stone-900">{skill.name}</span>
                      {skill.isSurging && (
                        <span className="px-1.5 py-0.5 rounded bg-teal-800 text-white text-[9px] font-bold tracking-widest uppercase">
                          Surging
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-1/6">
                  <span className="text-sm font-semibold text-stone-900">{skill.roles}</span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">Open Roles</span>
                </div>

                <div className="flex flex-col w-1/6">
                  <span className="text-sm font-mono font-semibold text-stone-700">{skill.salary}</span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">Avg Base</span>
                </div>

                <div className="w-24 flex justify-center">
                  <TrendLine data={skill.trend} isUp={skill.isUp} />
                </div>

                <div className="w-20 flex justify-end">
                  <div className={`px-2 py-1 rounded text-[11px] font-bold ${skill.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                    {skill.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      
        <div className="w-full lg:w-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif italic text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Market Pulse
            </h2>
          </div>

          <div className="relative border-l border-stone-200 ml-2 space-y-8 pb-4">
            
            <div className="relative pl-5">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-600 ring-4 ring-white" />
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700">High Urgency</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed font-medium mb-3">
                Senior Rust Engineer openings spiked by 15% in San Francisco over the last 48 hours.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-stone-50 text-stone-600 text-[10px] border border-stone-200 rounded">Enterprise</span>
                <span className="px-2 py-1 bg-stone-50 text-stone-600 text-[10px] border border-stone-200 rounded">$180k+</span>
              </div>
            </div>

            <div className="relative pl-5">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-stone-300 ring-4 ring-white" />
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Trend Shift</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                New contract volume for React Native developers decreased slightly, favoring native Swift/Kotlin roles.
              </p>
            </div>

            <div className="relative pl-5">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-stone-300 ring-4 ring-white" />
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Ecosystem Note</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Enterprise demand for Kubernetes expertise remains dominant in cloud infrastructure roles.
              </p>
            </div>

          </div>

          <button className="w-full py-2.5 mt-2 bg-white border border-stone-200 text-stone-600 text-xs font-semibold rounded hover:bg-stone-50 transition-colors">
            Load historical signals
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
