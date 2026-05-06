import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const API = 'http://localhost:5000/api';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  topScore: number;
  reposAnalyzed: number;
  techStack: string[];
  percentile: number;
}

interface UserStats {
  rank: number;
  percentile: number;
  topScore: number;
  totalUsers: number;
  nearestAhead: {
    name: string;
    score: number;
    gap: number;
  } | null;
  history: any[];
}

const Community: React.FC = () => {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState<'global' | 'competitive' | 'stats'>('global');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [clerkUser]);

  const fetchData = async () => {
    if (!clerkUser) return;
    setLoading(true);
    try {
      const token = await getToken();
      const [lbRes, statsRes] = await Promise.all([
        fetch(`${API}/leaderboard/global`),
        fetch(`${API}/leaderboard/user/${clerkUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const lbData = await lbRes.json();
      const statsData = await statsRes.json();

      if (lbData.success) setLeaderboard(lbData.data);
      if (statsData.success) setUserStats(statsData.data);
    } catch (err) {
      console.error('Failed to fetch community data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!userStats) return;
    const text = `I'm ranked #${userStats.rank} on Arcio with a top score of ${userStats.topScore}/100! 🚀 Check out my developer profile on Arcio.`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
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
        
        <div className="flex justify-between items-end mb-10 border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-4xl font-serif italic text-stone-900 tracking-tight mb-2">Global Community</h1>
            <p className="text-stone-500 text-sm">Competitive benchmarking against the top engineers on Arcio.</p>
          </div>
          <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('global')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'global' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Leaderboard
            </button>
            <button 
              onClick={() => setActiveTab('competitive')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'competitive' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Comparison
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'stats' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Your Stats
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            {activeTab === 'global' && (
              <div className="space-y-6">
                <div className="flex justify-between items-baseline mb-6">
                  <h2 className="text-2xl font-serif italic text-stone-900">Elite Rankings</h2>
                  <span className="text-[11px] text-stone-400 font-medium uppercase tracking-widest">Global Pool: {userStats?.totalUsers || 0} Devs</span>
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
              </div>
            )}

            {activeTab === 'competitive' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="premium-card p-10 bg-stone-900 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500 rounded-full blur-[100px] opacity-30" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 relative z-10">Current Standing</h3>
                    <div className="text-6xl font-serif italic mb-2 relative z-10">#{userStats?.rank || '—'}</div>
                    <p className="text-sm text-stone-400 relative z-10">You're in the top <span className="text-white font-bold">{userStats?.percentile || 0}%</span> of all engineers globally.</p>
                  </div>

                  <div className="premium-card p-10 bg-white border border-stone-200">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Gap Analysis</h3>
                    {userStats?.nearestAhead ? (
                      <div>
                        <p className="text-sm text-stone-600 leading-relaxed mb-6">
                          You're currently <span className="text-stone-900 font-bold">{userStats.nearestAhead.gap} points</span> behind <span className="text-stone-900 font-bold">{userStats.nearestAhead.name}</span>. 
                          Analyze more high-quality projects to bridge the gap.
                        </p>
                        <button onClick={() => setActiveTab('stats')} className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-800 transition-colors">View performance delta →</button>
                      </div>
                    ) : (
                      <p className="text-sm text-stone-500">You are at the top of the leaderboard! 🚀</p>
                    )}
                  </div>
                </div>

                <div className="premium-card p-8 bg-white border border-stone-200">
                  <h3 className="text-2xl font-serif italic text-stone-900 mb-8">Competitive Breakdown</h3>
                  <div className="space-y-8">
                    {[
                      { label: 'Architecture', value: userStats?.topScore ? userStats.topScore - 5 : 0, target: 95 },
                      { label: 'Code Quality', value: userStats?.topScore ? userStats.topScore + 2 : 0, target: 98 },
                      { label: 'Documentation', value: userStats?.topScore ? userStats.topScore - 10 : 0, target: 90 },
                    ].map(item => (
                      <div key={item.label} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-stone-800">{item.label}</span>
                          <span className="text-xs font-black text-rose-500">-{item.target - item.value} pts</span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-stone-900 rounded-full" style={{ width: `${item.value}%` }} />
                          <div className="h-full bg-stone-200" style={{ width: `${item.target - item.value}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-stone-400">
                          <span>You: {item.value}</span>
                          <span>Top 1%: {item.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-serif italic text-stone-900">Your Analytics</h2>
                  <button onClick={handleShare} className="px-6 py-2.5 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    Share Achievement
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="premium-card p-8 bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest block mb-4">Top Score</span>
                    <div className="text-4xl font-serif italic text-stone-900">{userStats?.topScore || 0}</div>
                  </div>
                  <div className="premium-card p-8 bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest block mb-4">Percentile</span>
                    <div className="text-4xl font-serif italic text-stone-900">{userStats?.percentile || 0}%</div>
                  </div>
                  <div className="premium-card p-8 bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest block mb-4">Total Analysed</span>
                    <div className="text-4xl font-serif italic text-stone-900">{userStats?.history.length || 0}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-serif italic text-stone-900">Analysis History</h3>
                  <div className="space-y-4">
                    {userStats?.history.map((h: any) => (
                      <div key={h._id} className="premium-card p-6 bg-white border border-stone-100 flex justify-between items-center hover:border-stone-300 transition-all group">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 mb-1 group-hover:text-teal-700 transition-colors">{h.repoFullName}</h4>
                          <p className="text-[10px] text-stone-400 font-medium">{new Date(h.analyzedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-serif italic font-bold text-stone-900">{h.scores.overall}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-stone-400">Score</div>
                          </div>
                          <svg className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-[350px] shrink-0 space-y-8">
            <div className="premium-card p-8 bg-stone-50 border border-stone-200 rounded-3xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Hall of Fame</h3>
              <div className="space-y-6">
                {leaderboard.slice(0, 3).map(u => (
                  <div key={u.name} className="flex items-center gap-4">
                    <div className="relative">
                      <img src={u.avatar || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-stone-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-stone-50">
                        {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{u.name}</h4>
                      <p className="text-[10px] text-stone-400 font-medium">{u.techStack[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 mt-8 border border-stone-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all">
                View Full Hall
              </button>
            </div>

            <div className="premium-card p-8 bg-teal-900 text-white rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-xl font-serif italic mb-2 relative z-10">Arcio Champions</h3>
              <p className="text-xs text-teal-100/70 leading-relaxed mb-6 relative z-10">Top 1% engineers get exclusive access to stealth-mode job listings and premium networking events.</p>
              <button className="w-full py-3 bg-white text-teal-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-teal-50 transition-all relative z-10">
                Learn More
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;

