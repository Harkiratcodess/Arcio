import React, { useState } from "react";

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "analyzer",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
    title: "GitHub Repo Analyzer",
    description:
      "Paste any GitHub URL and receive a comprehensive analysis — code quality scoring, architecture review, naming conventions, and specific improvement suggestions.",
    visual: (
      <div className="rounded-2xl bg-stone-950 p-6 font-mono text-xs shadow-2xl w-full">
        <div className="flex gap-1.5 mb-4 pb-3 border-b border-stone-800">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-stone-600 text-[10px]">
            portfolioiq — analyze
          </span>
        </div>
        <div className="space-y-3 text-stone-400">
          <div>
            <span className="text-stone-500">$ </span>
            <span className="text-teal-400">portfolioiq</span>
            <span className="text-stone-300"> analyze github.com/user/app</span>
          </div>
          <div className="pl-2 space-y-2.5 pt-1">
            <div className="flex justify-between">
              <span>
                <span className="text-teal-400">✓</span> Component tree —{" "}
                <span className="text-stone-300">42 components</span>
              </span>
              <span className="text-stone-600">89ms</span>
            </div>
            <div className="flex justify-between">
              <span>
                <span className="text-teal-400">✓</span> State management —{" "}
                <span className="text-stone-300">Context + hooks</span>
              </span>
              <span className="text-stone-600">34ms</span>
            </div>
            <div className="flex justify-between">
              <span>
                <span className="text-amber-400">⚠</span> Prop drilling —{" "}
                <span className="text-amber-300">3 instances</span>
              </span>
              <span className="text-stone-600">Provider.tsx</span>
            </div>
            <div className="flex justify-between">
              <span>
                <span className="text-teal-400">✓</span> Test coverage —{" "}
                <span className="text-stone-300">78%</span>
              </span>
              <span className="text-stone-600">12ms</span>
            </div>
            <div className="flex justify-between">
              <span>
                <span className="text-teal-400">✓</span> README quality —{" "}
                <span className="text-stone-300">Excellent</span>
              </span>
              <span className="text-stone-600">5ms</span>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-stone-800 flex justify-between items-center">
            <span className="text-stone-300 font-semibold">Overall Score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: "92%" }}
                />
              </div>
              <span className="text-teal-400 font-bold text-sm">92/100</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ideas",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>
    ),
    title: "Project Idea Engine",
    description:
      "Stop building todo apps. Get AI-generated project ideas tailored to your exact stack, experience level, and target role — refreshed weekly.",
    visual: (
      <div className="rounded-2xl bg-white border border-stone-200 shadow-2xl w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <span className="text-sm font-semibold text-stone-800">
              Projects For You
            </span>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Based on your React + Node.js profile
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-100">
              React
            </span>
            <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-stone-100 text-stone-600">
              Node.js
            </span>
          </div>
        </div>
        <div className="divide-y divide-stone-50">
          {[
            {
              name: "Real-time Markdown Collab Editor",
              diff: "Intermediate",
              match: "94%",
              tags: ["React", "Socket.io"],
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              name: "AI Resume Parser with Feedback",
              diff: "Advanced",
              match: "89%",
              tags: ["Node.js", "OpenAI"],
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              name: "GitHub PR Review Dashboard",
              diff: "Intermediate",
              match: "86%",
              tags: ["React", "GitHub API"],
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              name: "CLI Portfolio Generator",
              diff: "Beginner",
              match: "82%",
              tags: ["Node.js", "CLI"],
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-[13px] font-semibold text-stone-800 group-hover:text-teal-700 transition-colors truncate">
                  {p.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-stone-400">{p.diff}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-200" />
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${p.bg} ${p.color}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-sm font-bold ${p.color}`}>
                  {p.match}
                </span>
                <span className="text-[9px] text-stone-400">match</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[10px] text-stone-400">
            Refreshes every Monday with new ideas
          </span>
          <button className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors">
            View all →
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "market",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
    title: "Market Intelligence",
    description:
      "Real-time skill trends scraped weekly from actual job postings. Know what employers are hiring for right now — not last year.",
    visual: (
      <div className="rounded-2xl bg-white border border-stone-100 shadow-2xl w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              Skill Demand Index
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Scraped from 2,400+ postings · Updated Monday
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-700">
              Live
            </span>
          </div>
        </div>
        <div className="flex border-b border-stone-100">
          <div className="flex-1 py-2.5 text-center text-[11px] font-semibold text-teal-600 border-b-2 border-teal-500 bg-teal-50/40">
            📈 Rising
          </div>
          <div className="flex-1 py-2.5 text-center text-[11px] font-medium text-stone-400">
            📉 Falling
          </div>
        </div>
        <div className="px-5 py-4 space-y-4">
          {[
            {
              name: "TypeScript",
              jobs: "18.4k",
              change: "+14%",
              bar: 92,
              hot: true,
            },
            {
              name: "Next.js App Router",
              jobs: "12.1k",
              change: "+22%",
              bar: 76,
              hot: true,
            },
            {
              name: "Tailwind CSS",
              jobs: "9.8k",
              change: "+8%",
              bar: 64,
              hot: false,
            },
            {
              name: "React Server Components",
              jobs: "7.2k",
              change: "+31%",
              bar: 52,
              hot: true,
            },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-stone-300 w-4 flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-stone-800">
                      {s.name}
                    </span>
                    {s.hot && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-500 border border-orange-100">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400">
                      {s.jobs} jobs
                    </span>
                    <span className="text-[11px] font-bold text-teal-600">
                      {s.change}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
                    style={{ width: `${s.bar}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-5 mb-5 rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-3.5 h-3.5 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-teal-800">
              Insight for you
            </p>
            <p className="text-[10px] text-teal-700 mt-0.5 leading-relaxed">
              TypeScript is in 88% of React job postings this week. Adding it to
              your projects could increase match rate by 34%.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "benchmark",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
    title: "Community Benchmarking",
    description:
      "See your percentile rank among developers at your exact level. Know what the top 10% are doing differently.",
    visual: (
      <div className="rounded-2xl bg-white border border-stone-200 shadow-2xl w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-900">Leaderboard</p>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Junior React Developers · This Month
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-teal-50 border border-teal-100">
            <span className="text-[11px] font-bold text-teal-700">
              You're Top 12%
            </span>
          </div>
        </div>
        <div className="divide-y divide-stone-50">
          {[
            {
              rank: 1,
              name: "Arjun S.",
              score: 97,
              badge: "🥇",
              stack: "React · TS · Node",
              you: false,
            },
            {
              rank: 2,
              name: "Priya N.",
              score: 94,
              badge: "🥈",
              stack: "Next.js · Prisma",
              you: false,
            },
            {
              rank: 3,
              name: "Rohan M.",
              score: 91,
              badge: "🥉",
              stack: "React · GraphQL",
              you: false,
            },
            {
              rank: "...",
              name: null,
              score: null,
              badge: null,
              stack: null,
              you: false,
            },
            {
              rank: 847,
              name: "You",
              score: 82,
              badge: null,
              stack: "React · Node.js",
              you: true,
            },
          ].map((row, i) =>
            row.name === null ? (
              <div key={i} className="px-5 py-2 flex items-center">
                <span className="text-stone-300 text-sm font-medium mx-auto">
                  · · ·
                </span>
              </div>
            ) : (
              <div
                key={i}
                className={`px-5 py-3.5 flex items-center gap-4 transition-colors ${
                  row.you
                    ? "bg-teal-50/60 border-l-2 border-teal-500"
                    : "hover:bg-stone-50"
                }`}
              >
                <div className="w-8 flex-shrink-0 text-center">
                  {row.badge ? (
                    <span className="text-base">{row.badge}</span>
                  ) : (
                    <span className="text-[12px] font-bold text-stone-400">
                      #{row.rank}
                    </span>
                  )}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                    row.you
                      ? "bg-teal-500 text-white"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {row.you
                    ? "ME"
                    : (row.name as string)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[13px] font-semibold ${row.you ? "text-teal-700" : "text-stone-800"}`}
                  >
                    {row.name}{" "}
                    {row.you && (
                      <span className="text-[10px] font-normal text-teal-500">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {row.stack}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm font-bold ${row.you ? "text-teal-600" : "text-stone-700"}`}
                  >
                    {row.score}
                  </p>
                  <p className="text-[9px] text-stone-400">score</p>
                </div>
              </div>
            ),
          )}
        </div>
        <div className="mx-5 mb-5 mt-4 rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
          <p className="text-[11px] font-semibold text-stone-700 mb-2">
            🔍 What Top 10% do differently
          </p>
          <div className="space-y-1.5">
            {[
              "Write comprehensive README files",
              "Use TypeScript in every project",
              "Add tests with 70%+ coverage",
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                <span className="text-[10px] text-stone-500">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

const Features: React.FC = () => {
  const [active, setActive] = useState<number>(0);

  return (
    <section
      id="features"
      className="relative py-28 bg-[#fafaf8] overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-16">
          <span className="text-teal-600 text-xs font-bold tracking-[0.2em] uppercase">
            Features
          </span>
          <h2 className="mt-3 text-4xl font-bold text-stone-900 tracking-tight">
            Everything You Need to Stand Out
          </h2>
          <p className="mt-4 text-lg text-stone-500 leading-relaxed">
            Four powerful tools that give you the unfair advantage every
            developer needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-2">
            {features.map((feature, i) => (
              <button
                key={feature.id}
                onMouseEnter={() => setActive(i)}
                className={`w-full text-left rounded-xl p-5 transition-all duration-300 group ${
                  active === i
                    ? "bg-stone-50 border border-stone-200 shadow-sm"
                    : "bg-transparent border border-transparent hover:bg-stone-50/60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      active === i
                        ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                        : "bg-stone-100 text-stone-400 group-hover:bg-stone-200 group-hover:text-stone-600"
                    }`}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-[15px] font-semibold transition-colors duration-200 ${
                        active === i
                          ? "text-stone-900"
                          : "text-stone-500 group-hover:text-stone-700"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        active === i
                          ? "max-h-32 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[13px] text-stone-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {active === i && (
                    <div className="w-1 h-8 rounded-full bg-teal-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="relative" style={{ minHeight: "420px" }}>
              {features.map((feature, i) => (
                <div
                  key={feature.id}
                  className={`transition-all duration-500 ease-out ${
                    active === i
                      ? "opacity-100 translate-y-0 relative pointer-events-auto"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                >
                  {feature.visual}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
