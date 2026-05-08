import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

const API = API_URL;

interface Skill {
  skill: string;
  demand: number;
  trend: string;
  salary: string;
  marketPercentile?: number;
  roles?: string;
  change?: string;
  isUp?: boolean;
}

interface UserAnalysis {
  userSkills: Skill[];
  recommendedSkills: {
    skill: string;
    demand: number;
    trend: string;
    reason: string;
    salary: string;
  }[];
  marketOverview: {
    topSkill: Skill;
    fastestGrowing: Skill[];
    averageDemand: number;
  };
}

const TrendLine = ({ demand, trend }: { demand: number, trend: string }) => {
  const isUp = trend === 'rising';
  const data = isUp ? [demand - 10, demand - 5, demand - 7, demand - 2, demand] : [demand + 10, demand + 5, demand + 7, demand + 2, demand];
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  
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
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'top' | 'yours' | 'recommended'>('top');
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userAnalysis, setUserAnalysis] = useState<UserAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const [skillsRes, analysisRes] = await Promise.all([
        fetch(`${API}/market/skills`),
        fetch(`${API}/market/user-analysis`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const skillsData = await skillsRes.json();
      const analysisData = await analysisRes.json();

      if (skillsData.success) setAllSkills(skillsData.data);
      if (analysisData.success) setUserAnalysis(analysisData.data);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = allSkills.filter(s => 
    s.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDemandColor = (demand: number) => {
    if (demand > 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (demand > 60) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const handleLearnSkill = (skill: string) => {
    navigate(`/ideas?skill=${encodeURIComponent(skill)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      <div className="flex justify-between items-end mb-12 pb-8 border-b border-stone-200/60">
        <div>
          <h1 className="text-5xl font-serif italic text-stone-900 tracking-tight mb-3">Market Intelligence</h1>
          <p className="text-stone-500 text-sm max-w-md">Real-time telemetry on global skill demand, ecosystem health, and compensation benchmarks.</p>
        </div>
        <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
          <button 
            onClick={() => setActiveTab('top')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'top' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Top Skills
          </button>
          <button 
            onClick={() => setActiveTab('yours')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'yours' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Your Stack
          </button>
          <button 
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'recommended' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Recommendations
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-16">
        <div className="flex-1">
          {activeTab === 'top' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif italic text-stone-900">Global Tech Demand</h2>
                <div className="relative w-64">
                  <input 
                    type="text" 
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-stone-400 transition-all"
                  />
                  <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-100">
                  <span className="w-8">Rank</span>
                  <span className="w-1/3">Skill</span>
                  <span className="w-1/6">Demand</span>
                  <span className="w-1/6">Salary</span>
                  <span className="w-1/6 text-center">Trend</span>
                </div>
                {filteredSkills.map((skill, idx) => (
                  <div key={skill.skill} className="flex items-center justify-between py-5 px-4 rounded-2xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-100">
                    <span className="w-8 text-stone-300 text-sm font-black italic">{idx + 1}</span>
                    <div className="w-1/3">
                      <span className="text-lg font-serif italic text-stone-900">{skill.skill}</span>
                    </div>
                    <div className="w-1/6">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDemandColor(skill.demand)}`}>
                        {skill.demand}/100
                      </span>
                    </div>
                    <div className="w-1/6">
                      <span className="text-sm font-bold text-stone-900 tracking-tight">{skill.salary}</span>
                    </div>
                    <div className="w-1/6 flex justify-center">
                      <TrendLine demand={skill.demand} trend={skill.trend} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'yours' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif italic text-stone-900">Your Competitive Edge</h2>
              {userAnalysis?.userSkills.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userAnalysis.userSkills.map(skill => (
                    <div key={skill.skill} className="premium-card p-6 bg-white border border-stone-200">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-serif italic text-stone-900">{skill.skill}</h3>
                        <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getDemandColor(skill.demand)}`}>
                          {skill.demand} Demand
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Market Percentile</span>
                            <span className="text-lg font-bold text-stone-900">{skill.marketPercentile}%</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Salary Range</span>
                            <span className="text-sm font-bold text-stone-900">{skill.salary}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            Verified in profile
                          </span>
                          <button 
                            onClick={() => handleLearnSkill(skill.skill)}
                            className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            Find Projects
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-3xl">
                  <p className="text-stone-500 font-medium mb-4">No skills found in your profile.</p>
                  <button onClick={() => navigate('/analyzer')} className="px-6 py-2.5 bg-stone-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl">Update Tech Stack</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif italic text-stone-900">Recommended Learning Paths</h2>
              <div className="space-y-6">
                {userAnalysis?.recommendedSkills.map(skill => (
                  <div key={skill.skill} className="premium-card p-8 bg-white border border-stone-200 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-serif italic text-stone-900">{skill.skill}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-stone-950 text-white text-[9px] font-black tracking-widest uppercase">High Demand</span>
                      </div>
                      <p className="text-sm text-stone-600 font-medium leading-relaxed mb-6">{skill.reason}</p>
                      <div className="flex gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Entry Salary</span>
                          <span className="text-sm font-bold text-stone-900">{skill.salary}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Demand Score</span>
                          <span className="text-sm font-bold text-stone-900">{skill.demand}/100</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleLearnSkill(skill.skill)}
                      className="w-full md:w-auto px-8 py-4 bg-teal-800 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-teal-900 transition-all shadow-lg shadow-teal-900/10"
                    >
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[380px] space-y-8">
          <div className="premium-card p-8 bg-stone-900 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-8 -mr-8 w-32 h-32 bg-teal-500 rounded-full blur-[80px] opacity-20" />
            <h2 className="text-2xl font-serif italic mb-6 relative z-10">Market Overview</h2>
            <div className="space-y-8 relative z-10">
              <div>
                <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest block mb-2">Avg. Industry Demand</span>
                <div className="text-4xl font-serif italic">{userAnalysis?.marketOverview.averageDemand || 0}%</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: `${userAnalysis?.marketOverview.averageDemand || 0}%` }} />
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest block mb-4">Fastest Growing</span>
                <div className="space-y-4">
                  {userAnalysis?.marketOverview.fastestGrowing.map(s => (
                    <div key={s.skill} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{s.skill}</span>
                      <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        {s.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-8 bg-white border border-stone-200">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Radar Context</h3>
            <div className="aspect-square relative flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="w-full h-full text-stone-100 fill-stone-50/50">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <path 
                  d="M50 20 L75 40 L65 70 L35 70 L25 40 Z" 
                  className="fill-teal-500/20 stroke-teal-500" 
                  strokeWidth="1"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-center"><span className="text-[8px] font-black uppercase text-stone-400">Frontend</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase text-stone-400">DevOps</span>
                  <span className="text-[8px] font-black uppercase text-stone-400">Backend</span>
                </div>
                <div className="flex justify-center"><span className="text-[8px] font-black uppercase text-stone-400">Mobile</span></div>
              </div>
            </div>
            <p className="text-[10px] text-stone-500 text-center mt-6 font-medium leading-relaxed">Your current stack is optimized for <span className="text-stone-900 font-bold">Frontend Heavy</span> ecosystems.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;

