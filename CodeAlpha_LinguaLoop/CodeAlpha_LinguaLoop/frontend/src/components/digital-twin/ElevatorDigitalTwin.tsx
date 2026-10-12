import React, { useState, useEffect } from 'react';
import type { ComponentHealth, ComponentId } from '../../types/elevator';
import { Cpu, Zap, Activity } from 'lucide-react';

interface ElevatorDigitalTwinProps {
  components: ComponentHealth[];
  selectedComponentId?: ComponentId;
  onSelectComponent: (component: ComponentHealth) => void;
  systemHealth: number;
  riskLevel: string;
  predictedRULMonths: number;
}

export const ElevatorDigitalTwin: React.FC<ElevatorDigitalTwinProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  systemHealth,
  riskLevel,
  predictedRULMonths
}) => {
  const [carFloor, setCarFloor] = useState<number>(4);
  const [isMoving, setIsMoving] = useState<boolean>(true);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);

  // Animated elevator cab movement effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCarFloor(prev => {
        const nextFloor = prev >= 8 ? 1 : prev + 1;
        setIsMoving(true);
        setDoorOpen(false);

        setTimeout(() => {
          setIsMoving(false);
          setDoorOpen(true);
        }, 1800);

        return nextFloor;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const getComponent = (id: ComponentId) => components.find(c => c.id === id);

  const getHealthBadgeColor = (health: number) => {
    if (health >= 85) return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
    if (health >= 70) return 'border-amber-500/50 bg-amber-950/40 text-amber-300';
    return 'border-red-500/50 bg-red-950/40 text-red-300';
  };

  const getStatusDotColor = (health: number) => {
    if (health >= 85) return 'bg-emerald-400 glow-emerald';
    if (health >= 70) return 'bg-amber-400 glow-amber';
    return 'bg-red-500 glow-red animate-ping';
  };

  // Hotspots placement definitions
  const hotspots: { id: ComponentId; label: string; x: string; y: string; positionClass: string }[] = [
    { id: 'motor', label: 'Traction Motor', x: '45%', y: '12%', positionClass: '-translate-x-1/2 -translate-y-full' },
    { id: 'brake', label: 'Safety Brake', x: '68%', y: '14%', positionClass: 'translate-x-2 -translate-y-1/2' },
    { id: 'controller', label: 'Controller', x: '18%', y: '16%', positionClass: '-translate-x-full -translate-y-1/2' },
    { id: 'vfd', label: 'VFD Inverter', x: '18%', y: '26%', positionClass: '-translate-x-full -translate-y-1/2' },
    { id: 'ropes', label: 'Hoisting Ropes', x: '35%', y: '40%', positionClass: '-translate-x-full -translate-y-1/2' },
    { id: 'guide-rails', label: 'Guide Rails', x: '78%', y: '55%', positionClass: 'translate-x-2 -translate-y-1/2' },
    { id: 'doors', label: 'Door Operator', x: '50%', y: '72%', positionClass: '-translate-x-1/2 translate-y-3' }
  ];

  return (
    <div className="relative w-full glass-panel rounded-2xl p-6 border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.08)]">
      {/* Background Holographic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-cyan-500/20 pb-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-lg font-bold text-white tracking-wide font-mono">DIGITAL TWIN TELEMETRY SCHEMA</h3>
          </div>
          <p className="text-xs text-slate-400">Real-Time Industrial IoT Sensor Mapping & Health Telemetry</p>
        </div>

        {/* Live Status Indicators Header Required by Section 2 */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl p-2.5">
          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">System Health</span>
            <span className="text-sm font-extrabold text-cyan-300 font-mono">{systemHealth}/100</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Risk Level</span>
            <span className={`text-sm font-extrabold font-mono ${riskLevel === 'High' ? 'text-red-400' : riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {riskLevel}
            </span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">
            <span className="text-[10px] text-slate-400 block">Predicted RUL</span>
            <span className="text-sm font-extrabold text-blue-300 font-mono">{predictedRULMonths} Months</span>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Visualizer Area */}
      <div className="relative min-h-[520px] bg-[#050810]/90 border border-cyan-900/40 rounded-xl p-4 flex justify-center items-center overflow-hidden">
        
        {/* Hologram Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 w-full animate-scanline pointer-events-none" />

        {/* Floor Height Markers (Left Scale) */}
        <div className="absolute left-6 top-12 bottom-12 flex flex-col justify-between text-[11px] font-mono text-slate-500 z-10">
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(f => (
            <div key={f} className="flex items-center space-x-2">
              <span className={carFloor === f ? 'text-cyan-400 font-bold scale-110' : ''}>F{f}</span>
              <div className={`h-[1px] w-3 ${carFloor === f ? 'bg-cyan-400 glow-cyan' : 'bg-slate-800'}`} />
            </div>
          ))}
        </div>

        {/* Elevator Shaft Frame (Center Schematic) */}
        <div className="relative w-80 h-[460px] border-2 border-slate-800 rounded-lg bg-slate-950/60 p-2 flex flex-col justify-between">
          
          {/* Machine Room (Top Section) */}
          <div className="h-28 border-b-2 border-cyan-500/30 bg-slate-900/80 rounded-t-md p-2 flex justify-around items-center relative">
            <div className="text-[9px] font-mono text-slate-500 absolute top-1 left-2">MACHINE ROOM</div>
            
            {/* Traction Motor Icon Node */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-[9px] font-mono text-cyan-300 mt-1">MOTOR</span>
            </div>

            {/* Brake Assembly Node */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-md bg-amber-950/80 border border-amber-400/60 flex items-center justify-center">
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-[9px] font-mono text-amber-300 mt-1">BRAKE</span>
            </div>

            {/* Controller / VFD Cabinet */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-10 rounded bg-blue-950/80 border border-blue-400/60 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[9px] font-mono text-blue-300 mt-1">CTRL/VFD</span>
            </div>
          </div>

          {/* Shaft Hoistway */}
          <div className="relative flex-1 bg-[#060B17] overflow-hidden my-1 rounded border border-slate-900">
            {/* Steel Cables (Animated) */}
            <div className="absolute left-1/3 top-0 bottom-0 w-1 animate-cable opacity-80" />
            <div className="absolute left-1/3 text-slate-700 top-0 bottom-0 ml-2 w-1 animate-cable opacity-80" />

            {/* Guide Rails (Right & Left) */}
            <div className="absolute left-2 top-0 bottom-0 w-1.5 bg-slate-800 border-r border-slate-700" />
            <div className="absolute right-2 top-0 bottom-0 w-1.5 bg-slate-800 border-l border-slate-700" />

            {/* Moving Elevator Cab */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-44 h-24 rounded-lg border-2 border-cyan-400/70 bg-gradient-to-b from-slate-900 via-cyan-950/50 to-slate-900 p-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-1000 ease-in-out z-20 flex flex-col justify-between"
              style={{ top: `${(10 - carFloor) * 9 + 4}%` }}
            >
              {/* Cab Top Bar */}
              <div className="flex justify-between items-center text-[9px] font-mono border-b border-cyan-500/30 pb-1">
                <span className="text-cyan-400 font-bold">CABIN #01</span>
                <span className="text-emerald-400 animate-pulse">{isMoving ? 'MOVING...' : 'PARKED'}</span>
                <span className="text-slate-300 bg-cyan-950 px-1 rounded">F{carFloor}</span>
              </div>

              {/* Elevator Doors Animation */}
              <div className="flex justify-between items-center h-12 bg-slate-950 border border-slate-800 rounded relative overflow-hidden my-1">
                <div 
                  className={`h-full bg-slate-800 border-r border-cyan-500/40 transition-all duration-700 flex items-center justify-end pr-1 ${doorOpen ? 'w-2' : 'w-1/2'}`}
                >
                  <div className="w-1 h-6 bg-cyan-400/60 rounded" />
                </div>
                <div 
                  className={`h-full bg-slate-800 border-l border-cyan-500/40 transition-all duration-700 flex items-center justify-start pl-1 ${doorOpen ? 'w-2' : 'w-1/2'}`}
                >
                  <div className="w-1 h-6 bg-cyan-400/60 rounded" />
                </div>

                {/* Interior Passengers Shadow */}
                {doorOpen && (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-cyan-300 font-mono animate-fade-in">
                    DOORS OPEN
                  </div>
                )}
              </div>

              <div className="flex justify-between text-[8px] font-mono text-slate-500">
                <span>DOOR INTERLOCK OK</span>
                <span>LOAD: 420 KG</span>
              </div>
            </div>

            {/* Counterweight (Moves inversely to car) */}
            <div 
              className="absolute right-4 w-6 h-16 bg-slate-800 border border-slate-600 rounded transition-all duration-1000 z-10 flex flex-col items-center justify-center text-[8px] font-mono text-slate-400"
              style={{ top: `${(carFloor) * 8 + 4}%` }}
            >
              <span>CWT</span>
            </div>
          </div>
        </div>

        {/* Clickable Hotspots overlay around component targets */}
        {hotspots.map((hs) => {
          const comp = getComponent(hs.id);
          if (!comp) return null;
          const isSelected = selectedComponentId === comp.id;

          return (
            <div
              key={hs.id}
              className="absolute z-30 group cursor-pointer"
              style={{ left: hs.x, top: hs.y }}
              onClick={() => onSelectComponent(comp)}
            >
              {/* Pulse Circle Hotspot */}
              <div className="relative">
                <span className={`block w-4 h-4 rounded-full ${getStatusDotColor(comp.health)}`} />
                {isSelected && (
                  <span className="absolute -inset-1 rounded-full border-2 border-cyan-400 animate-ping" />
                )}
              </div>

              {/* Floating Hotspot Card Required by Prompt Section 2 */}
              <div 
                className={`absolute ${hs.positionClass} mt-1 pointer-events-auto transition-all ${
                  isSelected ? 'scale-105 z-40' : 'scale-100 opacity-90 group-hover:opacity-100 group-hover:scale-105'
                }`}
              >
                <div className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border whitespace-nowrap shadow-xl backdrop-blur-md flex items-center space-x-2 ${getHealthBadgeColor(comp.health)} ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}>
                  <span className="font-semibold text-white">{hs.label}</span>
                  <span className="font-bold">{comp.health}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Component Selection Row at Bottom */}
      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <p className="text-xs font-semibold text-slate-400 mb-2">SELECT COMPONENT TO INSPECT REAL-TIME TELEMETRY & AI DIAGNOSTICS:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {components.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => onSelectComponent(comp)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white glow-cyan'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span className="truncate">{comp.name.split(' ')[0]}</span>
                  <span className={comp.health >= 85 ? 'text-emerald-400' : comp.health >= 70 ? 'text-amber-400' : 'text-red-400'}>
                    {comp.health}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full ${comp.health >= 85 ? 'bg-emerald-400' : comp.health >= 70 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${comp.health}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
