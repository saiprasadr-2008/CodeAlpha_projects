import React, { useState } from 'react';
import type { LanguageCode } from '../types/language';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { getCourse, isCourseVerified } from '../data/courses/registry';
import { X, Check, Globe, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSource: LanguageCode;
  currentTarget: LanguageCode;
  onSelectCourse: (source: LanguageCode, target: LanguageCode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentSource,
  currentTarget,
  onSelectCourse,
}) => {
  const [selectedSource, setSelectedSource] = useState<LanguageCode>(currentSource);
  const [selectedTarget, setSelectedTarget] = useState<LanguageCode>(currentTarget);

  if (!isOpen) return null;

  const languagesList = Object.values(SUPPORTED_LANGUAGES);
  const activeCourse = getCourse(selectedSource, selectedTarget);
  const verified = isCourseVerified(selectedSource, selectedTarget);

  const handleApply = () => {
    if (selectedSource === selectedTarget) {
      alert('Source and target languages must be different.');
      return;
    }
    if (!verified) {
      alert('Please select a course with a verified dataset.');
      return;
    }
    onSelectCourse(selectedSource, selectedTarget);
    onClose();
  };

  const quickPicks: Array<{ source: LanguageCode; target: LanguageCode; title: string; badge: string }> = [
    { source: 'en', target: 'es', title: 'English ➔ Spanish', badge: 'Full Course (6 Scenarios)' },
    { source: 'en', target: 'hi', title: 'English ➔ Hindi', badge: 'Devanagari + Audio' },
    { source: 'en', target: 'ta', title: 'English ➔ Tamil', badge: 'Tamil Script + Audio' },
    { source: 'en', target: 'fr', title: 'English ➔ French', badge: 'Verified Starter' },
    { source: 'en', target: 'ja', title: 'English ➔ Japanese', badge: 'Kana + Romaji' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Choose Your Language Course</h2>
              <p className="text-xs text-slate-400">Select source language and target language to study</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Verified Course Picks */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
              Verified Featured Courses
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickPicks.map((pick) => {
                const isCurrent = pick.source === selectedSource && pick.target === selectedTarget;
                const sourceLang = SUPPORTED_LANGUAGES[pick.source];
                const targetLang = SUPPORTED_LANGUAGES[pick.target];
                return (
                  <button
                    key={`${pick.source}-${pick.target}`}
                    onClick={() => {
                      setSelectedSource(pick.source);
                      setSelectedTarget(pick.target);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mt-0.5">
                      {sourceLang.flag} {targetLang.flag}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-100">{pick.title}</span>
                        {isCurrent && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] font-medium text-teal-400 block mt-0.5">{pick.badge}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* Source Language */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">I speak (Source Language):</label>
              <div className="space-y-1.5">
                {languagesList.map((lang) => (
                  <button
                    key={`src-${lang.code}`}
                    onClick={() => setSelectedSource(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition ${
                      selectedSource === lang.code
                        ? 'bg-indigo-600/20 border-indigo-500 font-bold text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-xs text-slate-400 font-normal">({lang.nativeName})</span>
                    </span>
                    {selectedSource === lang.code && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Language */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">I want to learn (Target Language):</label>
              <div className="space-y-1.5">
                {languagesList.map((lang) => (
                  <button
                    key={`tgt-${lang.code}`}
                    onClick={() => setSelectedTarget(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition ${
                      selectedTarget === lang.code
                        ? 'bg-teal-600/20 border-teal-500 font-bold text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-xs text-slate-400 font-normal">({lang.nativeName})</span>
                    </span>
                    {selectedTarget === lang.code && <Check className="w-4 h-4 text-teal-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Course Status Banner */}
          <div className="pt-2">
            {verified && activeCourse ? (
              <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-teal-200">{activeCourse.title} — Verified Dataset Ready</h4>
                  <p className="text-xs text-teal-300/80 mt-0.5">{activeCourse.description}</p>
                  <div className="flex gap-4 mt-2 text-[11px] font-medium text-teal-300">
                    <span>✓ {activeCourse.lessons.length} Curated Lessons</span>
                    <span>✓ {activeCourse.vocabulary.length} Flashcards</span>
                    <span>✓ {activeCourse.scenarios.length} Real-Life Scenarios</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-200">Dataset Verification in Progress</h4>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    To comply with academic standards, LinguaLoop only serves certified, verified datasets and never invents unverified machine translations. Please choose one of the verified pairings above (e.g. English to Spanish, Hindi, or Tamil).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Note: Switching courses will preserve your existing progress in other courses.
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!verified || selectedSource === selectedTarget}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                verified && selectedSource !== selectedTarget
                  ? 'bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
