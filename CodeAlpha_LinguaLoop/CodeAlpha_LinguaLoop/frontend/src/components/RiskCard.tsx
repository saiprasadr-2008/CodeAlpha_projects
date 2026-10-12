import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { ShieldAlert, Battery, Cpu, Radio, Shield, MapPin } from 'lucide-react';

export const RiskCard: React.FC = () => {
  const risk = useMissionStore((state) => state.riskAssessment);

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score <= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (score <= 80) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getBarColor = (val: number) => {
    if (val <= 30) return 'bg-emerald-500';
    if (val <= 60) return 'bg-amber-500';
    if (val <= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const factors = [
    { key: 'battery', label: 'Battery Risk', val: risk.components.battery, icon: <Battery className="w-3.5 h-3.5" /> },
    { key: 'sensor', label: 'Sensor Health Risk', val: risk.components.sensor, icon: <Cpu className="w-3.5 h-3.5" /> },
    { key: 'communication', label: 'Communication Risk', val: risk.components.communication, icon: <Radio className="w-3.5 h-3.5" /> },
    { key: 'obstacle', label: 'Obstacle Density Risk', val: risk.components.obstacle, icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: 'environment', label: 'Environmental Hazard Risk', val: risk.components.environment, icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          RISK INTELLIGENCE BREAKDOWN
        </span>
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-xs border uppercase ${getScoreColor(risk.overall_score)}`}>
          {risk.risk_level} RISK
        </span>
      </div>

      <div className="flex items-center justify-between mb-5 bg-black/40 border border-neutral-800 p-3 rounded-sm">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">CUMULATIVE RISK SCORE</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-mono font-bold ${risk.overall_score > 60 ? 'text-red-400' : risk.overall_score > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {risk.overall_score.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-neutral-500">/ 100.0</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">PRIMARY CONTRIBUTORS</span>
          <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
            {risk.primary_contributors.length > 0 ? (
              risk.primary_contributors.map((c) => (
                <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 bg-red-950/50 border border-red-800/40 text-red-300 rounded-xs uppercase">
                  {c}
                </span>
              ))
            ) : (
              <span className="text-xs font-mono text-emerald-400 font-medium">None (Nominal)</span>
            )}
          </div>
        </div>
      </div>

      {/* Factor Bars */}
      <div className="space-y-3 font-mono text-xs">
        {factors.map((f) => (
          <div key={f.key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <span className="text-neutral-500">{f.icon}</span>
                {f.label}
              </span>
              <span className="font-bold text-neutral-200">{f.val.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-neutral-950 rounded-xs h-2 overflow-hidden border border-neutral-800">
              <div
                className={`h-full transition-all duration-300 ${getBarColor(f.val)}`}
                style={{ width: `${Math.min(100, Math.max(0, f.val))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
