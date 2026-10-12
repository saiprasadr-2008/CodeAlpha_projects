import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import type { ActionType } from '../types/missionguard';
import { ShieldCheck, ArrowRightLeft, RotateCcw, OctagonAlert, Activity } from 'lucide-react';

export const DecisionBanner: React.FC = () => {
  const decision = useMissionStore((state) => state.decision);

  const getActionConfig = (action: ActionType) => {
    switch (action) {
      case 'CONTINUE':
        return {
          bg: 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        };
      case 'SLOW':
      case 'MONITOR':
        return {
          bg: 'bg-amber-950/20 border-amber-500/40 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: <Activity className="w-6 h-6 text-amber-400" />,
        };
      case 'REROUTE':
        return {
          bg: 'bg-blue-950/20 border-blue-500/40 text-blue-300',
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          icon: <ArrowRightLeft className="w-6 h-6 text-blue-400" />,
        };
      case 'RETURN':
        return {
          bg: 'bg-orange-950/20 border-orange-500/40 text-orange-300',
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          icon: <RotateCcw className="w-6 h-6 text-orange-400" />,
        };
      case 'SAFE_STOP':
      default:
        return {
          bg: 'bg-red-950/20 border-red-500/40 text-red-300',
          badge: 'bg-red-500/20 text-red-400 border-red-500/40',
          icon: <OctagonAlert className="w-6 h-6 text-red-400" />,
        };
    }
  };

  const config = getActionConfig(decision.action);

  return (
    <div className={`border rounded-sm p-4 ${config.bg} transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-sm bg-black/40 border border-current/20">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">RECOMMENDED ACTION</span>
              <span className={`text-xs px-2 py-0.5 font-mono font-bold uppercase rounded-xs border ${config.badge}`}>
                {decision.priority} PRIORITY
              </span>
            </div>
            <h2 className="text-xl font-mono font-bold tracking-tight text-white flex items-center gap-2">
              {decision.action}
              {decision.recommended_route_id && (
                <span className="text-xs font-mono font-normal text-blue-400">
                  ➔ {decision.recommended_route_id}
                </span>
              )}
            </h2>
            <p className="text-sm font-sans text-neutral-300 mt-1">
              {decision.explanation_summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 md:max-w-xs justify-end font-mono text-xs">
          {decision.reason_codes.map((code) => (
            <span
              key={code}
              className="px-2 py-1 bg-black/50 border border-neutral-700 text-neutral-300 rounded-xs"
            >
              #{code}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
