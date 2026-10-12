import React from 'react';
import type { ComponentHealth } from '../../types/elevator';
import { Cpu, Activity, Thermometer, ArrowRight } from 'lucide-react';

interface ComponentHealthGridProps {
  components: ComponentHealth[];
  onSelectComponent: (component: ComponentHealth) => void;
}

export const ComponentHealthGrid: React.FC<ComponentHealthGridProps> = ({
  components,
  onSelectComponent
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>DIGITAL TWIN SUBSYSTEM INSPECTOR</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Component Health & Risk Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live telemetry progress indicators & predictive failure diagnostics across all 7 core elevator subsystems.
          </p>
        </div>
      </div>

      {/* Grid of 7 Component Cards Required by Section 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((comp) => {
          const isHighRisk = comp.risk === 'High';
          const isMedRisk = comp.risk === 'Medium';

          return (
            <div 
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer group glass-panel-hover ${
                isHighRisk 
                  ? 'border-red-500/40 hover:border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.15)]' 
                  : isMedRisk 
                  ? 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)]' 
                  : 'border-cyan-500/20 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.15)]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${isHighRisk ? 'bg-red-500 animate-ping' : isMedRisk ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <h3 className="font-bold text-white font-mono text-base group-hover:text-cyan-300 transition-colors">
                      {comp.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Subsystem ID: #{comp.id.toUpperCase()}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                  isHighRisk 
                    ? 'bg-red-950/60 border-red-500/50 text-red-300' 
                    : isMedRisk 
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
                    : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                }`}>
                  {comp.health}% Healthy
                </span>
              </div>

              {/* Progress Indicator Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Component Health</span>
                  <span className={`font-bold ${isHighRisk ? 'text-red-400' : isMedRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {comp.health} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isHighRisk ? 'bg-red-500 glow-red' : isMedRisk ? 'bg-amber-400 glow-amber' : 'bg-emerald-400 glow-emerald'
                    }`}
                    style={{ width: `${comp.health}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Risk Level</span>
                  <span className={`text-xs font-bold font-mono ${isHighRisk ? 'text-red-400' : isMedRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {comp.risk}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Fail Prob.</span>
                  <span className="text-xs font-bold font-mono text-cyan-300">
                    {comp.failureProbability}%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Est. RUL</span>
                  <span className="text-xs font-bold font-mono text-blue-300">
                    {comp.predictedRULMonths} Mos
                  </span>
                </div>
              </div>

              {/* Telemetry Preview Pill */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{comp.currentTemp}°C</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>{comp.vibrationLevel} mm/s</span>
                </div>
                <div className="flex items-center space-x-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span className="text-[10px]">Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
