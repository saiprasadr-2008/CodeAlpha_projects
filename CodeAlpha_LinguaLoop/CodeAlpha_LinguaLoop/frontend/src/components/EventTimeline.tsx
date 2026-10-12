import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { History, Info, AlertTriangle, AlertOctagon } from 'lucide-react';

export const EventTimeline: React.FC = () => {
  const logs = useMissionStore((state) => state.logs);

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertOctagon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 font-mono">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
          <History className="w-4 h-4 text-neutral-400" />
          SYSTEM EVENT TIMELINE
        </span>
        <span className="text-[10px] text-neutral-500">{logs.length} EVENTS RECORDED</span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2 text-xs bg-black/40 border border-neutral-800/60 p-2 rounded-xs"
          >
            {getLogIcon(log.level)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-0.5">
                <span className="font-bold uppercase tracking-wider text-neutral-400">{log.level}</span>
                <span>{log.timestamp}</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed break-words">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
