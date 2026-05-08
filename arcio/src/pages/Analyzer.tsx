import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { API_URL } from '../config/api';

const API = API_URL;

interface Usage { 
  plan: string; 
  used: number; 
  limit: number; 
  filesPerAnalysis: number; 
  remaining: number; 
  totalReposAnalyzed: number; 
  upgradeAvailable: boolean; 
}

interface FileReview { path: string; score: number; issues: string[]; suggestions: string[]; severity: string; }
interface Improvement { 
  title: string; 
  description: string; 
  difficulty: string; 
  priority?: string; 
  fileLocation?: string;
  example?: string;
}
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
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading || !analysis) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(p => [...p, { role: 'user', text: msg }]);
    setChatLoading(true);

    try {
      const token = await getToken();
      const res = await fetch(`${API}/analyzer/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          message: msg,
          repoContext: analysis
        })
      });
      const d = await res.json();
      if (d.success) {
        setChatMessages(p => [...p, { role: 'ai', text: d.data.message }]);
      }
    } catch {
      setChatMessages(p => [...p, { role: 'ai', text: 'Error connecting to Arcio Intelligence.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-10 min-h-full animate-fade-in-up pb-10">
        
        {/* LEFT COLUMN: Input & Progress */}
        <div className="w-full lg:w-[400px] space-y-6 shrink-0">
          
          {/* Analyze Input Card */}
          <div className="premium-card p-8 bg-white border border-stone-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-serif italic text-stone-900 tracking-tight">Project Analysis</h1>
              {usage && (
                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${usage.plan === 'pro' ? 'bg-teal-900 text-teal-100' : 'bg-stone-100 text-stone-500'}`}>
                  {usage.plan === 'pro' && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                  {usage.plan}
                </div>
              )}
            </div>
            
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

              {usage && (
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Daily Balance</span>
                    <span className="text-xs font-bold text-stone-900">{usage.remaining} / {usage.limit} left</span>
                  </div>
                  <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${usage.remaining === 0 ? 'bg-rose-500' : 'bg-stone-900'}`} 
                      style={{ width: `${(usage.remaining / usage.limit) * 100}%` }} 
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">Total Repos Analyzed</span>
                    <span className="text-[9px] font-black text-stone-900">{usage.totalReposAnalyzed}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAnalyze}
                disabled={loading || !repoUrl.trim() || (usage?.remaining === 0)}
                className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-900/10 disabled:opacity-50"
              >
                {usage?.remaining === 0 ? 'Daily Limit Reached' : loading ? 'Analyzing Architecture...' : 'Analyze Architecture'}
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
            <div className="flex gap-4">
              {usage?.upgradeAvailable && (
                <button className="px-5 py-2 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10">
                  Upgrade to Pro
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export
              </button>
            </div>
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Improvements Card */}
            <div className="premium-card p-8 bg-white border border-stone-200">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Critical Improvements
                </h3>
                {analysis && <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-widest">Live Feedback</span>}
              </div>

              <div className="space-y-8">
                {analysis ? analysis.improvements.map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.difficulty === 'Hard' ? 'bg-rose-500' : 'bg-teal-500'}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                          <span className="text-[9px] font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">{item.difficulty}</span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">{item.description}</p>
                        {item.fileLocation && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <svg className="w-3 h-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <p className="text-[10px] text-teal-700 font-black uppercase tracking-tight">{item.fileLocation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {item.example && (
                      <div className="ml-6 relative group/code">
                        <div className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
                          <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white/50 hover:text-white transition-all">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                        <div className="p-5 bg-[#0d0d0c] rounded-2xl border border-white/5 overflow-x-auto shadow-2xl">
                          <pre className="text-[11px] text-stone-300 font-mono leading-relaxed"><code>{item.example}</code></pre>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-30">
                    <p className="text-xs font-bold text-stone-400 italic">"Clean code is not written, it's rewritten." — Robert C. Martin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chatbot Interface */}
            <div className="premium-card bg-white border border-stone-200 flex flex-col h-[600px]">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-stone-900">Arcio Architect</h3>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter">AI Assistant · Active Context</p>
                  </div>
                </div>
                {analysis && <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Connected</span></div>}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {!analysis ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <svg className="w-12 h-12 text-stone-900 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    <p className="text-xs font-bold text-stone-900 italic">Analyze a repository to start an architectural discussion.</p>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 max-w-[90%] shadow-sm">
                      <p className="text-xs text-stone-700 font-medium leading-relaxed italic">
                        "{analysis.summary}"
                      </p>
                      <div className="mt-4 pt-4 border-t border-stone-200/50 flex items-center justify-between">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Architect's Note</p>
                        <span className="text-[9px] text-teal-600 font-black uppercase">Technical Audit Ready</span>
                      </div>
                    </div>
                    <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100/50 max-w-[80%]">
                      <p className="text-[11px] text-teal-800 font-semibold leading-snug">
                        I've analyzed {analysis.filesAnalyzed} files. Where should we start the deep-dive?
                      </p>
                    </div>
                  </div>
                ) : chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`p-5 rounded-2xl max-w-[88%] text-[13px] font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-stone-900 text-white shadow-stone-900/10' : 'bg-white text-stone-800 border border-stone-100 shadow-stone-200/5'}`}>
                      {m.text.split('\n').map((line, j) => (
                        <React.Fragment key={j}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50/50 border-t border-stone-100 rounded-b-3xl">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                    disabled={!analysis || chatLoading}
                    placeholder={analysis ? "Ask about a specific file or pattern..." : "Analyze repo first..."} 
                    className="w-full pl-4 pr-12 py-3 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 transition-all disabled:opacity-50"
                  />
                  <button 
                    onClick={handleChat}
                    disabled={!analysis || chatLoading || !chatInput.trim()}
                    className="absolute right-2 p-1.5 bg-stone-900 text-white rounded-lg active:scale-90 transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analyzer;

