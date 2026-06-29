import React, { useState, useEffect } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { API_URL } from '../config/api';

const PRESETS_TECH_STACK = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Rust', 'Go',
  'Next.js', 'PostgreSQL', 'MongoDB', 'Redis', 'TailwindCSS', 'Docker',
  'GraphQL', 'AWS', 'Kubernetes', 'Vue.js', 'Angular', 'Swift',
  'Kotlin', 'Java', 'C#', '.NET', 'PHP', 'Laravel', 'Django'
];

interface ProfileData {
  bio: string;
  targetRole: string;
  githubUsername: string;
  experienceLevel: 'beginner' | 'junior' | 'mid' | 'senior';
  techStack: string[];
}

type TabId = 'profile' | 'appearance' | 'notifications' | 'privacy' | 'account';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 'account',
    label: 'Account',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const Toggle: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
      checked ? 'bg-teal-600' : 'bg-stone-200'
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-4' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const SettingRow: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  badge?: string;
}> = ({ title, description, children, badge }) => (
  <div className="flex items-center justify-between py-4 border-b border-stone-100 last:border-0 gap-4">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-stone-800">{title}</p>
        {badge && (
          <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-200/80 uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{description}</p>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/60">
      <h3 className="text-sm font-bold text-stone-800 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="px-6">{children}</div>
  </div>
);

// Spinner Component
const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <svg className={`${sizeClass} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

const Settings: React.FC = () => {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    targetRole: '',
    githubUsername: '',
    experienceLevel: 'junior',
    techStack: [],
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    communityReplies: true,
    newFeatures: false,
    marketAlerts: true,
    weeklyReport: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showActivity: true,
    showTechStack: true,
    allowIndexing: false,
    dataSharingAnalytics: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    density: 'comfortable',
    language: 'en',
    timezone: 'Asia/Kolkata',
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const userProfile = data.data.profile || {};
        setProfile({
          bio: userProfile.bio || '',
          targetRole: userProfile.targetRole || '',
          githubUsername: userProfile.githubUsername || '',
          experienceLevel: userProfile.experienceLevel || 'junior',
          techStack: userProfile.techStack || [],
        });
      }
    } catch (err) {
      console.error('Error fetching profile settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTech = (tech: string) => {
    setProfile((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Profile saved successfully!', 'success');
      } else {
        showToast('Failed to save profile.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast('Notification preferences saved!', 'success');
    setSaving(false);
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast('Privacy settings updated!', 'success');
    setSaving(false);
  };

  const handleSaveAppearance = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    showToast('Appearance preferences saved!', 'success');
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-72 gap-4">
          <div className="w-10 h-10 border-[3px] border-stone-200 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-sm text-stone-400 font-medium">Loading your settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto font-sans pb-20 animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Settings</h1>
          <p className="text-stone-400 text-sm mt-1.5">
            Manage your account preferences, privacy, and personalization.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <aside className="lg:w-56 shrink-0">
            <nav className="bg-white border border-stone-200 rounded-2xl p-2 shadow-sm sticky top-6">
              {/* User mini-card */}
              <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-stone-100">
                <img
                  src={clerkUser?.imageUrl || 'https://i.pravatar.cc/100?img=33'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-stone-200 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-800 truncate">{clerkUser?.fullName || 'Developer'}</p>
                  <p className="text-[10px] text-stone-400 truncate">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-150 mb-0.5 ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-white' : 'text-stone-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* ─── PROFILE TAB ─── */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Identity Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative">
                      <img
                        src={clerkUser?.imageUrl || 'https://i.pravatar.cc/100?img=33'}
                        alt="Avatar"
                        className="w-20 h-20 rounded-2xl border-2 border-stone-200 object-cover"
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-stone-900">{clerkUser?.fullName || 'Developer'}</h2>
                      <p className="text-sm text-stone-400 mt-0.5">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 text-[11px] font-semibold rounded-lg border border-teal-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          Clerk Auth · Verified
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-600 text-[11px] font-semibold rounded-lg border border-stone-200">
                          Early Access Member
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-400 sm:text-right">
                      Avatar managed via<br />
                      <span className="font-semibold text-stone-500">Clerk Account</span>
                    </p>
                  </div>
                </div>

                {/* Professional Blueprint */}
                <SectionCard title="Professional Blueprint" subtitle="Configure how Arcio personalizes your experience">
                  <div className="py-4 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Target Role</label>
                        <input
                          type="text"
                          value={profile.targetRole}
                          onChange={(e) => setProfile((prev) => ({ ...prev, targetRole: e.target.value }))}
                          placeholder="e.g. Full-Stack Engineer"
                          className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Experience Level</label>
                        <select
                          value={profile.experienceLevel}
                          onChange={(e) => setProfile((prev) => ({ ...prev, experienceLevel: e.target.value as any }))}
                          className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
                        >
                          <option value="beginner"> Beginner (0–1 years)</option>
                          <option value="junior"> Junior (1–3 years)</option>
                          <option value="mid"> Mid-Level (3–5 years)</option>
                          <option value="senior"> Senior (5+ years)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">GitHub Username</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">@</span>
                        <input
                          type="text"
                          value={profile.githubUsername}
                          onChange={(e) => setProfile((prev) => ({ ...prev, githubUsername: e.target.value }))}
                          placeholder="octocat"
                          className="w-full pl-8 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Share your project style, goals, or build philosophy..."
                        rows={4}
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all resize-none"
                      />
                      <p className="text-[11px] text-stone-400 text-right">{profile.bio.length}/300</p>
                    </div>
                  </div>
                </SectionCard>

                {/* Tech Stack */}
                <SectionCard title="Tech Stack & Skills" subtitle="Select technologies to personalize AI idea generation">
                  <div className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {PRESETS_TECH_STACK.map((tech) => {
                        const isSelected = profile.techStack.includes(tech);
                        return (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => handleToggleTech(tech)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-[1.02]'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900 hover:bg-white'
                            }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                    {profile.techStack.length > 0 && (
                      <p className="text-[11px] text-stone-400 mt-3">
                        {profile.techStack.length} technolog{profile.techStack.length === 1 ? 'y' : 'ies'} selected
                      </p>
                    )}
                  </div>
                </SectionCard>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-60"
                  >
                    {saving ? <><Spinner size="sm" /> Saving...</> : <>Save Profile</>}
                  </button>
                </div>
              </form>
            )}

            {/* ─── APPEARANCE TAB ─── */}
            {activeTab === 'appearance' && (
              <div className="space-y-5">
                <SectionCard title="Theme" subtitle="Choose how Arcio looks on your device">
                  <div className="py-4 space-y-3">
                    {[
                      { value: 'system', label: 'System Default', desc: 'Follows your OS preference automatically' },
                      { value: 'light', label: 'Light Mode', desc: 'Clean white interface',  },
                      { value: 'dark', label: 'Dark Mode', desc: 'Easy on the eyes at night',  },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAppearance((p) => ({ ...p, theme: option.value }))}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all text-left ${
                          appearance.theme === option.value
                            ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-white text-stone-700'
                        }`}
                      >
                        
                        <div>
                          <p className="text-sm font-semibold">{option.label}</p>
                          <p className={`text-xs mt-0.5 ${appearance.theme === option.value ? 'text-stone-300' : 'text-stone-400'}`}>{option.desc}</p>
                        </div>
                        {appearance.theme === option.value && (
                          <svg className="w-4 h-4 text-teal-400 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Display Density" subtitle="Control the spacing and density of the interface">
                  <div className="py-4 space-y-2">
                    {[
                      { value: 'compact', label: 'Compact', desc: 'More content, less whitespace' },
                      { value: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing (recommended)' },
                      { value: 'spacious', label: 'Spacious', desc: 'More breathing room between elements' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                          appearance.density === option.value
                            ? 'border-teal-400 bg-teal-50'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${appearance.density === option.value ? 'border-teal-600 bg-teal-600' : 'border-stone-300'} flex items-center justify-center`}>
                          {appearance.density === option.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <input type="radio" className="sr-only" checked={appearance.density === option.value} onChange={() => setAppearance((p) => ({ ...p, density: option.value }))} />
                        <div>
                          <p className="text-sm font-semibold text-stone-800">{option.label}</p>
                          <p className="text-xs text-stone-400">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Language & Region">
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Language</label>
                      <select
                        value={appearance.language}
                        onChange={(e) => setAppearance((p) => ({ ...p, language: e.target.value }))}
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="es">🇪🇸 Spanish</option>
                        <option value="fr">🇫🇷 French</option>
                        <option value="de">🇩🇪 German</option>
                        <option value="ja">🇯🇵 Japanese</option>
                        <option value="zh">🇨🇳 Chinese</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Timezone</label>
                      <select
                        value={appearance.timezone}
                        onChange={(e) => setAppearance((p) => ({ ...p, timezone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
                      >
                        <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                        <option value="America/New_York">EST (UTC-5)</option>
                        <option value="America/Los_Angeles">PST (UTC-8)</option>
                        <option value="Europe/London">GMT (UTC+0)</option>
                        <option value="Europe/Paris">CET (UTC+1)</option>
                        <option value="Asia/Tokyo">JST (UTC+9)</option>
                      </select>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAppearance}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-60"
                  >
                    {saving ? <><Spinner size="sm" /> Saving...</> : <>Save Appearance</>}
                  </button>
                </div>
              </div>
            )}

            {/* ─── NOTIFICATIONS TAB ─── */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <SectionCard title="Email Notifications" subtitle="Choose which emails you'd like to receive from Arcio">
                  <SettingRow
                    title="Weekly Digest"
                    description="A summary of your activity, top ideas, and community highlights every Monday."
                    badge="Recommended"
                  >
                    <Toggle
                      checked={notifications.weeklyReport}
                      onChange={() => setNotifications((p) => ({ ...p, weeklyReport: !p.weeklyReport }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Community Replies"
                    description="Get notified when someone replies to your posts or comments in the community."
                  >
                    <Toggle
                      checked={notifications.communityReplies}
                      onChange={() => setNotifications((p) => ({ ...p, communityReplies: !p.communityReplies }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Market Alerts"
                    description="Receive alerts on trending tech topics and market shifts relevant to your stack."
                  >
                    <Toggle
                      checked={notifications.marketAlerts}
                      onChange={() => setNotifications((p) => ({ ...p, marketAlerts: !p.marketAlerts }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="New Features & Updates"
                    description="Be the first to know when Arcio ships new tools, features, or major improvements."
                  >
                    <Toggle
                      checked={notifications.newFeatures}
                      onChange={() => setNotifications((p) => ({ ...p, newFeatures: !p.newFeatures }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Email Digest Summary"
                    description="Daily email with your idea pipeline and recommended actions."
                  >
                    <Toggle
                      checked={notifications.emailDigest}
                      onChange={() => setNotifications((p) => ({ ...p, emailDigest: !p.emailDigest }))}
                    />
                  </SettingRow>
                </SectionCard>

                <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    You'll always receive critical account security emails regardless of these settings.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-60"
                  >
                    {saving ? <><Spinner size="sm" /> Saving...</> : <>Save Notifications</>}
                  </button>
                </div>
              </div>
            )}

            {/* ─── PRIVACY TAB ─── */}
            {activeTab === 'privacy' && (
              <div className="space-y-5">
                <SectionCard title="Profile Visibility" subtitle="Control what others can see about you on Arcio">
                  <SettingRow
                    title="Public Profile"
                    description="Allow other Arcio members to view your profile, bio, and role."
                  >
                    <Toggle
                      checked={privacy.showProfile}
                      onChange={() => setPrivacy((p) => ({ ...p, showProfile: !p.showProfile }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Show Tech Stack"
                    description="Display your selected technologies on your public profile."
                  >
                    <Toggle
                      checked={privacy.showTechStack}
                      onChange={() => setPrivacy((p) => ({ ...p, showTechStack: !p.showTechStack }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Activity Visibility"
                    description="Show your recent ideas and community contributions on your profile."
                  >
                    <Toggle
                      checked={privacy.showActivity}
                      onChange={() => setPrivacy((p) => ({ ...p, showActivity: !p.showActivity }))}
                    />
                  </SettingRow>
                </SectionCard>

                <SectionCard title="Data & Analytics" subtitle="How your data is used to improve Arcio">
                  <SettingRow
                    title="Analytics Data Sharing"
                    description="Share anonymized usage data to help us improve AI quality and idea relevance."
                  >
                    <Toggle
                      checked={privacy.dataSharingAnalytics}
                      onChange={() => setPrivacy((p) => ({ ...p, dataSharingAnalytics: !p.dataSharingAnalytics }))}
                    />
                  </SettingRow>
                  <SettingRow
                    title="Search Engine Indexing"
                    description="Allow your public Arcio profile to be discoverable via search engines."
                  >
                    <Toggle
                      checked={privacy.allowIndexing}
                      onChange={() => setPrivacy((p) => ({ ...p, allowIndexing: !p.allowIndexing }))}
                    />
                  </SettingRow>
                </SectionCard>

                <SectionCard title="Data Management">
                  <div className="py-4 space-y-3">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all text-left group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-stone-800">Download Your Data</p>
                        <p className="text-xs text-stone-400 mt-0.5">Export all your ideas, profile, and activity as a JSON file.</p>
                      </div>
                      <svg className="w-4 h-4 text-stone-400 group-hover:text-stone-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </SectionCard>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePrivacy}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-60"
                  >
                    {saving ? <><Spinner size="sm" /> Saving...</> : <>Save Privacy Settings</>}
                  </button>
                </div>
              </div>
            )}

            {/* ─── ACCOUNT TAB ─── */}
            {activeTab === 'account' && (
              <div className="space-y-5">
                <SectionCard title="Account Information" subtitle="Your Arcio account details">
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Full Name</p>
                        <p className="text-sm font-semibold text-stone-800 mt-1">{clerkUser?.fullName || '—'}</p>
                      </div>
                      <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</p>
                        <p className="text-sm font-semibold text-stone-800 mt-1 truncate">{clerkUser?.primaryEmailAddress?.emailAddress || '—'}</p>
                      </div>
                      <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Account Status</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <p className="text-sm font-semibold text-stone-800">Active · Early Access</p>
                        </div>
                      </div>
                      <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Plan</p>
                        <p className="text-sm font-semibold text-stone-800 mt-1">Free Beta</p>
                      </div>
                    </div>
                    <p className="text-xs text-stone-400">
                      To update your name, email, or password, visit your{' '}
                      <a
                        href="https://accounts.clerk.dev/user"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2"
                      >
                        Clerk Account settings
                      </a>.
                    </p>
                  </div>
                </SectionCard>

                <SectionCard title="Sessions">
                  <div className="py-4">
                    <div className="flex items-center justify-between py-3 border border-stone-200 rounded-xl px-4 bg-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">Current Session</p>
                          <p className="text-xs text-stone-400">This device · Active now</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Active</span>
                    </div>
                  </div>
                </SectionCard>

                {/* Sign Out */}
                <SectionCard title="Session Management">
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all text-left group"
                    >
                      <svg className="w-4 h-4 text-stone-500 group-hover:text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">Sign Out</p>
                        <p className="text-xs text-stone-400 mt-0.5">Sign out from your current session</p>
                      </div>
                    </button>
                  </div>
                </SectionCard>

                {/* Danger Zone */}
                <div className="bg-white border border-red-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-red-100 bg-red-50/60">
                    <h3 className="text-sm font-bold text-red-700 tracking-tight">Danger Zone</h3>
                    <p className="text-xs text-red-400 mt-0.5">These actions are permanent and cannot be undone.</p>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-800">Delete Account</p>
                        <p className="text-xs text-stone-400 mt-0.5">Permanently delete your account and all associated data.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 hover:border-red-300 transition-all"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-900">Delete Account</h3>
            <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
              This will permanently delete your Arcio account, all your ideas, and data. This action cannot be undone.
            </p>
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Type <span className="font-mono font-bold text-stone-900">DELETE</span> to confirm</label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all font-mono"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                className="flex-1 px-4 py-2.5 border border-stone-200 text-stone-700 text-sm font-semibold rounded-xl hover:bg-stone-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirm !== 'DELETE'}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold animate-fade-in-up ${
            toastMessage.type === 'success'
              ? 'bg-stone-950 text-white border-stone-800'
              : 'bg-red-600 text-white border-red-700'
          }`}>
            {toastMessage.type === 'success' ? (
              <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toastMessage.text}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
