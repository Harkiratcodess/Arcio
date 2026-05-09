import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { API_URL } from '../config/api';

const API = API_URL;

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  topScore: number;
  reposAnalyzed: number;
  techStack: string[];
}

interface Activity {
  _id: string;
  userName: string;
  userAvatar: string;
  type: string;
  repoName: string;
  repoFullName: string;
  score: number;
  timestamp: string;
}

const Community: React.FC = () => {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'comparison' | 'profile' | 'scorer'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [clerkUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const [lbRes, actRes] = await Promise.all([
        fetch(`${API}/leaderboard/global`),
        fetch(`${API}/community/activities`)
      ]);

      const lbData = await lbRes.json();
      const actData = await actRes.json();

      if (lbData.success) {
        setLeaderboard(lbData.data);
        setTotalUsers(lbData.totalUsers || lbData.data.length * 12);
      }
      if (actData.success) setActivities(actData.data);
    } catch (err) {
      console.error('Failed to fetch community data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full font-sans animate-fade-in-up pb-12">
        
        <div className="flex justify-between items-end mb-10 border-b border-stone-200/60 pb-8">
          <div>
            <h1 className="text-4xl font-serif italic text-stone-900 tracking-tight mb-2">Global Community</h1>
            <p className="text-stone-500 text-sm">Competitive benchmarking against the top engineers on Arcio.</p>
          </div>
          <div className="flex gap-8">
            {['leaderboard', 'comparison', 'profile', 'scorer'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${activeTab === tab ? 'text-stone-900 border-stone-900' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="text-2xl font-serif italic text-stone-900">Elite Rankings</h2>
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-widest">Global Pool: {totalUsers} Devs</span>
            </div>

            <div className="premium-card bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-200">
                    <th className="py-4 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest w-16 text-center">Rank</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Developer</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Top Stack</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Repos</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-stone-900 uppercase tracking-widest text-right bg-stone-100/30">Top Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {leaderboard.map((u) => (
                    <tr key={u.name} className={`${u.name === clerkUser?.fullName ? 'bg-teal-50/30' : 'hover:bg-stone-50/50'} transition-all`}>
                      <td className="py-5 px-6 text-center">
                        <span className={`text-sm font-bold ${u.rank <= 3 ? 'text-teal-600' : 'text-stone-400'}`}>
                          #{u.rank}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full border border-stone-200" alt="" />
                          <span className="text-sm font-bold text-stone-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex gap-1.5 flex-wrap">
                          {u.techStack.slice(0, 2).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[9px] font-black uppercase tracking-tighter rounded">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="text-sm font-semibold text-stone-600">{u.reposAnalyzed}</span>
                      </td>
                      <td className="py-5 px-6 text-right bg-stone-50/20">
                        <span className="text-lg font-serif italic font-bold text-stone-900">{u.topScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 text-center">
              <button className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all border-b border-stone-200 pb-1">Download Global Performance Report (PDF)</button>
            </div>
          </div>
          
          <div className="w-full lg:w-[350px] shrink-0 space-y-12">
            {/* News Channel */}
            <div className="premium-card p-8 bg-white border border-stone-200 rounded-3xl shadow-sm">
              <h3 className="text-xl font-serif italic text-stone-900 mb-8 flex items-center gap-2">
                <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                News Channel
              </h3>
              <div className="space-y-10 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-100">
                {activities.map((a) => (
                  <div key={a._id} className="relative pl-8">
                    <div className="absolute left-[-2.5px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-stone-900 z-10" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-900 leading-snug">
                        {a.userName} {a.type === 'analysis' ? 'just pushed a new analysis:' : 'reached a milestone:'} <span className="text-stone-500 font-medium">{a.repoName}</span>
                      </p>
                      {a.score > 0 && <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Score: {a.score}+</p>}
                      <p className="text-[9px] text-stone-400 font-medium uppercase tracking-tighter">
                        {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="relative pl-8">
                    <div className="absolute left-[-2.5px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-stone-200 z-10" />
                    <p className="text-xs text-stone-400 font-medium">Quiet day in the community...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trending Stacks */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Trending Stacks</h3>
              <div className="flex flex-wrap gap-2">
                {['Rust', 'Zig', 'Next.js', 'PostgreSQL', 'PyTorch'].map(s => (
                  <span key={s} className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-stone-200/50 hover:bg-stone-200 hover:text-stone-900 transition-all cursor-pointer">{s}</span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
