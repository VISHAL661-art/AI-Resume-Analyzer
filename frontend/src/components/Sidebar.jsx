import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileSearch, User, Settings, Sparkles } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Resume', path: '/upload', icon: UploadCloud },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 hidden lg:flex flex-col min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1.5 flex-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/10 text-indigo-400 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">Rule-Based ATS Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          Compare resumes against target job descriptions with instant feedback on skill gap & score.
        </p>
        <NavLink
          to="/upload"
          className="block w-full py-1.5 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/30"
        >
          New Analysis
        </NavLink>
      </div>
    </aside>
  );
};
