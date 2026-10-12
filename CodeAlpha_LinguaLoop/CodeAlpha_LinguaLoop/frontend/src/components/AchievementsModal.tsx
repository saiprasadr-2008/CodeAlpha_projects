import React from 'react';
import type { Achievement } from '../types/language';
import {
  X,
  Trophy,
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  MessageSquare,
  Compass,
  Flame,
  Target,
  Lock,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => Boolean(a.unlockedAt)).length;

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Achievements & Badges</h2>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close achievements modal"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {achievements.map((ach) => {
              const isUnlocked = Boolean(ach.unlockedAt);

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 transition ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-800/40 border-slate-800 opacity-60'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-inner'
                        : 'bg-slate-800 text-slate-600 border-slate-700'
                    }`}
                  >
                    {isUnlocked ? getAchievementIcon(ach.icon) : <Lock className="w-5 h-5" />}
                  </div>

                  {/* Badge Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30 shrink-0">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isUnlocked
                              ? 'bg-gradient-to-r from-amber-400 to-teal-400'
                              : 'bg-slate-700'
                          }`}
                          style={{
                            width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
