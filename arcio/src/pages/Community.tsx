import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const Community: React.FC = () => {
  const leaderboard = [
    { rank: 1, name: 'Alex M.', stack: 'React + TS', arch: 99, code: 98, total: 98.5 },
    { rank: 2, name: 'Sarah K.', stack: 'Vue + Nuxt', arch: 97, code: 98, total: 97.5 },
    { rank: 3, name: 'David L.', stack: 'Next.js', arch: 96, code: 95, total: 95.5 },
    { rank: 11, name: 'Jason T.', stack: 'React + JS', arch: 90, code: 89, total: 89.5 },
    { rank: 12, name: 'You', stack: 'React + TS', isCurrentUser: true, arch: 84, code: 92, total: 88.0 },
    { rank: 13, name: 'Priya R.', stack: 'Angular', arch: 86, code: 87, total: 86.5 },
    { rank: 14, name: 'Marcus J.', stack: 'SvelteKit', arch: 85, code: 86, total: 85.5 },
  ];

  const analysis = [
    { metric: 'Architecture', you: 84, top: 97, gap: '-13 pts' },
    { metric: 'Code Quality', you: 92, top: 98, gap: '-6 pts' },
    { metric: 'Performance', you: 88, top: 95, gap: '-7 pts' },
    { metric: 'Security', you: 94, top: 96, gap: '-2 pts' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full font-sans animate-fade-in-up pb-12">
        
        <div className="flex justify-between items-end mb-10 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif italic text-stone-900 tracking-tight mb-2">Global Rankings</h1>
            <p className="text-stone-500 text-sm">Competitive benchmarking against the top engineers on Arcio.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Cohort:</span>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-stone-200 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors">
              Frontend Engineers (Global)
              <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
                    <div className="flex-1">
             <div className="flex justify-between items-baseline mb-6">
              <h2 className="text-xl font-serif italic text-stone-900">Leaderboard</h2>
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-widest">Updated 5m ago</span>
            </div>

            <div className="border border-stone-200 rounded-sm overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200">
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest w-16 text-center">Rank</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Developer</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stack</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Arch Score</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Code Score</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-900 uppercase tracking-widest text-right bg-stone-100/50">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {leaderboard.map((user, idx) => (
                    <React.Fragment key={idx}>
                      {idx === 3 && (
                        <tr>
                          <td colSpan={6} className="py-2 bg-stone-50/50 border-y border-stone-100 text-center">
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">... 7 positions ...</span>
                          </td>
                        </tr>
                      )}
                      <tr className={`${user.isCurrentUser ? 'bg-stone-50' : 'hover:bg-stone-50/50'} transition-colors relative`}>
                        {user.isCurrentUser && <td className="absolute left-0 top-0 bottom-0 w-1 bg-stone-900" />}
                        
                        <td className="py-3 px-6 text-center">
                          <span className={`text-xs font-bold ${user.rank <= 3 ? 'text-stone-900' : 'text-stone-500'}`}>
                            {user.rank}
                          </span>
                        </td>
                        
                        <td className="py-3 px-6">
                          <span className={`text-sm ${user.isCurrentUser ? 'font-bold text-stone-900' : 'font-medium text-stone-700'}`}>
                            {user.name}
                          </span>
                        </td>
                        
                        <td className="py-3 px-6">
                          <span className="text-xs text-stone-500 font-mono">
                            {user.stack}
                          </span>
                        </td>

                        <td className="py-3 px-6 text-right">
                          <span className="text-sm font-semibold text-stone-600">{user.arch}</span>
                        </td>

                        <td className="py-3 px-6 text-right">
                          <span className="text-sm font-semibold text-stone-600">{user.code}</span>
                        </td>
                        
                        <td className="py-3 px-6 text-right bg-stone-50/30">
                          <span className={`text-lg font-mono font-bold ${user.isCurrentUser ? 'text-stone-900' : 'text-stone-800'}`}>
                            {user.total.toFixed(1)}
                          </span>
                        </td>
                        
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

              <div className="w-full lg:w-[350px] shrink-0">
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="text-xl font-serif italic text-stone-900">Competitive Analysis</h2>
            </div>
            
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              This compares your current repository metrics against the average scores of developers in the Top 1%.
            </p>

            <div className="border-t border-stone-200">
              {analysis.map((item, i) => (
                <div key={i} className="py-4 border-b border-stone-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-stone-900">{item.metric}</span>
                    <span className="text-xs font-bold text-rose-600">{item.gap}</span>
                  </div>
                
                  <div className="w-full h-1.5 flex bg-stone-100 overflow-hidden mb-2">
                    <div className="bg-stone-800 h-full" style={{ width: `${item.you}%` }} />
                    <div className="bg-stone-300 h-full border-l border-white" style={{ width: `${item.top - item.you}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-stone-500">You: <span className="text-stone-900">{item.you}</span></span>
                    <span className="text-stone-500">Top 1%: <span className="text-stone-900">{item.top}</span></span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 mt-6 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-stone-800 transition-colors">
              Generate Improvement Plan
            </button>

          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
