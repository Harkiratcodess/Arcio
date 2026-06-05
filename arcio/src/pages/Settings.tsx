import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { API_URL } from '../config/api';

const PRESETS_TECH_STACK = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Rust', 'Go', 
  'Next.js', 'PostgreSQL', 'MongoDB', 'Redis', 'TailwindCSS', 'Docker'
];

interface ProfileData {
  bio: string;
  targetRole: string;
  githubUsername: string;
  experienceLevel: 'beginner' | 'junior' | 'mid' | 'senior';
  techStack: string[];
}

const Settings: React.FC = () => {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    targetRole: '',
    githubUsername: '',
    experienceLevel: 'junior',
    techStack: []
  });

  useEffect(() => {
    if (clerkUser) {
      fetchProfile();
    }
  }, [clerkUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        const userProfile = data.data.profile || {};
        setProfile({
          bio: userProfile.bio || '',
          targetRole: userProfile.targetRole || '',
          githubUsername: userProfile.githubUsername || '',
          experienceLevel: userProfile.experienceLevel || 'junior',
          techStack: userProfile.techStack || []
        });
      }
    } catch (err) {
      console.error('Error fetching profile settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTech = (tech: string) => {
    setProfile(prev => {
      const exists = prev.techStack.includes(tech);
      const nextStack = exists 
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech];
      return { ...prev, techStack: nextStack };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMessage(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Settings saved successfully!');
      } else {
        showToast('Failed to save settings.');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('Error connection to server.');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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
      <div className="max-w-4xl mx-auto font-sans animate-fade-in-up pb-16">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-stone-200">
          <h1 className="text-4xl font-serif italic text-stone-900 tracking-tight mb-2">Developer Settings</h1>
          <p className="text-stone-500 text-sm">Configure your portfolio details and personalize your Arcio account.</p>
        </div>

        {/* Profile Card & Settings Form */}
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Clerk Info - Display only */}
          <div className="premium-card p-8 bg-[#FDFDFD] border border-stone-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
              <img 
                src={clerkUser?.imageUrl || 'https://i.pravatar.cc/100?img=33'} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-stone-900">{clerkUser?.fullName || 'Developer'}</h3>
              <p className="text-xs text-stone-400 mt-0.5">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider">Account Connected via Clerk</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Professional Profiles */}
            <div className="premium-card p-8 bg-white border border-stone-200 space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100 pb-3">Professional Blueprint</h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Target Role</label>
                <input 
                  type="text" 
                  value={profile.targetRole}
                  onChange={e => setProfile(prev => ({ ...prev, targetRole: e.target.value }))}
                  placeholder="e.g. Full-Stack Engineer" 
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">GitHub Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">@</span>
                  <input 
                    type="text" 
                    value={profile.githubUsername}
                    onChange={e => setProfile(prev => ({ ...prev, githubUsername: e.target.value }))}
                    placeholder="octocat" 
                    className="w-full pl-8 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Experience Bracket</label>
                <select 
                  value={profile.experienceLevel}
                  onChange={e => setProfile(prev => ({ ...prev, experienceLevel: e.target.value as any }))}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all"
                >
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-Level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>
            </div>

            {/* Bio & Skills */}
            <div className="premium-card p-8 bg-white border border-stone-200 space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100 pb-3">Developer Bio</h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Bio Description</label>
                <textarea 
                  value={profile.bio}
                  onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Share a short summary about your project architecture style, goals, or build philosophy..." 
                  rows={6}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Tech Stack Chips Card */}
          <div className="premium-card p-8 bg-white border border-stone-200 space-y-6">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100 pb-3">Active Skills & Tech Stack</h3>
              <p className="text-[11px] text-stone-400 mt-1 font-medium">Select primary technologies that you use to generate tailored ideas.</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {PRESETS_TECH_STACK.map(tech => {
                const isSelected = profile.techStack.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleToggleTech(tech)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected 
                        ? 'bg-stone-900 border-stone-900 text-white shadow-md' 
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4 border-t border-stone-200">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-900/10 disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Save All Settings'}
            </button>
          </div>
        </form>

        {/* Floating Success Toast */}
        {toastMessage && (
          <div className="fixed bottom-8 right-8 z-50 animate-bounce">
            <div className="bg-stone-950 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Settings;
