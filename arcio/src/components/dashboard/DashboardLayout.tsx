import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom';
import useUserSync from '../../hooks/userSync';


const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useUserSync()
  const { user } = useUser()
const { signOut } = useClerk()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  

  const navItems = [
    { name: 'Idea Engine', path: '/ideas', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
    { name: 'Analyzer', path: '/analyzer', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
    { name: 'Market', path: '/market', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
    { name: 'Community', path: '/community', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  ];

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 bg-[#F6F5F2] border-r border-[#EAE8E1] h-full shrink-0">
        <div className="p-8 flex items-center">
          <span className="text-2xl font-bold text-stone-900 tracking-tight font-serif">Arcio</span>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 relative ${isActive ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 font-medium'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-700 rounded-r-md" />}
                <span className={`${isActive ? 'text-stone-900' : 'text-stone-500'}`}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

     
        <div className="p-4 border-t border-[#EAE8E1] mt-auto space-y-1">
       
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 font-medium transition-colors">
            <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </Link>


        <button 
  onClick={() => signOut()}
  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 font-medium transition-colors mb-2">
  <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  Log out
</button>

<div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-200/50 cursor-pointer transition-colors mt-2">
  <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border border-stone-300 shrink-0">
    <img 
      src={user?.imageUrl || 'https://i.pravatar.cc/100?img=33'} 
      alt="Avatar" 
      className="w-full h-full object-cover" 
    />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-stone-900 truncate">
      {user?.fullName || user?.firstName || 'Developer'}
    </p>
    <p className="text-[10px] text-stone-500 truncate">Free Plan</p>
  </div>
</div>
        </div>
      </aside>

       <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-stone-100 bg-white z-10 shrink-0">
          
          <div className="flex items-center gap-4 flex-1">
             <div className="hidden md:flex relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" placeholder="Search architectures..." className="block w-full pl-9 pr-3 py-1.5 border border-stone-200 rounded-full text-sm bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-stone-900 hidden md:block">Idea Engine</span>
            <button className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold rounded-full shadow-sm">
              New Idea
            </button>
          </div>

        </header>

        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
          <div className="max-w-[1200px] mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
