import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { API_URL } from '../config/api';

const API = API_URL;

interface Idea {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  timeToComplete: string;
  stack: string[];
  skillsTaught: string[];
  features?: string[];
  demandScore?: number;
}

const TypewriterMessage = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
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
      {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 bg-teal-500 animate-pulse align-middle" />}
    </>
  );
};

const IdeaEngine: React.FC = () => {
  const { getToken } = useAuth();
  const location = useLocation();
  const [view, setView] = useState<'discovery' | 'workshop'>('discovery');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  
  const [activeBuilds, setActiveBuilds] = useState<Idea[]>([]);
  const [currentBuildIndex, setCurrentBuildIndex] = useState(0);

  const [chatMessages, setChatMessages] = useState<{role:string;text:string;time:string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [stackFilter, setStackFilter] = useState('All Technologies');
  const [diffFilter, setDiffFilter] = useState('Any Level');
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const skillParam = query.get('skill');
    const searchParam = query.get('q');
    
    if (skillParam) {
      setStackFilter(skillParam);
    }
    fetchIdeas(searchParam || '');
  }, [location.search]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchIdeas = async (searchQuery = '') => {
    try {
      const token = await getToken();
      const url = new URL(`${API}/ideas`);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const enrichedIdeas = data.data.map((idea: any) => ({
          ...idea,
          features: idea.features || ['Modular Architecture', 'Scalable Backend', 'Clean Patterns'],
          demandScore: idea.demandScore || Math.floor(Math.random() * 40) + 60 // Mock demand for trending sort
        }));
        setIdeas(enrichedIdeas);
      } else {
        setIdeas([]);
      }
    } catch (e) {
      console.error(e);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    if (!activeBuilds.find(b => b._id === idea._id)) {
      setActiveBuilds(p => [...p, idea]);
    }
    setCurrentBuildIndex(activeBuilds.length);
    setView('workshop');
    setChatMessages([
      {
        role: 'ai',
        text: `All current dependencies resolved. Blueprint syntax for "${idea.title}" is valid. How would you like to proceed with the architecture?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading || !selectedIdea) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(p => [...p, { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatLoading(true);

    try {
      const token = await getToken();
      const res = await fetch(`${API}/ideas/builder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          ideaId: selectedIdea._id, 
          message: msg,
          chatHistory: chatMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });
      const d = await res.json();
      if (d.success) {
        setChatMessages(p => [...p, { role: 'ai', text: d.data.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch {
      setChatMessages(p => [...p, { role: 'ai', text: 'Sorry, the architectural core encountered an error.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setChatLoading(false);
    }
  };

  const filteredIdeas = (ideas || [])
    .filter(idea => {
      const stackMatch = stackFilter === 'All Technologies' || (idea.stack || []).some(s => s.toLowerCase() === stackFilter.toLowerCase()) || (idea.skillsTaught || []).some(s => s.toLowerCase() === stackFilter.toLowerCase());
      const diffMatch = diffFilter === 'Any Level' || idea.difficulty === diffFilter;
      return stackMatch && diffMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') return (b.demandScore || 0) - (a.demandScore || 0);
      return 0; // Default sort
    });

  if (view === 'workshop' && selectedIdea) {
    return (
      <DashboardLayout>
        <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-in-up">
          <div className="flex items-center gap-1 px-6 pt-4 border-b border-stone-200">
            {activeBuilds.map((build, idx) => (
              <button 
                key={build._id} 
                onClick={() => {
                  setSelectedIdea(build);
                  setCurrentBuildIndex(idx);
                }}
                className={`px-6 py-2 text-xs font-bold transition-all border-b-2 ${currentBuildIndex === idx ? 'border-teal-500 text-stone-900 bg-teal-500/5' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
              >
                {build.title}
              </button>
            ))}
            <button 
              onClick={() => setView('discovery')}
              className="ml-4 p-1.5 rounded-lg bg-stone-200/40 text-stone-500 hover:text-stone-900 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
            {chatMessages.map((m, i) => (
              <div key={i} className="flex gap-6 max-w-4xl mx-auto items-start">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                  {m.role === 'ai' ? (
                    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-teal-500 flex items-center justify-center text-[10px] font-black text-stone-900 uppercase tracking-tighter">YOU</div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                      {m.role === 'ai' ? 'BUILDER AI · SYSTEM' : 'DEVELOPER · COMMAND'}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500">{m.time}</span>
                  </div>
                  <div className="text-sm leading-relaxed text-stone-700 font-medium">
                    {m.role === 'ai' ? <TypewriterMessage text={m.text} /> : m.text}
                  </div>
                  {m.role === 'ai' && i === chatMessages.length - 1 && !chatLoading && (
                    <div className="flex gap-3 pt-2">
                       <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold text-stone-500 hover:bg-white hover:text-stone-900 transition-all">
                        <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Apply Structural Fix
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="max-w-4xl mx-auto flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1 pt-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Builder AI generating...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="relative flex items-center bg-white border border-stone-200 rounded-2xl p-2 focus-within:border-teal-500/50 transition-all shadow-2xl">
              <div className="w-10 h-10 flex items-center justify-center text-stone-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Ask Builder AI to modify the architecture..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-stone-900 placeholder-slate-600 py-3"
              />
              <button 
                onClick={handleChat}
                disabled={chatLoading}
                className="w-10 h-10 bg-teal-500 text-stone-900 rounded-xl flex items-center justify-center transition-all active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-stone-500 mt-4 font-medium">Builder AI generates architecture concepts. Verify critical changes.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-12 animate-fade-in-up">
        <div className="relative h-[300px] rounded-3xl overflow-hidden bg-white border border-stone-200 flex flex-col items-center justify-center text-center p-8">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10" />
          
          <div className="relative z-20 space-y-4 max-w-2xl">
            <h1 className="text-6xl font-bold tracking-tight text-stone-900">Discover Blueprints</h1>
            <p className="text-stone-500 text-lg font-medium leading-relaxed">High-fidelity technical architectures ready for implementation. Filter by stack and complexity to find your next build.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-stone-200 pb-8">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Stack</span>
              <select 
                value={stackFilter}
                onChange={e => setStackFilter(e.target.value)}
                className="bg-white border border-stone-200 rounded-lg px-4 py-2 text-xs font-bold text-stone-700 outline-none focus:border-teal-500/50"
              >
                <option>All Technologies</option>
                <option>React</option>
                <option>Node.js</option>
                <option>Python</option>
                <option>TypeScript</option>
                {stackFilter !== 'All Technologies' && !['React', 'Node.js', 'Python', 'TypeScript'].includes(stackFilter) && (
                  <option value={stackFilter}>{stackFilter}</option>
                )}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Difficulty</span>
              <select 
                value={diffFilter}
                onChange={e => setDiffFilter(e.target.value)}
                className="bg-white border border-stone-200 rounded-lg px-4 py-2 text-xs font-bold text-stone-700 outline-none focus:border-teal-500/50"
              >
                <option>Any Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Sort By</span>
              <button 
                onClick={() => setSortBy(sortBy === 'newest' ? 'trending' : 'newest')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${sortBy === 'trending' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'}`}
              >
                {sortBy === 'trending' ? 'Trending Skills' : 'Newest First'}
              </button>
            </div>
          </div>
          <button 
            onClick={() => { setStackFilter('All Technologies'); setDiffFilter('Any Level'); setSortBy('newest'); }}
            className="px-6 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-500 hover:text-stone-900 transition-all"
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[400px] bg-white border border-stone-200 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredIdeas.map((idea) => (
              <div key={idea._id} className="premium-card p-10 flex flex-col h-full bg-gradient-to-br from-white to-stone-50 relative overflow-hidden group">
                {sortBy === 'trending' && (
                   <div className="absolute top-0 right-0 p-4 z-20">
                    <span className="px-2 py-1 bg-teal-500 text-stone-900 text-[9px] font-black uppercase tracking-widest rounded shadow-lg">Trending</span>
                   </div>
                )}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex gap-2">
                    {(idea.stack || []).slice(0, 2).map(s => (
                      <span key={s} className="px-3 py-1 bg-stone-50 border border-stone-200 rounded text-[10px] font-bold text-stone-500">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-stone-50/50 border border-stone-200 rounded text-[10px] font-bold text-stone-500">
                    <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {idea.timeToComplete}
                  </div>
                </div>

                <div className="flex-1 space-y-6 relative z-10">
                  <h2 className="text-4xl font-serif italic text-stone-900 leading-tight">{idea.title}</h2>
                  <p className="text-stone-500 text-sm leading-relaxed font-medium line-clamp-3">
                    {idea.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 py-8 border-t border-stone-200/50 mt-auto">
                    {idea.features?.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-xs font-bold text-stone-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleSelectIdea(idea)}
                  className="w-full mt-8 bg-teal-500 text-stone-900 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Build Blueprint <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdeaEngine;
