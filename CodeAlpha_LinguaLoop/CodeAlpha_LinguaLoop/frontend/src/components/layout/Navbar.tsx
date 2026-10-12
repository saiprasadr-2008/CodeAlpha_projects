import React from 'react';
import { 
  Activity, 
  Bell, 
  Building2, 
  Play, 
  Pause, 
  Zap,
  ChevronDown
} from 'lucide-react';
import type { ElevatorEntity } from '../../types/elevator';

interface NavbarProps {
  currentElevator: ElevatorEntity;
  fleet: ElevatorEntity[];
  onSelectElevator: (elevator: ElevatorEntity) => void;
  isSimulating: boolean;
  onToggleSimulating: () => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentElevator,
  fleet,
  onSelectElevator,
  isSimulating,
  onToggleSimulating,
  unreadAlertsCount,
  onOpenAlerts
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070B14]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-6 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Left: Building & Elevator Switcher */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-sm">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <div className="relative group">
            <select 
              value={currentElevator.id}
              onChange={(e) => {
                const found = fleet.find(item => item.id === e.target.value);
                if (found) onSelectElevator(found);
              }}
              className="bg-transparent text-slate-200 font-medium cursor-pointer focus:outline-none pr-6 appearance-none"
            >
              {fleet.map(elev => (
                <option key={elev.id} value={elev.id} className="bg-slate-900 text-slate-100">
                  {elev.building} - {elev.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Live Telemetry Ping */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSimulating ? 'bg-cyan-400 opacity-75' : 'bg-slate-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? 'bg-cyan-500' : 'bg-slate-500'}`}></span>
          </span>
          <span>{isSimulating ? 'IoT Telemetry: STREAMING (240Hz)' : 'Telemetry: PAUSED'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Toggle Realtime Telemetry Simulation */}
        <button
          onClick={onToggleSimulating}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isSimulating
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 glow-cyan'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle real-time live sensor fluctuation simulator"
        >
          {isSimulating ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-slate-300" />}
          <span className="hidden sm:inline">{isSimulating ? 'Pause Stream' : 'Live Stream'}</span>
        </button>

        {/* System Health Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Health Score:</span>
          <span className="text-emerald-400 font-bold font-mono">{currentElevator.health}/100</span>
        </div>

        {/* Notifications / Alert Center Button */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Open Alert Center"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* AI Agent Status Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-500/30 text-xs text-blue-300 font-medium">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">ElevAI Core v2.4</span>
        </div>
      </div>
    </header>
  );
};
