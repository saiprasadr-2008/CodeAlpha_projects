import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { Activity, Battery, Cpu, Radio, Gauge, Zap } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const telemetry = useMissionStore((state) => state.telemetry);
  const feasibility = useMissionStore((state) => state.feasibility);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          ROBOT & MISSION TELEMETRY
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded-xs border border-neutral-700 bg-neutral-800 text-neutral-300 uppercase">
          {telemetry.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono">
        {/* Battery */}
        <div className="bg-black/40 border border-neutral-800 p-2.5 rounded-sm">
          <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1 mb-1">
            <Battery className="w-3 h-3 text-emerald-400" /> Battery Level
          </span>
          <div className="text-xl font-bold text-white">
            {telemetry.battery.toFixed(1)}%
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-xs mt-1.5 overflow-hidden border border-neutral-800">
            <div
              className={`h-full ${telemetry.battery > 50 ? 'bg-emerald-500' : telemetry.battery > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${telemetry.battery}%` }}
            />
          </div>
        </div>

        {/* Sensor Health */}
        <div className="bg-black/40 border border-neutral-800 p-2.5 rounded-sm">
          <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1 mb-1">
            <Cpu className="w-3 h-3 text-blue-400" /> Sensor Health
          </span>
          <div className="text-xl font-bold text-white">
            {telemetry.sensor_health.toFixed(1)}%
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-xs mt-1.5 overflow-hidden border border-neutral-800">
            <div
              className={`h-full ${telemetry.sensor_health > 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
              style={{ width: `${telemetry.sensor_health}%` }}
            />
          </div>
        </div>

        {/* Signal Quality */}
        <div className="bg-black/40 border border-neutral-800 p-2.5 rounded-sm">
          <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1 mb-1">
            <Radio className="w-3 h-3 text-purple-400" /> Signal Quality
          </span>
          <div className="text-xl font-bold text-white">
            {telemetry.communication_quality.toFixed(1)}%
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-xs mt-1.5 overflow-hidden border border-neutral-800">
            <div
              className={`h-full ${telemetry.communication_quality > 50 ? 'bg-purple-500' : 'bg-red-500'}`}
              style={{ width: `${telemetry.communication_quality}%` }}
            />
          </div>
        </div>

        {/* Speed */}
        <div className="bg-black/40 border border-neutral-800 p-2.5 rounded-sm">
          <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1 mb-1">
            <Gauge className="w-3 h-3 text-amber-400" /> Robot Speed
          </span>
          <div className="text-xl font-bold text-white">
            {telemetry.speed.toFixed(1)} <span className="text-xs text-neutral-500">m/s</span>
          </div>
        </div>

        {/* Mission Progress */}
        <div className="bg-black/40 border border-neutral-800 p-2.5 rounded-sm">
          <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-emerald-400" /> Progress
          </span>
          <div className="text-xl font-bold text-white">
            {telemetry.mission_progress.toFixed(1)}%
          </div>
        </div>

        {/* Feasibility Status */}
        <div className="bg-black/40 border border-neutral-800 p-2.5 rounded-sm">
          <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1 mb-1">
            Mission Feasibility
          </span>
          <div className={`text-sm font-bold uppercase mt-1 ${feasibility.is_feasible ? 'text-emerald-400' : 'text-red-400'}`}>
            {feasibility.is_feasible ? 'FEASIBLE' : 'INFEASIBLE'}
          </div>
          <span className="text-[9px] text-neutral-500 block truncate">
            {feasibility.bottleneck_reason}
          </span>
        </div>
      </div>
    </div>
  );
};
