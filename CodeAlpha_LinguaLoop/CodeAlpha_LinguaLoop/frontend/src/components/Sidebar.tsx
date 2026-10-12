import React from 'react';
import type { ViewTab } from '../types/language';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Sparkles,
  MessageSquare,
  BarChart3,
  Trophy,
  Settings,
  Languages,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenLanguageSelector: () => void;
  courseTitle: string;
  sourceFlag: string;
  targetFlag: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenAchievements,
  onOpenSettings,
  onOpenLanguageSelector,
  courseTitle,
  sourceFlag,
  targetFlag,
}) => {
  const navItems: Array<{ id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lessons', label: 'Daily Lessons', icon: BookOpen },
    { id: 'vocabulary', label: 'Flashcards', icon: Layers },
    { id: 'practice', label: 'Quiz Practice', icon: Sparkles },
    { id: 'scenarios', label: 'Real-Life Scenarios', icon: MessageSquare },
    { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-100 min-h-screen select-none shrink-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Languages className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-teal-300 bg-clip-text text-transparent">
              LinguaLoop
            </h1>
            <p className="text-xs text-slate-400 font-medium">Practice Real Conversations</p>
          </div>
        </div>

        {/* Current Active Course Quick Card */}
        <button
          onClick={onOpenLanguageSelector}
          className="mt-4 w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group text-left"
          title="Click to switch language course"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{sourceFlag}</span>
            <span className="text-xs text-slate-400">➔</span>
            <span className="text-lg">{targetFlag}</span>
            <span className="text-xs font-semibold text-slate-200 truncate ml-1">{courseTitle}</span>
          </div>
          <span className="text-xs text-teal-400 group-hover:text-teal-300 font-medium shrink-0 ml-1">Change</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>{item.label}</span>
              {item.id === 'scenarios' && (
                <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Signature
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions: Achievements, Settings */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenAchievements}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Achievements & Badges</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings & Goal</span>
        </button>
      </div>
    </aside>
  );
};
