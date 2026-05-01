import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const Analyzer: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)] animate-fade-in-up">
        
        <div className="w-full lg:w-[400px] h-full flex flex-col bg-white rounded-2xl overflow-hidden pr-4 border-r border-stone-100">
          
          <div className="flex justify-between items-center pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Arcio AI</h3>
                <p className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Online & ready
                </p>
              </div>
            </div>
            <button className="text-stone-400 hover:text-stone-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-6 text-sm">
            <div className="flex flex-col gap-1">
              <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-stone-600 max-w-[90%] relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
                Alright, went through your repo — 78/100 overall. Structure looks clean honestly, but there are two things worth fixing before you show this to anyone. Want to start with the worst one?
              </div>
              <span className="text-[10px] text-stone-400 font-medium ml-2">10:42 AM</span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl rounded-tr-none text-stone-700 max-w-[80%] relative">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-2xl" />
                Yes, let's start with code quality.
              </div>
              <span className="text-[10px] text-stone-400 font-medium mr-2">10:43 AM</span>
            </div>
          </div>
          <div className="pt-4 border-t border-stone-100 mt-auto pb-2">
            <div className="relative">
              <input type="text" placeholder="Ask anything about your repo..." className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-300" />
              <button className="absolute right-1 top-1 bottom-1 w-10 bg-teal-800 hover:bg-teal-900 rounded-md flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pl-4">
          
          <div className="flex justify-between items-center mb-10">
            <div className="relative w-full max-w-sm flex items-center bg-stone-50 rounded-md border border-stone-200 px-3 py-2">
              <svg className="w-4 h-4 text-stone-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              <span className="text-sm text-stone-600 font-medium truncate">github.com/alex/react-app</span>
              
              <button className="ml-auto px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded shrink-0 transition-colors">
                Analyze ▾
              </button>
            </div>
          </div>

          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <h1 className="text-3xl font-bold text-stone-900 tracking-tight">react-app</h1>
              </div>
              <p className="text-xs text-stone-500 font-medium ml-7">Branch: main • Last updated 2m ago</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-stone-900 tracking-tighter">
                78<span className="text-xl text-stone-400 font-bold">/100</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mt-1">Good Status</p>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            {[
              { label: 'Code quality', desc: 'Excellent modularity and clean functions.', score: 92, icon: 'bg-teal-50 text-teal-700' },
              { label: 'Architecture', desc: 'Solid foundations, minor coupling issues.', score: 84, icon: 'bg-stone-100 text-stone-600' },
              { label: 'Readme', desc: 'Needs better setup instructions.', score: 72, icon: 'bg-orange-50 text-orange-600' },
              { label: 'Naming', desc: 'Variables are descriptive and clear.', score: 88, icon: 'bg-stone-100 text-stone-600' }
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.icon}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">{stat.label}</h3>
                    <p className="text-xs text-stone-500">{stat.desc}</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-stone-900">{stat.score}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-900 mb-4">Key improvements</h2>
            <div className="space-y-3">
              {[
                { title: 'Reduce prop drilling', tags: ['Medium effort', 'Refactor'] },
                { title: 'Add jsdoc comments', tags: ['Quick fix'] },
                { title: 'Optimize bundle size', tags: ['High effort', 'Config'] },
              ].map((task, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white border border-stone-200 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center">
                       <svg className="w-4 h-4 text-stone-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">{task.title}</h4>
                      <div className="flex gap-2 mt-1">
                        {task.tags.map(t => <span key={t} className="text-[10px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analyzer;
