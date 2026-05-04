import React, { useState, useEffect, useRef } from 'react';
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

const TypewriterMessage = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    // Faster typing for a professional feel
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      <span className="whitespace-pre-wrap leading-relaxed">{displayedText}</span>
      {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 bg-stone-400 animate-pulse align-middle" />}
    </>
  );
};

const Analyzer: React.FC = () => {
  const { getToken } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState<{role:string;text:string;time:string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview'|'files'|'improvements'>('overview');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchUsage(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

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
    setLoading(true); setError(''); setAnalysis(null); setChatMessages([]);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/analyzer/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ repoUrl })
      });
      const d = await res.json();
      if (!d.success) { setError(d.message || 'Analysis failed'); if (d.data?.upgradeAvailable) setError(prev => prev + ' Upgrade to Pro for more analyses!'); }
      else {
        setAnalysis(d.data);
        if (d.usage) setUsage(prev => prev ? { ...prev, used: d.usage.used, remaining: prev.limit - d.usage.used } : prev);
        setChatMessages([{ role: 'ai', text: `Analyzed ${d.data.repo.fullName} — ${d.data.scores.overall}/100 overall. ${d.data.summary?.slice(0, 200)}... Want me to dive into any specific issue?`, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
      }
    } catch (e: any) { setError(e.message || 'Network error'); }
    finally { setLoading(false); fetchUsage(); }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput; setChatInput('');
    setChatMessages(p => [...p, { role: 'user', text: msg, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    setChatLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/analyzer/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg, repoContext: analysis })
      });
      const d = await res.json();
      if (d.success) setChatMessages(p => [...p, { role: 'ai', text: d.data.message, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    } catch { setChatMessages(p => [...p, { role: 'ai', text: 'Sorry, something went wrong.', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]); }
    finally { setChatLoading(false); }
  };

  const getScoreColor = (s: number) => s >= 80 ? 'text-teal-700' : s >= 60 ? 'text-amber-600' : 'text-red-600';
  const getScoreBg = (s: number) => s >= 80 ? 'bg-teal-50' : s >= 60 ? 'bg-amber-50' : 'bg-red-50';
  const getSeverityColor = (s: string) => s === 'good' ? 'bg-teal-50 text-teal-700 border-teal-200' : s === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200';
  const getDifficultyColor = (d: string) => d === 'Quick Fix' ? 'bg-teal-50 text-teal-700' : d === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)] animate-fade-in-up">
        {/* LEFT: Chat Panel */}
        <div className="w-full lg:w-[400px] h-full flex flex-col bg-white rounded-2xl overflow-hidden pr-4 border-r border-stone-100">
          <div className="flex justify-between items-center pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Arcio AI</h3>
                <p className="text-[10px] text-teal-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Online & ready</p>
              </div>
            </div>
            {usage && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{usage.plan}</p>
                <p className="text-xs font-semibold text-stone-600">{usage.remaining}/{usage.limit} left</p>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-60">
                <svg className="w-12 h-12 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-stone-500 text-xs">Paste a GitHub URL above and hit Analyze to start a conversation about your code.</p>
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-1 mb-2`}>
                <div className={`
                  p-4 rounded-2xl max-w-[90%] shadow-sm text-[13px]
                  ${m.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-sm' 
                    : 'bg-white border border-stone-100 text-stone-700 rounded-tl-sm'}
                `}>
                  {m.role === 'ai' ? <TypewriterMessage text={m.text} /> : <span className="whitespace-pre-wrap leading-relaxed">{m.text}</span>}
                </div>
                <span className="text-[10px] text-stone-400 font-medium mx-1">{m.time}</span>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-1.5 ml-2 mt-2 p-4 bg-white border border-stone-100 shadow-sm rounded-2xl rounded-tl-sm max-w-[90%] w-fit">
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="pt-4 border-t border-stone-100 mt-auto pb-2">
            <div className="relative">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Ask anything about your repo..." className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-300" disabled={!analysis} />
              <button onClick={handleChat} disabled={!analysis || chatLoading} className="absolute right-1 top-1 bottom-1 w-10 bg-teal-800 hover:bg-teal-900 rounded-md flex items-center justify-center transition-colors disabled:opacity-40">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Analysis Panel */}
        <div className="flex-1 overflow-y-auto pl-4">
          {/* Search Bar + Usage Banner */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative w-full flex items-center bg-stone-50 rounded-md border border-stone-200 px-3 py-2">
              <svg className="w-4 h-4 text-stone-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              <input type="text" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnalyze()} placeholder="https://github.com/username/repo" className="flex-1 bg-transparent text-sm text-stone-600 font-medium outline-none placeholder-stone-400" />
              <button onClick={handleAnalyze} disabled={loading || !repoUrl.trim()} className="ml-auto px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded shrink-0 transition-colors disabled:opacity-50">
                {loading ? <span className="flex items-center gap-2"><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/></svg>Analyzing...</span> : 'Analyze ▾'}
              </button>
            </div>

            {/* Usage Bar */}
            {usage && (
              <div className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${usage.plan === 'pro' ? 'bg-teal-100 text-teal-800' : 'bg-stone-200 text-stone-600'}`}>{usage.plan}</div>
                  <span className="text-xs text-stone-500">{usage.used}/{usage.limit} analyses today • {usage.filesPerAnalysis} files/scan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: usage.limit }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < usage.used ? 'bg-teal-600' : 'bg-stone-200'}`} />
                    ))}
                  </div>
                  {usage.upgradeAvailable && <button className="text-[10px] font-bold text-teal-700 hover:text-teal-900 underline underline-offset-2">Upgrade to Pro</button>}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <div><p className="font-semibold">Analysis limit reached</p><p className="mt-1">{error}</p></div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="flex justify-between"><div className="h-8 w-48 bg-stone-200 rounded" /><div className="h-12 w-24 bg-stone-200 rounded" /></div>
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-stone-100 rounded-xl" />)}</div>
              <div className="h-6 w-40 bg-stone-200 rounded" />
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-stone-100 rounded-xl" />)}</div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !analysis && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">Paste a GitHub URL to begin</h3>
              <p className="text-sm text-stone-500 max-w-sm">We'll scan the entire repo structure, deep-analyze {usage?.filesPerAnalysis || 5} key files, and give you actionable feedback.</p>
              <div className="flex gap-6 mt-6 text-xs text-stone-400">
                <div className="flex flex-col items-center gap-1"><span className="text-2xl font-bold text-stone-300">{usage?.filesPerAnalysis || 5}</span>Files analyzed</div>
                <div className="flex flex-col items-center gap-1"><span className="text-2xl font-bold text-stone-300">{usage?.remaining ?? 2}</span>Analyses left</div>
                <div className="flex flex-col items-center gap-1"><span className="text-2xl font-bold text-stone-300">AI</span>Code review</div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && !loading && (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    <h1 className="text-3xl font-bold text-stone-900 tracking-tight">{analysis.repo.name}</h1>
                  </div>
                  <p className="text-xs text-stone-500 font-medium ml-7 flex items-center gap-1.5">
                    {analysis.repo.language} <span className="text-stone-300">•</span> <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> {analysis.repo.stars} <span className="text-stone-300">•</span> {analysis.filesAnalyzed} files analyzed ({analysis.planUsed})
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-black tracking-tighter ${getScoreColor(analysis.scores.overall)}`}>
                    {analysis.scores.overall}<span className="text-xl text-stone-400 font-bold">/100</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${getScoreColor(analysis.scores.overall)}`}>
                    {analysis.scores.overall >= 80 ? 'Great' : analysis.scores.overall >= 60 ? 'Good' : 'Needs Work'}
                  </p>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="flex gap-1 mb-6 bg-stone-100 rounded-lg p-1">
                {(['overview','files','improvements'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-4 py-2 text-xs font-semibold rounded-md transition-all capitalize ${activeTab === tab ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
                    {tab === 'files' ? `Files (${analysis.fileReviews.length})` : tab === 'improvements' ? `Fixes (${analysis.improvements.length})` : 'Overview'}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Score Cards */}
                  {[
                    { label: 'Code Quality', score: analysis.scores.codeQuality, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
                    { label: 'Architecture', score: analysis.scores.architecture, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
                    { label: 'README', score: analysis.scores.readme, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
                    { label: 'Naming', score: analysis.scores.naming, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-stone-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getScoreBg(stat.score)} ${getScoreColor(stat.score)}`}>{stat.icon}</div>
                        <div>
                          <h3 className="font-semibold text-stone-900 text-sm">{stat.label}</h3>
                          <div className="w-32 h-1.5 bg-stone-100 rounded-full mt-1.5">
                            <div className={`h-full rounded-full transition-all duration-700 ${stat.score >= 80 ? 'bg-teal-500' : stat.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${stat.score}%` }} />
                          </div>
                        </div>
                      </div>
                      <span className={`text-xl font-bold ${getScoreColor(stat.score)}`}>{stat.score}</span>
                    </div>
                  ))}

                  {/* Structure Issues */}
                  {analysis.structureIssues.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-sm font-bold text-stone-900 mb-3">Structure Issues</h2>
                      <div className="space-y-2">
                        {analysis.structureIssues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                            <svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span className="leading-relaxed">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {analysis.summary && (
                    <div className="mt-6 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                      <h2 className="text-sm font-bold text-stone-900 mb-2">AI Summary</h2>
                      <p className="text-xs text-stone-600 leading-relaxed">{analysis.summary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Files Tab */}
              {activeTab === 'files' && (
                <div className="space-y-3">
                  {analysis.fileReviews.length === 0 ? (
                    <p className="text-sm text-stone-500 py-8 text-center">No file reviews available.</p>
                  ) : analysis.fileReviews.map((file, i) => (
                    <details key={i} className="group border border-stone-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                      <summary className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${file.severity === 'good' ? 'bg-teal-500' : file.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <span className="text-sm font-mono font-medium text-stone-800">{file.path}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getSeverityColor(file.severity)}`}>{file.severity}</span>
                        </div>
                        <span className={`text-lg font-bold ${getScoreColor(file.score)}`}>{file.score}</span>
                      </summary>
                      <div className="px-4 pb-4 bg-stone-50 border-t border-stone-100">
                        {file.issues.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">Issues</p>
                            {file.issues.map((issue, j) => <p key={j} className="text-xs text-stone-600 py-1 flex gap-2"><span className="text-red-400 shrink-0">✗</span>{issue}</p>)}
                          </div>
                        )}
                        {file.suggestions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-2">Suggestions</p>
                            {file.suggestions.map((s, j) => <p key={j} className="text-xs text-stone-600 py-1 flex gap-2"><span className="text-teal-500 shrink-0">→</span>{s}</p>)}
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {/* Improvements Tab */}
              {activeTab === 'improvements' && (
                <div className="space-y-3">
                  {analysis.improvements.map((task, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white border border-stone-200 rounded-xl hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center text-sm font-bold text-stone-500">{i + 1}</div>
                        <div>
                          <h4 className="font-semibold text-stone-900 text-sm">{task.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5 max-w-md">{task.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getDifficultyColor(task.difficulty)}`}>{task.difficulty}</span>
                            {task.priority && <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{task.priority}</span>}
                          </div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analyzer;
