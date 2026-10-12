import React, { useState } from 'react';
import { decisionOptions } from '../../data/mockElevatorData';
import { Compass, Wrench, Zap, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';

export const DecisionEngineView: React.FC = () => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('upgrade');

  const getIcon = (id: string) => {
    if (id === 'repair') return <Wrench className="w-6 h-6 text-amber-400" />;
    if (id === 'upgrade') return <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />;
    return <RefreshCw className="w-6 h-6 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>PRESCRIPTIVE AI DECISION ENGINE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            What Should You Do Next?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven strategic recommendations balancing lifecycle cost, downtime, and long-term asset reliability.
          </p>
        </div>

        {/* Dynamic Recommendation Banner (Section 7 Requirement) */}
        <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-cyan-400" />
          <div>
            <span className="text-[10px] text-cyan-300 font-mono block">OPTIMAL AI RECOMMENDATION</span>
            <span className="text-xl font-black font-mono text-white tracking-wide">UPGRADE</span>
          </div>
        </div>
      </div>

      {/* Rationale Explanation Box */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-slate-950/80">
        <h3 className="text-sm font-bold text-white font-mono mb-2 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>AI Prescriptive Rationale</span>
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          “Multiple aging components (Doors 69%, VFD 73%, Brake 78%) show increasing failure probability over the next 6 to 14 months. <strong className="text-cyan-300">Upgrading the controller, VFD, and door operator</strong> can improve system reliability by <strong className="text-emerald-400">+38%</strong> and extend lifespan by 8–10 years while avoiding full elevator replacement downtime.”
        </p>
      </div>

      {/* Three Large Options Cards (Section 7 Requirements: REPAIR, UPGRADE, REPLACE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {decisionOptions.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isRecommended = opt.isRecommended;

          return (
            <div
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`glass-panel p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isRecommended
                  ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 shadow-[0_0_35px_rgba(0,240,255,0.2)]'
                  : 'border-slate-800 hover:border-slate-700'
              } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold shadow-lg flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-slate-950" />
                  <span>AI RECOMMENDED OPTION</span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                    {getIcon(opt.id)}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white font-mono">{opt.title.toUpperCase()}</h3>
                    <p className="text-xs text-slate-400">{opt.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-6 leading-relaxed">{opt.description}</p>
              </div>

              {/* Comparison Metrics */}
              <div className="space-y-2 pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Est. Cost Range</span>
                  <span className="font-bold text-white">{opt.estimatedCost}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">System Downtime</span>
                  <span className="font-bold text-amber-300">{opt.downtime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Reliability Gain</span>
                  <span className="font-bold text-emerald-400">{opt.reliabilityGain}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Extended Lifespan</span>
                  <span className="font-bold text-cyan-300">{opt.extendedLifespan}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Energy Efficiency</span>
                  <span className="font-bold text-blue-400">{opt.energySavings}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
