import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
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
          <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-[11px] font-bold uppercase tracking-widest rounded-full border border-stone-200 mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Terms of Service</h1>
          <p className="text-stone-400 mt-3 text-sm">
            Last updated: June 29, 2026 · Effective immediately
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-10 text-sm text-stone-600 leading-relaxed">
          
          {/* Section */}
          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using Arcio ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">2</span>
              Description of Service
            </h2>
            <p>
              Arcio is an AI-powered developer platform that helps software engineers discover project ideas, analyze portfolios, track market trends, and connect with the developer community. The Service is currently in beta and provided free of charge during this period.
            </p>
            <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl p-4">
              <p className="font-semibold text-stone-800 mb-2">Core features include:</p>
              <ul className="space-y-1.5 list-none">
                {[
                  'AI-powered idea generation based on your tech stack',
                  'GitHub repository analysis and portfolio insights',
                  'Developer community posts and discussions',
                  'Market pulse and tech trend tracking',
                  'Personalized developer profile and settings',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">3</span>
              User Accounts
            </h2>
            <p>
              To access protected features, you must create an account using Clerk authentication. You are responsible for:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Maintaining the confidentiality of your account credentials',
                'All activities that occur under your account',
                'Providing accurate and complete profile information',
                'Notifying us immediately of any unauthorized account access',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">4</span>
              Acceptable Use
            </h2>
            <p>You agree not to use Arcio to:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Violate any applicable laws or regulations',
                'Upload or share content that is harmful, offensive, or infringes on intellectual property rights',
                'Attempt to reverse-engineer, scrape, or exploit the Service',
                'Impersonate another person or misrepresent your identity',
                'Spam, harass, or send unsolicited communications to other users',
                'Interfere with or disrupt the integrity or performance of the Service',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">5</span>
              Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Arcio and its creators. Content generated through AI tools based on your inputs may be used by you freely, but the underlying models, algorithms, and platform remain proprietary.
            </p>
            <p className="mt-3">
              By submitting content (posts, ideas, comments) to the community, you grant Arcio a non-exclusive, royalty-free license to display and distribute that content within the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">6</span>
              Beta Service Disclaimer
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 font-semibold mb-1 text-sm">Beta Notice</p>
              <p className="text-amber-700 text-sm">
                Arcio is currently in beta. Features may change, be removed, or be temporarily unavailable. We do not guarantee uninterrupted availability and are not liable for any data loss during the beta period. Use at your own discretion.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">7</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Arcio and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service, even if advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">8</span>
              Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">9</span>
              Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify users of material changes via email or an in-app notice. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold flex items-center justify-center">10</span>
              Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us. Arcio is an independent project built by one developer, and we're happy to address any concerns directly.
            </p>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400">© 2026 Arcio · Built by one developer</p>
          <div className="flex gap-4 text-xs font-medium">
            <Link to="/privacy" className="text-stone-500 hover:text-stone-900 transition-colors">Privacy Policy</Link>
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 transition-colors font-semibold">Create Account →</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
