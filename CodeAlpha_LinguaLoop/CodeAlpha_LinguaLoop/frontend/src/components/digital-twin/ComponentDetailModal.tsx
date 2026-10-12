import React from 'react';
import type { ComponentHealth } from '../../types/elevator';
import { X, Activity, Thermometer, Clock, ShieldAlert, Cpu } from 'lucide-react';

interface ComponentDetailModalProps {
  component: ComponentHealth | null;
  onClose: () => void;
  onNavigateToAI: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  onClose,
  onNavigateToAI
}) => {
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0D1527] border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">{component.name}</h3>
              <p className="text-xs text-slate-400">Digital Twin Telemetry & AI Risk Analysis</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Health & Risk Grid (Section 5 Requirements) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Health</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-xl font-extrabold font-mono ${component.health >= 85 ? 'text-emerald-400' : component.health >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                {component.health}%
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Risk Level</span>
            <span className={`text-lg font-bold font-mono inline-block mt-1 ${component.risk === 'High' ? 'text-red-400' : component.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {component.risk}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Failure Prob.</span>
            <span className="text-xl font-extrabold font-mono text-cyan-300 mt-1 block">
              {component.failureProbability}%
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Predicted RUL</span>
            <span className="text-xl font-extrabold font-mono text-blue-300 mt-1 block">
              {component.predictedRULMonths} Mos
            </span>
          </div>
        </div>

        {/* Live Telemetry Sensors (Section 5 Requirements) */}
        <div className="mb-6">
          <h4 className="text-xs font-mono text-cyan-400 uppercase mb-3 flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recent Live Sensor Telemetry</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Temperature</span>
                <span className="text-sm font-bold font-mono text-white">{component.currentTemp}°C</span>
              </div>
              <Thermometer className="w-5 h-5 text-amber-400" />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Vibration Peak</span>
                <span className="text-sm font-bold font-mono text-white">{component.vibrationLevel} mm/s</span>
              </div>
              <Activity className="w-5 h-5 text-red-400" />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between col-span-2 sm:col-span-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Cycles</span>
                <span className="text-sm font-bold font-mono text-white">{component.cycleCount.toLocaleString()}</span>
              </div>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Diagnostic Rationale */}
        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20 mb-6">
          <h4 className="text-xs font-mono text-slate-300 font-bold mb-1 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>AI Health Status Diagnostic</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{component.statusText}</p>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Last Preventative Maintenance: {component.lastMaintained}</p>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800"
          >
            Close Drawer
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToAI();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md glow-cyan"
          >
            View Full AI Predictions & XAI
          </button>
        </div>
      </div>
    </div>
  );
};
