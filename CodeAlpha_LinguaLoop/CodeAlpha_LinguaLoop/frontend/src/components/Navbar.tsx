import React from 'react';
import type { ViewTab } from '../types/language';
import {
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Globe,
  LayoutDashboard,
  BookOpen,
  Layers,
  Sparkles,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenLanguageSelector: () => void;
  sourceFlag: string;
  targetFlag: string;
  sourceLangName: string;
  targetLangName: string;
  streak: number;
  xp: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  goalCurrent: number;
  goalTarget: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenLanguageSelector,
  sourceFlag,
  targetFlag,
  sourceLangName,
  targetLangName,
  streak,
  xp,
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleTheme,
  goalCurrent,
  goalTarget,
}) => {
  const mobileNavItems: Array<{ id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'lessons', label: 'Learn', icon: BookOpen },
    { id: 'vocabulary', label: 'Cards', icon: Layers },
    { id: 'practice', label: 'Quiz', icon: Sparkles },
    { id: 'scenarios', label: 'Scenarios', icon: MessageSquare },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-sm">
        {/* Left: Mobile Brand + Language Switcher */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
              LinguaLoop
            </span>
          </div>

          {/* Language Selector Pill */}
          <button
            onClick={onOpenLanguageSelector}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition shadow-sm group"
          >
            <span className="text-base">{sourceFlag}</span>
            <span className="text-slate-400 font-mono text-[10px]">➔</span>
            <span className="text-base">{targetFlag}</span>
            <span className="hidden sm:inline text-slate-200 group-hover:text-white">
              {sourceLangName} to {targetLangName}
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-medium">Switch</span>
          </button>
        </div>

        {/* Right: Streak, XP, Daily Goal, Controls */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Daily Goal Mini Pill */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300"
            title={`Daily Goal: ${goalCurrent}/${goalTarget} activities`}
          >
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Goal:</span>
            <span className="font-bold text-teal-300">
              {goalCurrent}/{goalTarget}
            </span>
          </div>

          {/* Learning Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm"
            title={`Active Learning Streak: ${streak} ${streak === 1 ? 'day' : 'days'}`}
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>{streak}</span>
            <span className="hidden sm:inline font-normal text-amber-300/80 text-[11px]">days</span>
          </div>

          {/* XP Badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold"
            title={`Total Experience Points: ${xp} XP`}
          >
            <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span>{xp}</span>
            <span className="font-normal text-[10px] text-indigo-300/70">XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio feedback' : 'Enable audio feedback'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
            title={darkMode ? 'Dark Theme' : 'Light Theme'}
          >
            {darkMode ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors text-[10px] font-semibold ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-teal-500/20' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              </div>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
