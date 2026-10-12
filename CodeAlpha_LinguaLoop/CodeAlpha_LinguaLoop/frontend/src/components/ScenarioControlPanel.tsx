import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { Sliders, Play, Pause, RotateCcw, Zap, AlertOctagon, Radio, ShieldAlert } from 'lucide-react';

export const ScenarioControlPanel: React.FC = () => {
  const telemetry = useMissionStore((state) => state.telemetry);
  const isSimulating = useMissionStore((state) => state.isSimulating);
  const stepSimulation = useMissionStore((state) => state.stepSimulation);
  const toggleSimulation = useMissionStore((state) => state.toggleSimulation);
  const resetSimulation = useMissionStore((state) => state.resetSimulation);
  const applyOverride = useMissionStore((state) => state.applyOverride);
  const loadPreset = useMissionStore((state) => state.loadPreset);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSimulating) {
      interval = setInterval(() => {
        stepSimulation();
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, stepSimulation]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 font-mono">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          SCENARIO & WHAT-IF CONTROLS
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={stepSimulation}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xs border border-neutral-700 flex items-center gap-1 transition-colors"
          >
            Step +1
          </button>
          <button
            onClick={toggleSimulation}
            className={`px-3 py-1 text-xs rounded-xs font-bold border flex items-center gap-1 transition-colors ${
              isSimulating
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isSimulating ? 'PAUSE' : 'RUN LIVE'}
          </button>
          <button
            onClick={resetSimulation}
            className="p-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xs border border-neutral-700 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="mb-4">
        <span className="text-[10px] uppercase text-neutral-400 block mb-2">PRESET DEMO SCENARIOS</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => loadPreset('SEARCH_AND_RESCUE')}
            className="px-2 py-1.5 bg-black/40 hover:bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 rounded-xs text-left truncate transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Search & Rescue</span>
          </button>
          <button
            onClick={() => loadPreset('HAZARD_BLOCKADE')}
            className="px-2 py-1.5 bg-black/40 hover:bg-amber-950/40 border border-amber-800/40 text-amber-300 rounded-xs text-left truncate transition-colors flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Hazard Blockade</span>
          </button>
          <button
            onClick={() => loadPreset('COMMUNICATION_COLLAPSE')}
            className="px-2 py-1.5 bg-black/40 hover:bg-purple-950/40 border border-purple-800/40 text-purple-300 rounded-xs text-left truncate transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>Comm Collapse</span>
          </button>
          <button
            onClick={() => loadPreset('BATTERY_DRAIN')}
            className="px-2 py-1.5 bg-black/40 hover:bg-red-950/40 border border-red-800/40 text-red-300 rounded-xs text-left truncate transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3 h-3 text-red-400 flex-shrink-0" />
            <span>Battery Drain</span>
          </button>
        </div>
      </div>

      {/* Interactive Parameter Sliders */}
      <div className="space-y-3 bg-black/40 border border-neutral-800 p-3 rounded-sm text-xs">
        <div>
          <div className="flex justify-between text-neutral-300 mb-1">
            <span>Battery Override</span>
            <span className="font-bold text-white">{telemetry.battery.toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={telemetry.battery}
            onChange={(e) => applyOverride(parseFloat(e.target.value), undefined, undefined)}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-neutral-300 mb-1">
            <span>Sensor Health Override</span>
            <span className="font-bold text-white">{telemetry.sensor_health.toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={telemetry.sensor_health}
            onChange={(e) => applyOverride(undefined, parseFloat(e.target.value), undefined)}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-neutral-300 mb-1">
            <span>Signal Quality Override</span>
            <span className="font-bold text-white">{telemetry.communication_quality.toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={telemetry.communication_quality}
            onChange={(e) => applyOverride(undefined, undefined, parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
};
