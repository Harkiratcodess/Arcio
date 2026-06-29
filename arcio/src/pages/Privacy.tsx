import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-stone-950 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-stone-900 font-semibold text-[15px]">Arcio</span>
          </Link>
          <Link
            to="/signup"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-300"
          >
            ← Back to Sign Up
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Title */}
        <div className="mb-12">
          <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-[11px] font-bold uppercase tracking-widest rounded-full border border-teal-200 mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Privacy Policy</h1>
          <p className="text-stone-400 mt-3 text-sm">
            Last updated: June 29, 2026 · We're committed to your privacy
          </p>
        </div>

        {/* Highlight card */}
        <div className="mb-10 bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-teal-900 mb-1">Your Privacy Matters to Us</p>
            <p className="text-xs text-teal-800 leading-relaxed">
              Arcio collects minimal data, never sells your information, and gives you full control over your account. We believe in transparency — this document explains exactly what we collect and why.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-sm text-stone-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">1</span>
              Information We Collect
            </h2>
            <p className="mb-4">We collect information you provide directly to us and information generated through your use of the Service:</p>
            
            <div className="space-y-3">
              {[
                {
                  title: 'Account Information',
                  items: ['Name and email address (via Clerk authentication)', 'Profile photo (synced from your OAuth provider)', 'GitHub username (if provided)'],
                },
                {
                  title: 'Profile Data',
                  items: ['Developer bio and target role', 'Experience level and tech stack preferences', 'Idea history and saved ideas'],
                },
                {
                  title: 'Usage Data',
                  items: ['Pages visited and features used', 'Community posts and comments you create', 'Interactions with AI tools (prompts and outputs)'],
                },
              ].map((group) => (
                <div key={group.title} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <p className="font-semibold text-stone-800 text-sm mb-2">{group.title}</p>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-stone-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">2</span>
              How We Use Your Information
            </h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2">
              {[
                'Provide, maintain, and improve the Arcio platform',
                'Personalize AI-generated idea recommendations to your tech stack',
                'Analyze your GitHub repositories (only when you explicitly request it)',
                'Send notifications and digest emails (if you opt in)',
                'Monitor for abuse, security issues, and policy violations',
                'Understand how users interact with features to improve the product',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">3</span>
              Data Sharing & Third Parties
            </h2>
            <p className="mb-4">
              We do not sell, rent, or trade your personal data. We share data only in the following limited cases:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { provider: 'Clerk', purpose: 'Authentication and user identity management', icon: '🔐' },
                { provider: 'MongoDB Atlas', purpose: 'Secure cloud database for storing your profile and ideas', icon: '🗄️' },
                { provider: 'Redis', purpose: 'Performance caching for faster response times', icon: '⚡' },
                { provider: 'AI Providers', purpose: 'Processing your prompts for idea generation (anonymized)', icon: '🤖' },
              ].map((item) => (
                <div key={item.provider} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>{item.icon}</span>
                    <p className="font-semibold text-stone-800 text-sm">{item.provider}</p>
                  </div>
                  <p className="text-xs text-stone-500">{item.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">4</span>
              GitHub Integration
            </h2>
            <p>
              When you use the Analyzer feature and provide a GitHub username, Arcio uses the GitHub public API to fetch repository metadata. We only access public repository information and do not store your GitHub access tokens. You can disconnect this at any time by removing your GitHub username from Settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">5</span>
              Data Retention
            </h2>
            <p>
              We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required for legal compliance or fraud prevention.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">6</span>
              Your Rights & Choices
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2">
              {[
                'Access and download a copy of your data (available in Settings → Privacy)',
                'Update or correct your profile information at any time',
                'Delete your account and all associated data',
                'Opt out of non-essential email notifications in Settings',
                'Disable analytics data sharing in Privacy Settings',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">7</span>
              Security
            </h2>
            <p>
              We use industry-standard security practices including HTTPS encryption, JWT token authentication via Clerk, and encrypted database connections. However, no method of transmission or storage is 100% secure. We encourage you to use a strong, unique password and keep your credentials confidential.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">8</span>
              Children's Privacy
            </h2>
            <p>
              Arcio is not intended for users under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">9</span>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with a revised date and, when appropriate, sending you an email notification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">10</span>
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please reach out. Arcio is an independent project and we take privacy concerns seriously and will respond promptly.
            </p>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400">© 2026 Arcio · Built by one developer</p>
          <div className="flex gap-4 text-xs font-medium">
            <Link to="/terms" className="text-stone-500 hover:text-stone-900 transition-colors">Terms of Service</Link>
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 transition-colors font-semibold">Create Account →</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
