import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_URL } from '../../config/api';

const API = API_URL;

interface Skill {
  skill: string;
  demand: number;
  trend: 'rising' | 'stable' | 'declining';
  salary: string;
  jobVolume: number;
  recentGrowth?: number;
}

interface Activity {
  _id: string;
  userName: string;
  type: string;
  repoName: string;
  score: number;
  timestamp: string;
}

const MarketPulse: React.FC = () => {
  const { getToken } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [skillsRes, activitiesRes] = await Promise.all([
        fetch(`${API}/market/skills`),
        fetch(`${API}/community/activities`)
      ]);

      const skillsData = await skillsRes.json();
      const activitiesData = await activitiesRes.json();

      if (skillsData.success) setSkills(skillsData.data);
      if (activitiesData.success) setActivities(activitiesData.data);
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

  const risingTalent = Array.isArray(skills) ? skills.filter(s => s && s.trend === 'rising').slice(0, 5) : [];
  const marketCorrections = Array.isArray(skills) ? skills.filter(s => s && s.trend !== 'rising').slice(0, 5) : [];

  return (
    <div className="flex flex-col h-full animate-fade-in-up font-sans">
      <div className="mb-10">
        <h1 className="text-4xl font-serif italic text-stone-900 tracking-tight mb-2">Skill Market</h1>
        <p className="text-stone-500 text-sm">Real-time engineering demand and payout trends.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-12">
          
          {/* Rising Talent Table */}
          <div className="premium-card bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-serif italic text-stone-900">Rising Talent</h3>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Trending Up</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/30">
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Skill</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Trending (7d)</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avg. Payout</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Job Volume</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Market Sentiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {risingTalent.map((s) => (
                  <tr key={s.skill} className="hover:bg-stone-50/50 transition-all group">
                    <td className="py-4 px-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-stone-900">{s.skill}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-emerald-600 font-bold text-sm">+{Math.floor(Math.random() * 20) + 15}%</span>
                      <span className="ml-2 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Surge</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900 text-sm">{s.salary}</td>
                    <td className="py-4 px-6 text-stone-500 text-sm">{(s.jobVolume / 1000).toFixed(1)}k</td>
                    <td className="py-4 px-6">
                      <span className="text-[9px] font-black text-stone-500 bg-stone-100 px-2 py-1 rounded uppercase">Bullish</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Market Corrections Table */}
          <div className="premium-card bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-serif italic text-stone-900">Market Corrections</h3>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-widest">Cooling Down</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/30">
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Skill</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Trending (7d)</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avg. Payout</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Job Volume</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Market Sentiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {marketCorrections.map((s) => (
                  <tr key={s.skill} className="hover:bg-stone-50/50 transition-all">
                    <td className="py-4 px-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                      <span className="text-sm font-bold text-stone-900">{s.skill}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-amber-600 font-bold text-sm">-{Math.floor(Math.random() * 10) + 2}%</span>
                      <span className="ml-2 text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase">Stable</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900 text-sm">{s.salary}</td>
                    <td className="py-4 px-6 text-stone-500 text-sm">{(s.jobVolume / 1000).toFixed(1)}k</td>
                    <td className="py-4 px-6">
                      <span className="text-[9px] font-black text-stone-400 bg-stone-50 px-2 py-1 rounded uppercase">Stabilizing</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-[350px] space-y-8">
          {/* Top Paying Stacks */}
          <div className="premium-card p-8 bg-white border border-stone-200 rounded-3xl shadow-sm">
            <h3 className="text-xl font-serif italic text-stone-900 mb-6">Top Paying Stacks</h3>
            <div className="space-y-6">
              {[
                { name: 'Rust / WebAssembly', pay: '$180k+' },
                { name: 'Go / Kubernetes', pay: '$165k+' },
                { name: 'Python / PyTorch', pay: '$160k+' },
              ].map(stack => (
                <div key={stack.name} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-stone-700">{stack.name}</span>
                  <span className="text-sm font-bold text-stone-900">{stack.pay}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Pulse Timeline */}
          <div className="premium-card p-8 bg-white border border-stone-200 rounded-3xl shadow-sm">
            <h3 className="text-xl font-serif italic text-stone-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
              Market Pulse
            </h3>
            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-100">
              {activities.length > 0 ? activities.slice(0, 3).map((a) => (
                <div key={a._id} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-teal-500 z-10" />
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">
                    {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">
                    Surge in {a.repoName} adoption
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {a.userName} just analyzed a high-quality {a.repoName} project scoring {a.score}/100.
                  </p>
                </div>
              )) : (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-stone-200 z-10" />
                  <p className="text-xs text-stone-400">Waiting for market signals...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
