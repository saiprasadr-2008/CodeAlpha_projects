import React, { useState } from 'react';
import type { ElevatorEntity } from '../../types/elevator';
import { Building, ArrowUpDown, ChevronRight } from 'lucide-react';

interface FleetMonitoringViewProps {
  fleet: ElevatorEntity[];
  currentElevatorId: string;
  onSelectElevator: (elevator: ElevatorEntity) => void;
}

export const FleetMonitoringView: React.FC<FleetMonitoringViewProps> = ({
  fleet,
  currentElevatorId,
  onSelectElevator
}) => {
  const [sortBy, setSortBy] = useState<'health' | 'risk' | 'age' | 'failureProbability'>('health');
  const [filterRisk] = useState<string>('all');

  const sortedFleet = [...fleet].sort((a, b) => {
    if (sortBy === 'health') return a.health - b.health;
    if (sortBy === 'failureProbability') return b.failureProbability - a.failureProbability;
    if (sortBy === 'age') return b.ageYears - a.ageYears;
    return a.risk.localeCompare(b.risk);
  }).filter(e => filterRisk === 'all' || e.risk.toLowerCase() === filterRisk.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE FLEET COMMAND</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Multi-Building Fleet Monitoring
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cross-facility IoT telemetry aggregation & automated risk prioritization.
          </p>
        </div>

        {/* Sort & Filter Controls (Section 10 Requirements) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="health" className="bg-slate-900">Health (Ascending)</option>
              <option value="failureProbability" className="bg-slate-900">Failure Prob (Desc)</option>
              <option value="risk" className="bg-slate-900">Risk Severity</option>
              <option value="age" className="bg-slate-900">Age (Oldest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Elevator Cards Required by Section 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFleet.map((elev) => {
          const isActive = elev.id === currentElevatorId;
          const isHigh = elev.risk === 'High';
          const isMed = elev.risk === 'Medium';

          return (
            <div
              key={elev.id}
              onClick={() => onSelectElevator(elev)}
              className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer group glass-panel-hover relative overflow-hidden ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/20 ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                  : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl">
                  ACTIVE CONSOLE
                </div>
              )}

              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-white font-mono text-base group-hover:text-cyan-300 transition-colors">
                    {elev.name}
                  </h3>
                  <p className="text-xs text-slate-400">{elev.building}</p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                  isHigh 
                    ? 'bg-red-950 border-red-500/50 text-red-300' 
                    : isMed 
                    ? 'bg-amber-950 border-amber-500/50 text-amber-300' 
                    : 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                }`}>
                  {elev.risk} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center mb-4 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Health Score</span>
                  <span className={`text-xl font-bold ${elev.health >= 85 ? 'text-emerald-400' : elev.health >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {elev.health}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Failure Prob.</span>
                  <span className="text-xl font-bold text-cyan-300">{elev.failureProbability}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>RUL: {elev.rulMonths} Mos</span>
                <div className="flex items-center space-x-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Switch Context</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
