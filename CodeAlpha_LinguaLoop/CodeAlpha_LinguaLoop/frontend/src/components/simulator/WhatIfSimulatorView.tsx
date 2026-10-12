import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Sliders, Zap, Wrench, RefreshCw } from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<'repair' | 'upgrade' | 'replace'>('upgrade');
  const [budgetMultiplier, setBudgetMultiplier] = useState<number>(100);
  const [targetYears, setTargetYears] = useState<number>(10);

  // Dynamic simulation calculations
  const getSimulationMetrics = () => {
    if (selectedStrategy === 'repair') {
      return {
        reliability: Math.min(95, Math.round(14 * (budgetMultiplier / 100))),
        expectedLifeYears: Math.min(3, Math.round(1.5 * (targetYears / 5))),
        downtimeDays: 0.5,
        costReductionPct: 15,
        energyEfficiencyPct: 5,
        estCost: `$${(3200 * (budgetMultiplier / 100)).toLocaleString()}`
      };
    }
    if (selectedStrategy === 'upgrade') {
      return {
        reliability: Math.min(98, Math.round(38 * (budgetMultiplier / 100))),
        expectedLifeYears: Math.min(12, Math.round(8 * (targetYears / 8))),
        downtimeDays: 2.0,
        costReductionPct: 45,
        energyEfficiencyPct: 28,
        estCost: `$${(15500 * (budgetMultiplier / 100)).toLocaleString()}`
      };
    }
    return {
      reliability: Math.min(99, Math.round(48 * (budgetMultiplier / 100))),
      expectedLifeYears: Math.min(25, Math.round(20 * (targetYears / 10))),
      downtimeDays: 14.0,
      costReductionPct: 65,
      energyEfficiencyPct: 35,
      estCost: `$${(88000 * (budgetMultiplier / 100)).toLocaleString()}`
    };
  };

  const metrics = getSimulationMetrics();

  // Recharts comparative dataset
  const comparisonData = [
    { name: 'Target Reliability (%)', Baseline: 64, Simulated: 64 + metrics.reliability },
    { name: 'Lifespan Gain (Yrs)', Baseline: 1.5, Simulated: metrics.expectedLifeYears },
    { name: 'Energy Savings (%)', Baseline: 0, Simulated: metrics.energyEfficiencyPct },
    { name: 'Maint. Cost Cut (%)', Baseline: 0, Simulated: metrics.costReductionPct }
  ];

  return (
    <div className="space-y-6">
      {/* Banner (Section 9 Requirement) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE SCENARIO & ROI SIMULATOR</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            What Happens If We {selectedStrategy.toUpperCase()}?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate financial outlay, operational downtime, and reliability gains under custom investment parameters.
          </p>
        </div>
      </div>

      {/* Control Panel & Preset Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Selector Buttons */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono border-b border-slate-800 pb-2">
            1. Select Modernization Strategy
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedStrategy('repair')}
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedStrategy === 'repair'
                  ? 'bg-amber-950/40 border-amber-400 text-amber-300 glow-amber'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Wrench className="w-5 h-5" />
                <div>
                  <span className="font-bold text-sm font-mono block">REPAIR</span>
                  <span className="text-[10px] text-slate-400">Patch faulty components</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedStrategy('upgrade')}
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedStrategy === 'upgrade'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 glow-cyan ring-2 ring-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="font-bold text-sm font-mono block text-cyan-300">UPGRADE (RECOMMENDED)</span>
                  <span className="text-[10px] text-slate-400">Smart VFD & Controller Modernization</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedStrategy('replace')}
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedStrategy === 'replace'
                  ? 'bg-red-950/40 border-red-400 text-red-300 glow-red'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5" />
                <div>
                  <span className="font-bold text-sm font-mono block">REPLACE</span>
                  <span className="text-[10px] text-slate-400">Complete Shaft & Car Overhaul</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Sliders Control Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-white font-mono border-b border-slate-800 pb-2">
            2. Adjust Simulation Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Slider 1: Budget Factor */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Investment Scope Factor</span>
                <span className="text-cyan-400 font-bold">{budgetMultiplier}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={budgetMultiplier}
                onChange={(e) => setBudgetMultiplier(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Est. Outlay: {metrics.estCost}</span>
            </div>

            {/* Slider 2: Target Horizon */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-mono">Target Building Lifespan</span>
                <span className="text-blue-400 font-bold">{targetYears} Years</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                value={targetYears}
                onChange={(e) => setTargetYears(Number(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Horizon goal for asset retention</span>
            </div>
          </div>

          {/* Dynamic Metrics Output Showcase (Section 9 Requirement) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">Reliability Gain</span>
              <span className="text-2xl font-black font-mono text-emerald-400">+{metrics.reliability}%</span>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">Expected Life</span>
              <span className="text-2xl font-black font-mono text-cyan-300">+{metrics.expectedLifeYears} Yrs</span>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">Est. Downtime</span>
              <span className="text-2xl font-black font-mono text-amber-300">{metrics.downtimeDays} Days</span>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">Energy Cut</span>
              <span className="text-2xl font-black font-mono text-blue-400">-{metrics.energyEfficiencyPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Comparison Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <h3 className="text-base font-bold text-white font-mono mb-2">Simulated Outcome vs Baseline Comparison</h3>
        <p className="text-xs text-slate-400 mb-4">Baseline elevator performance vs post-{selectedStrategy} projections</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#00F0FF', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="Baseline" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Simulated" fill="#00F0FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
