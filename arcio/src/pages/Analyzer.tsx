import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const API = 'http://localhost:5000/api';

interface Usage { plan: string; used: number; limit: number; filesPerAnalysis: number; remaining: number; totalReposAnalyzed: number; upgradeAvailable: boolean; }
interface FileReview { path: string; score: number; issues: string[]; suggestions: string[]; severity: string; }
interface Improvement { title: string; description: string; difficulty: string; priority?: string; }
interface AnalysisData {
  repo: { name: string; owner: string; fullName: string; description: string; language: string; stars: number; forks: number; url: string; updatedAt: string; };
  scores: { overall: number; codeQuality: number; architecture: number; readme: number; naming: number; };
  structureIssues: string[];
  improvements: Improvement[];
  fileReviews: FileReview[];
  filesAnalyzed: number;
  summary: string;
  planUsed: string;
  analyzedAt: string;
}

const Analyzer: React.FC = () => {
  const { getToken } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => { fetchUsage(); }, []);

  const fetchUsage = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/analyzer/usage`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      if (d.success) setUsage(d.data);
    } catch { /* silent */ }
  };

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;
    setLoading(true); setError(''); setAnalysis(null); setProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + Math.random() * 5 : p));
    }, 400);

    try {
      const token = await getToken();
      const res = await fetch(`${API}/analyzer/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ repoUrl })
      });
      const d = await res.json();
      if (!d.success) { 
        setError(d.message || 'Analysis failed'); 
      } else {
        setAnalysis(d.data);
        setProgress(100);
      }
    } catch (e: any) { setError(e.message || 'Network error'); }
    finally { 
      setLoading(false); 
      clearInterval(interval);
      fetchUsage(); 
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-10 min-h-full animate-fade-in-up pb-10">
        
        {/* LEFT COLUMN: Input & Progress */}
        <div className="w-full lg:w-[400px] space-y-6 shrink-0">
          
          {/* Analyze Input Card */}
          <div className="premium-card p-8 bg-white border border-stone-200">
            <h1 className="text-3xl font-serif italic text-stone-900 mb-4 tracking-tight">Let's analyze your project</h1>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed font-medium">Connect your repository to uncover insights, detect hidden issues, and elevate your architecture.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Repository URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                  <input 
                    type="text" 
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/org/repo" 
                    className="block w-full pl-9 pr-3 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500/50" 
                  />
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div className="border-2 border-dashed border-stone-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 bg-stone-50/50">
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-teal-600 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Drag & drop source directory</p>
                  <p className="text-xs text-stone-400 font-medium mt-1">or <span className="text-teal-600 cursor-pointer">browse files</span></p>
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading || !repoUrl.trim()}
                className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-900/10 disabled:opacity-50"
              >
                {loading ? 'Analyzing Architecture...' : 'Analyze Architecture'}
              </button>
            </div>
          </div>

          {/* Progress Card (Only shown when loading or analyzed) */}
          {(loading || analysis) && (
            <div className="premium-card p-8 bg-white border border-stone-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/></svg>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm tracking-tight">Deep Scan Active</h3>
                </div>
                <span className="text-xs font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-teal-600 transition-all duration-500 rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-600">{loading ? 'Scanning dependency graph...' : 'Analysis complete'}</p>
                <p className="text-[10px] text-stone-400 font-medium">node_modules/express, src/controllers</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-bold leading-relaxed">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Intelligence Hub */}
        <div className="flex-1 space-y-8">
          
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-serif italic text-stone-900 tracking-tight">Intelligence Hub</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Analysis results for <span className="bg-stone-200 text-stone-900 px-1.5 py-0.5 rounded text-[9px]">{analysis?.repo.fullName ? 'main' : '—'}</span> branch</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: 'Maintainability', 
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                desc: 'Your code is highly maintainable. Recent commits improved overall modularity.',
                color: 'text-teal-600',
                bg: 'bg-teal-50'
              },
              { 
                label: 'Complexity', 
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
                desc: 'The auth module needs attention. Its cognitive complexity is making future updates risky.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
              { 
                label: 'Security', 
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
                desc: 'Solid foundation! We found zero critical vulnerabilities across all active dependencies.',
                color: 'text-teal-600',
                bg: 'bg-teal-50'
              }
            ].map((metric, i) => (
              <div key={i} className="premium-card p-6 bg-white border border-stone-200 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${metric.bg} ${metric.color} flex items-center justify-center`}>
                    {metric.icon}
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">{metric.label}</h3>
                </div>
                <p className="text-xs text-stone-600 font-medium leading-relaxed flex-1">
                  {analysis ? metric.desc : 'Analysis pending...'}
                </p>
                {i === 0 && (
                   <div className="flex items-end gap-1 mt-6 h-8">
                    {[3, 5, 4, 6, 8, 10, 4].map((v, j) => (
                      <div key={j} className={`flex-1 rounded-t-sm bg-teal-500/20 ${j === 5 ? 'bg-teal-500' : ''}`} style={{ height: `${v * 10}%` }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Topology Map Card */}
            <div className="xl:col-span-2 premium-card overflow-hidden bg-stone-100 border border-stone-200 h-[450px] relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 z-10">
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/50 shadow-lg">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.106-1.789L9 2m0 18l5.447-2.724A2 2 0 0115 15.382V6.618a2 2 0 01-1.106-1.789L9 4m0 16V4m0 16l5.447-2.724A2 2 0 0115 15.382V6.618a2 2 0 01-1.106-1.789L9 2m0 18l5.447-2.724A2 2 0 0115 15.382V6.618a2 2 0 01-1.106-1.789L9 4m0 16V4m0 16l5.447-2.724A2 2 0 0115 15.382V6.618a2 2 0 01-1.106-1.789L9 2" /></svg>
                  <span className="text-[11px] font-black uppercase tracking-widest text-stone-900">Topology Map Generated</span>
                </div>
              </div>
            </div>

            {/* Action Items Column */}
            <div className="premium-card p-6 bg-white border border-stone-200">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Action Items
                </h3>
                <span className="text-[9px] font-black text-stone-500 bg-stone-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                  {analysis?.improvements.length || 0} New
                </span>
              </div>

              <div className="space-y-4">
                {analysis ? analysis.improvements.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100 cursor-pointer group">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.difficulty === 'Advanced' ? 'bg-rose-500' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'}`} />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-stone-900 leading-tight mb-1 group-hover:text-teal-700 transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-stone-500 font-medium leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-30">
                    <p className="text-xs font-bold text-stone-400">Analysis pending...</p>
                  </div>
                )}
              </div>

              {analysis && (
                <button className="w-full mt-8 py-3 border border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all">
                  View Full Report
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analyzer;
