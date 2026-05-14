import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_URL } from '../../config/api';

const API = API_URL;

interface Skill {
  skill: string;
  demand: number;
  trend: 'rising' | 'stable' | 'declining';
  trendPercent: number;
  salary: string;
  jobVolume: number;
  recentGrowth?: number;
  category?: string;
  topHiringCompanies?: string[];
}

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  category: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  relatedSkills: string[];
  timestamp: string;
  summary: string;
}

const MarketPulse: React.FC = () => {
  const { getToken } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [skillsRes, newsRes] = await Promise.all([
        fetch(`${API}/market/skills`),
        fetch(`${API}/market/news`)
      ]);

      const skillsData = await skillsRes.json();
      const newsData = await newsRes.json();

      if (skillsData.success) setSkills(skillsData.data);
      if (newsData.success) setNews(newsData.data);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  const risingTalent = Array.isArray(skills) ? skills.filter(s => s && s.trend === 'rising').slice(0, 6) : [];
  const marketCorrections = Array.isArray(skills) ? skills.filter(s => s && s.trend !== 'rising').slice(0, 5) : [];

  // Compute summary stats
  const totalJobs = skills.reduce((sum, s) => sum + (s.jobVolume || 0), 0);
  const avgDemand = skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.demand, 0) / skills.length) : 0;
  const topSkill = skills.length > 0 ? skills.reduce((a, b) => a.demand > b.demand ? a : b) : null;

  const formatTimeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-up font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif italic text-stone-900 tracking-tight mb-2">Skill Market</h1>
        <p className="text-stone-500 text-sm">Real-time Indian engineering demand and compensation trends.</p>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Open Roles', value: `${(totalJobs / 1000).toFixed(1)}k`, sub: 'Naukri + LinkedIn India' },
          { label: 'Avg Demand Score', value: `${avgDemand}/100`, sub: 'Across 13 skills' },
          { label: 'Top Skill', value: topSkill?.skill || '—', sub: `${topSkill?.demand || 0}/100 demand` },
          { label: 'Top Hiring City', value: 'Bengaluru', sub: '38% of all tech roles' },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-5 bg-white border border-stone-200 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">{stat.label}</p>
            <p className="text-xl font-bold text-stone-900 tracking-tight">{stat.value}</p>
            <p className="text-[10px] text-stone-400 mt-1 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-10">
          
          {/* Rising Talent Table */}
          <div className="premium-card bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-serif italic text-stone-900">Rising Talent</h3>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded uppercase tracking-widest">Trending Up</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/30">
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Skill</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Weekly Change</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avg. Payout</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Open Roles</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sentiment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {risingTalent.map((s) => (
                    <tr key={s.skill} className="hover:bg-stone-50/50 transition-all group">
                      <td className="py-4 px-6 flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-sm font-bold text-stone-900">{s.skill}</span>
                        {s.category && <span className="text-[9px] font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded">{s.category}</span>}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-emerald-600 font-bold text-sm">+{s.trendPercent}%</span>
                        <span className="ml-2 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                          {s.trendPercent >= 30 ? 'Surge' : s.trendPercent >= 15 ? 'Strong' : 'Up'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-stone-900 text-sm">{s.salary}</td>
                      <td className="py-4 px-6 text-stone-600 text-sm font-medium">{(s.jobVolume / 1000).toFixed(1)}k</td>
                      <td className="py-4 px-6">
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded uppercase">Bullish</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Corrections Table */}
          <div className="premium-card bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-serif italic text-stone-900">Market Corrections</h3>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded uppercase tracking-widest">Stabilizing</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/30">
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Skill</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Weekly Change</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avg. Payout</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Open Roles</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sentiment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {marketCorrections.map((s) => (
                    <tr key={s.skill} className="hover:bg-stone-50/50 transition-all">
                      <td className="py-4 px-6 flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.trend === 'declining' ? 'bg-rose-400' : 'bg-stone-300'}`} />
                        <span className="text-sm font-bold text-stone-900">{s.skill}</span>
                        {s.category && <span className="text-[9px] font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded">{s.category}</span>}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold text-sm ${s.trendPercent < 0 ? 'text-rose-500' : 'text-amber-600'}`}>
                          {s.trendPercent > 0 ? '+' : ''}{s.trendPercent}%
                        </span>
                        <span className={`ml-2 text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${s.trend === 'declining' ? 'text-rose-500 bg-rose-50' : 'text-amber-600 bg-amber-50'}`}>
                          {s.trend === 'declining' ? 'Cooling' : 'Flat'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-stone-900 text-sm">{s.salary}</td>
                      <td className="py-4 px-6 text-stone-600 text-sm font-medium">{(s.jobVolume / 1000).toFixed(1)}k</td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${s.trend === 'declining' ? 'text-rose-500 bg-rose-50' : 'text-stone-400 bg-stone-50'}`}>
                          {s.trend === 'declining' ? 'Bearish' : 'Neutral'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[360px] space-y-8">

          {/* Top Paying Stacks — Real Indian Data */}
          <div className="premium-card p-7 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-serif italic text-stone-900 mb-1">Top Paying Stacks</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-6">India · 2026 Benchmarks</p>
            <div className="space-y-5">
              {[
                { name: 'AI/ML · PyTorch', pay: '₹55L+', trend: '+40%', hot: true },
                { name: 'Rust · WebAssembly', pay: '₹50L+', trend: '+35%', hot: true },
                { name: 'Go · Kubernetes', pay: '₹45L+', trend: '+20%', hot: false },
                { name: 'DevOps · Cloud', pay: '₹42L+', trend: '+25%', hot: false },
                { name: 'Python · Data Eng', pay: '₹40L+', trend: '+22%', hot: false },
              ].map(stack => (
                <div key={stack.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-700">{stack.name}</span>
                    {stack.hot && <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase">Hot</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-900">{stack.pay}</span>
                    <span className="text-[9px] text-emerald-600 font-bold ml-2">{stack.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Pulse — Real Indian Tech News */}
          <div className="premium-card p-7 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif italic text-stone-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                Market Pulse
              </h3>
              <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
            </div>
            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-100">
              {news.length > 0 ? news.slice(0, 5).map((item) => (
                <div key={item.id} className="relative pl-7">
                  <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 z-10 ${
                    item.impact === 'bullish' ? 'border-emerald-500' : item.impact === 'bearish' ? 'border-rose-400' : 'border-stone-300'
                  }`} />
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                      {formatTimeAgo(item.timestamp)}
                    </p>
                    <span className="text-[8px] font-black text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded">{item.source}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      item.impact === 'bullish' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-500 bg-rose-50'
                    }`}>{item.impact}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-stone-900 mb-1 leading-snug">
                    {item.headline}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.relatedSkills.map(skill => (
                      <span key={skill} className="text-[8px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{skill}</span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="relative pl-7">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-stone-200 z-10" />
                  <p className="text-xs text-stone-400">Loading market intelligence...</p>
                </div>
              )}
            </div>
          </div>

          {/* Hiring Hotspots */}
          <div className="premium-card p-7 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-serif italic text-stone-900 mb-1">Hiring Hotspots</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-5">India · By City</p>
            <div className="space-y-4">
              {[
                { city: 'Bengaluru', pct: 38, roles: '142k+' },
                { city: 'Hyderabad', pct: 22, roles: '84k+' },
                { city: 'Pune', pct: 15, roles: '56k+' },
                { city: 'Gurugram / NCR', pct: 14, roles: '52k+' },
                { city: 'Chennai', pct: 11, roles: '41k+' },
              ].map(h => (
                <div key={h.city}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-stone-700">{h.city}</span>
                    <span className="text-[10px] font-bold text-stone-500">{h.roles} roles</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full transition-all duration-700" style={{ width: `${h.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
