import React, { useState } from 'react';
import { speechService } from '../services/speechService';
import {
  X,
  Settings,
  Target,
  Volume2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: number;
  onUpdateDailyGoal: (newGoal: number) => void;
  onResetProgress: () => void;
  onSeedDemoData: () => void;
  targetSpeechCode: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  dailyGoal,
  onUpdateDailyGoal,
  onResetProgress,
  onSeedDemoData,
  targetSpeechCode,
}) => {
  const [goalInput, setGoalInput] = useState<number>(dailyGoal);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [isTestingSpeech, setIsTestingSpeech] = useState<boolean>(false);

  if (!isOpen) return null;

  const goalOptions = [3, 5, 8, 10, 15];

  const handleSaveGoal = (val: number) => {
    setGoalInput(val);
    onUpdateDailyGoal(val);
  };

  const handleTestSpeech = async () => {
    setIsTestingSpeech(true);
    await speechService.speak('¡Hola! Welcome to LinguaLoop.', targetSpeechCode);
    setIsTestingSpeech(false);
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Application Settings</h2>
              <p className="text-xs text-slate-400">Customize learning targets and preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings modal"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Daily Study Goal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" />
              <label className="text-sm font-bold text-white">Daily Study Goal Target</label>
            </div>
            <p className="text-xs text-slate-400">
              Set the number of activities (lessons, cards, quizzes, scenarios) you aim to complete each day.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {goalOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSaveGoal(opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    goalInput === opt
                      ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {opt} items / day
                </button>
              ))}
            </div>
          </div>

          {/* 2. Text-to-Speech Pronunciation Audio */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-white">Pronunciation Speech Synthesis</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by the browser’s native <strong>Web Speech API</strong>. Works completely offline with zero external API keys or server costs.
            </p>
            <button
              onClick={handleTestSpeech}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                isTestingSpeech
                  ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4 text-teal-400" />
              <span>{isTestingSpeech ? 'Speaking sample...' : 'Test Audio Pronunciation'}</span>
            </button>
          </div>

          {/* 3. Demo Data Seeding */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Seed Demo Starter Progress</span>
            </div>
            <p className="text-xs text-slate-400">
              Populate baseline progress to explore dashboard metrics, Recharts graphs, and weak words right away.
            </p>
            <button
              onClick={() => {
                onSeedDemoData();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Load Sample Progress Data</span>
            </button>
          </div>

          {/* 4. Reset Progress Option (Two-step confirmation) */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-white">Reset Application Data</span>
            </div>
            <p className="text-xs text-slate-400">
              Clear all saved streaks, lesson completions, quiz histories, and vocabulary mastery from LocalStorage.
            </p>

            {showResetConfirm ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Are you sure? This cannot be undone.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmReset}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset User Progress</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
