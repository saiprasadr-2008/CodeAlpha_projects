import React, { useState } from 'react';
import type { CourseData, Scenario, ScenarioOption } from '../types/language';
import type { CourseProgress } from '../services/storageService';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Compass,
  Trophy,
  Info,
} from 'lucide-react';

interface ScenarioPracticeViewProps {
  course: CourseData;
  progress: CourseProgress;
  onMarkScenarioCompleted: (scenarioId: string) => void;
  targetSpeechCode: string;
}

export const ScenarioPracticeView: React.FC<ScenarioPracticeViewProps> = ({
  course,
  progress,
  onMarkScenarioCompleted,
  targetSpeechCode,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [dialogueHistory, setDialogueHistory] = useState<Array<{
    speaker: string;
    avatar: string;
    messageTarget: string;
    messagePhonetic?: string;
    messageTranslation: string;
    userReplyText?: string;
    userReplyTranslation?: string;
    feedback?: string;
    quality?: 'best' | 'acceptable' | 'inappropriate';
  }>>([]);
  const [isScenarioFinished, setIsScenarioFinished] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const activeScenario: Scenario | undefined = course.scenarios.find(
    (s) => s.id === activeScenarioId
  );

  const startScenario = (scenario: Scenario) => {
    setActiveScenarioId(scenario.id);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setDialogueHistory([]);
    setIsScenarioFinished(false);
  };

  const handleSelectOption = (option: ScenarioOption) => {
    if (selectedOption || !activeScenario) return;
    setSelectedOption(option);

    if (option.quality === 'best') {
      speechService.playCorrectSound();
    } else if (option.quality === 'acceptable') {
      speechService.playFlipSound();
    } else {
      speechService.playWrongSound();
    }
  };

  const handleContinueNextStep = () => {
    if (!activeScenario || !selectedOption) return;

    const currentStep = activeScenario.steps[currentStepIndex];

    // Append to dialogue history
    setDialogueHistory((prev) => [
      ...prev,
      {
        speaker: currentStep.speaker,
        avatar: currentStep.avatar,
        messageTarget: currentStep.messageTarget,
        messagePhonetic: currentStep.messagePhonetic,
        messageTranslation: currentStep.messageTranslation,
        userReplyText: selectedOption.text,
        userReplyTranslation: selectedOption.translation,
        feedback: selectedOption.feedback,
        quality: selectedOption.quality,
      },
    ]);

    // Check if more steps exist
    if (currentStepIndex + 1 < activeScenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Completed scenario!
      setIsScenarioFinished(true);
      onMarkScenarioCompleted(activeScenario.id);
      speechService.playCompletionFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePlayInterlocutorAudio = async (text: string) => {
    setSpeakingText(text);
    await speechService.speak(text, targetSpeechCode);
    setSpeakingText(null);
  };

  // 1. SCENARIO CATALOG SELECTION VIEW
  if (!activeScenario) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Signature Feature
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Real-Life Conversation Scenarios
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Practice realistic conversational exchanges with native interlocutors. Choose your responses wisely and receive immediate cultural etiquette, tone, and grammar feedback.
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {course.scenarios.map((scenario) => {
            const isCompleted = progress.completedScenarioIds.includes(scenario.id);

            return (
              <div
                key={scenario.id}
                className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-900/80 border-teal-500/40 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Avatar and Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner">
                      {scenario.interlocutorAvatar}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {scenario.difficulty}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {scenario.description}
                  </p>

                  {/* Character Info */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
                    <span className="text-xs text-slate-400">Interlocutor:</span>
                    <strong className="text-xs text-slate-200">{scenario.interlocutorName}</strong>
                    <span className="text-[10px] text-teal-400 ml-auto font-medium">
                      ({scenario.interlocutorRole})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => startScenario(scenario)}
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-xs shadow-md transition"
                >
                  <span>{isCompleted ? 'Practice Again' : 'Start Scenario'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. SCENARIO COMPLETED SCREEN
  if (isScenarioFinished) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl animate-fadeIn">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Scenario Concluded
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">{activeScenario.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            You successfully navigated this real-life conversation simulation with {activeScenario.interlocutorName}.
          </p>
        </div>

        {/* Cultural Context Takeaway */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wide">
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Cultural Etiquette Takeaway</span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            {activeScenario.culturalContext}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => startScenario(activeScenario)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4 text-teal-400" />
            <span>Replay Scenario</span>
          </button>

          <button
            onClick={() => setActiveScenarioId(null)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-xs font-bold hover:from-indigo-500 hover:to-teal-400 transition shadow-md"
          >
            <span>Back to All Scenarios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE SCENARIO SIMULATION INTERFACE
  const currentStep = activeScenario.steps[currentStepIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveScenarioId(null)}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>← Back to Scenarios</span>
        </button>

        <div className="text-right">
          <h3 className="text-sm font-bold text-white">{activeScenario.title}</h3>
          <span className="text-[11px] text-teal-400 font-medium">
            Step {currentStepIndex + 1} of {activeScenario.steps.length}
          </span>
        </div>
      </div>

      {/* Cultural Etiquette Context Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-300">Setting: </strong>
          {activeScenario.culturalContext}
        </div>
      </div>

      {/* Past Dialogue History Messages */}
      {dialogueHistory.length > 0 && (
        <div className="space-y-4 pt-2">
          {dialogueHistory.map((item, idx) => (
            <div key={`hist-${idx}`} className="space-y-2 opacity-75">
              {/* Native Speaker Message */}
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{item.avatar}</span>
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 max-w-lg">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                    {item.speaker}
                  </span>
                  <p className="text-sm font-bold text-white">{item.messageTarget}</p>
                  <p className="text-xs text-slate-400 italic mt-0.5">{item.messageTranslation}</p>
                </div>
              </div>

              {/* User Selected Reply */}
              {item.userReplyText && (
                <div className="flex justify-end pr-2">
                  <div className="p-3.5 rounded-2xl bg-indigo-900/40 border border-indigo-500/30 max-w-lg text-right">
                    <span className="text-[10px] font-bold text-indigo-300 block mb-0.5">You</span>
                    <p className="text-sm font-bold text-teal-300">{item.userReplyText}</p>
                    <p className="text-xs text-slate-400 italic mt-0.5">{item.userReplyTranslation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CURRENT ACTIVE STEP: Interlocutor Message Bubble */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {currentStep.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">{currentStep.speaker}</span>
                <span className="text-xs text-slate-400 ml-2">({currentStep.speakerRole})</span>
              </div>

              {/* TTS Listen Button */}
              <button
                onClick={() => handlePlayInterlocutorAudio(currentStep.messageTarget)}
                aria-label={`Listen to ${currentStep.speaker}`}
                className={`p-2 rounded-xl border transition ${
                  speakingText === currentStep.messageTarget
                    ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-teal-400 border-slate-700'
                }`}
                title="Hear native speaker (Web Speech API)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Target Language Bubble */}
            <div className="mt-3 p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
              <p className="text-base sm:text-lg font-bold text-teal-300 leading-relaxed font-sans">
                {currentStep.messageTarget}
              </p>
              {currentStep.messagePhonetic && (
                <p className="text-xs font-mono text-indigo-300">🗣️ {currentStep.messagePhonetic}</p>
              )}
              <p className="text-xs text-slate-400 italic pt-1">{currentStep.messageTranslation}</p>
            </div>
          </div>
        </div>

        {/* USER RESPONSE CHOICES */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Choose your response:
          </span>

          {currentStep.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;

            let buttonStyle = 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500';

            if (selectedOption) {
              if (isSelected) {
                if (opt.quality === 'best') {
                  buttonStyle = 'bg-teal-500/20 border-teal-500 text-teal-200 font-bold ring-1 ring-teal-500';
                } else if (opt.quality === 'acceptable') {
                  buttonStyle = 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold';
                } else {
                  buttonStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                }
              } else {
                buttonStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                disabled={Boolean(selectedOption)}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 rounded-xl border text-sm font-semibold transition text-left flex flex-col gap-1 ${buttonStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{opt.text}</span>
                  {selectedOption && isSelected && (
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                        opt.quality === 'best'
                          ? 'bg-teal-500/30 text-teal-300'
                          : opt.quality === 'acceptable'
                          ? 'bg-amber-500/30 text-amber-300'
                          : 'bg-rose-500/30 text-rose-300'
                      }`}
                    >
                      {opt.quality === 'best'
                        ? 'Best Match'
                        : opt.quality === 'acceptable'
                        ? 'Acceptable'
                        : 'Awkward / Inappropriate'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 italic">{opt.translation}</span>
              </button>
            );
          })}
        </div>

        {/* CULTURAL ETIOUETTE / FEEDBACK BOX */}
        {selectedOption && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
              selectedOption.quality === 'best'
                ? 'bg-teal-950/40 border-teal-500/40 text-teal-200'
                : selectedOption.quality === 'acceptable'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption.quality === 'best' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  <span>Culturally Appropriate & Natural</span>
                </>
              ) : selectedOption.quality === 'acceptable' ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Understandable, but has nuances</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Cultural Faux Pas / Inappropriate Tone</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed opacity-95 pl-7">
              {selectedOption.feedback}
            </p>
          </div>
        )}

        {/* Continue to Next Step Button */}
        {selectedOption && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleContinueNextStep}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm shadow-md transition"
            >
              <span>
                {currentStepIndex + 1 < activeScenario.steps.length
                  ? 'Continue Dialogue'
                  : 'Complete Scenario'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
