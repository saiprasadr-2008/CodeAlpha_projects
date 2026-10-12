import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { Navigation, Target, Shield, Radio, Flame } from 'lucide-react';

export const MapGrid: React.FC = () => {
  const grid = useMissionStore((state) => state.grid);
  const telemetry = useMissionStore((state) => state.telemetry);
  const startPos = useMissionStore((state) => state.startPos);
  const targetPos = useMissionStore((state) => state.targetPos);
  const routeComp = useMissionStore((state) => state.routeComparison);

  const width = grid[0]?.length || 20;
  const height = grid.length || 20;

  const currentPath = routeComp?.current_route?.path || [];
  const altPath = routeComp?.alternative_route?.path || [];

  const getCellColor = (type: string) => {
    switch (type) {
      case 'OBSTACLE':
        return 'bg-neutral-800 border-neutral-700';
      case 'HAZARD':
        return 'bg-amber-950/40 border-amber-800/40';
      case 'COMM_DEAD_ZONE':
        return 'bg-purple-950/30 border-purple-800/30';
      case 'SAFE_ZONE':
        return 'bg-emerald-950/20 border-emerald-800/30';
      case 'EMPTY':
      default:
        return 'bg-neutral-900/60 border-neutral-800/50';
    }
  };

  const isCellInPath = (x: number, y: number, path: { x: number; y: number }[]) => {
    return path.some((p) => p.x === x && p.y === y);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 text-xs font-mono text-neutral-400">
        <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-200">
          <Navigation className="w-4 h-4 text-blue-400" />
          2D SIMULATION TACTICAL MAP ({width}x{height})
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500/40 border border-emerald-500 rounded-xs inline-block" /> Safe</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500/40 border border-amber-500 rounded-xs inline-block" /> Hazard</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-purple-500/40 border border-purple-500 rounded-xs inline-block" /> Dead Zone</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-neutral-700 border border-neutral-600 rounded-xs inline-block" /> Wall</span>
        </div>
      </div>

      <div
        className="grid gap-0.5 border border-neutral-800 bg-neutral-950 p-1 rounded-sm overflow-auto max-w-full"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          width: '100%',
          maxWidth: '560px',
          aspectRatio: '1/1',
        }}
      >
        {grid.map((row, y) =>
          row.map((cellType, x) => {
            const isRobot = telemetry.position.x === x && telemetry.position.y === y;
            const isStart = startPos.x === x && startPos.y === y;
            const isTarget = targetPos.x === x && targetPos.y === y;
            const inCurrentPath = isCellInPath(x, y, currentPath);
            const inAltPath = isCellInPath(x, y, altPath);

            return (
              <div
                key={`${x}-${y}`}
                className={`relative flex items-center justify-center border transition-all text-[9px] font-mono select-none ${getCellColor(
                  cellType
                )}`}
              >
                {/* Path overlay indicators */}
                {inAltPath && !isRobot && !isStart && !isTarget && (
                  <div className="absolute inset-1 rounded-xs bg-blue-500/30 border border-blue-400/60 z-10" />
                )}
                {inCurrentPath && !inAltPath && !isRobot && !isStart && !isTarget && (
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-neutral-500/50" />
                )}

                {/* Icons */}
                {isRobot ? (
                  <div className="z-20 w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold rounded-xs shadow-sm animate-pulse">
                    <Navigation className="w-3 h-3 text-white transform rotate-45" />
                  </div>
                ) : isStart ? (
                  <span className="z-20 text-emerald-400 font-bold flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" /> S
                  </span>
                ) : isTarget ? (
                  <span className="z-20 text-red-400 font-bold flex items-center gap-0.5">
                    <Target className="w-2.5 h-2.5" /> T
                  </span>
                ) : cellType === 'HAZARD' ? (
                  <Flame className="w-2.5 h-2.5 text-amber-500/40" />
                ) : cellType === 'COMM_DEAD_ZONE' ? (
                  <Radio className="w-2.5 h-2.5 text-purple-500/40" />
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <div className="w-full mt-3 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Current Position:</span>
          <span className="text-white font-bold">({telemetry.position.x}, {telemetry.position.y})</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-500">Path Legend:</span>
          <span className="text-neutral-400 flex items-center gap-1">
            <span className="w-3 h-0.5 bg-neutral-500 inline-block" /> Naive Path
          </span>
          <span className="text-blue-400 font-bold flex items-center gap-1">
            <span className="w-3 h-0.5 bg-blue-500 inline-block" /> Risk-Aware Path
          </span>
        </div>
      </div>
    </div>
  );
};
