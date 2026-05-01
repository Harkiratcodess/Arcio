import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const IdeaEngine: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)] animate-fade-in-up">
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-serif text-stone-900 tracking-tight mb-2">Curated Architectures</h1>
              <p className="text-stone-500 text-sm">Recommended projects based on your current tech stack.</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="border-b border-stone-100 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-md">98% Match</span>
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-md">Advanced</span>
              </div>
              <h2 className="text-xl font-serif text-stone-900 mb-3">Distributed Event Streaming Engine</h2>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">
                Build a high-throughput, low-latency messaging system. Implement leader election, partition replication, and an append-only log.
              </p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 text-stone-600 text-[11px] rounded-md">Go</span>
                <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 text-stone-600 text-[11px] rounded-md">gRPC</span>
                <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 text-stone-600 text-[11px] rounded-md">Raft Consensus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] h-full flex flex-col bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-stone-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Builder AI</h3>
                <p className="text-[10px] text-stone-500">Architecture Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-stone-600">
                I'm ready to help you build. Select an architecture from the Idea Engine.
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-stone-200">
            <div className="relative">
              <input type="text" placeholder="Ask about architecture, setup..." className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-full text-sm focus:outline-none" />
              <button className="absolute right-1 top-1 bottom-1 w-10 bg-teal-800 hover:bg-teal-900 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IdeaEngine;
