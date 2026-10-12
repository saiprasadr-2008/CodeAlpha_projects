import React from 'react';
import { 
  LayoutDashboard, 
  Box, 
  Cpu, 
  LineChart, 
  ShieldAlert, 
  Compass, 
  Sliders, 
  Building, 
  History, 
  Bell, 
  Workflow, 
  Home,
  Bot
} from 'lucide-react';

export type NavTab = 
  | 'landing'
  | 'overview'
  | 'digital-twin'
  | 'components'
  | 'ai-predictions'
  | 'risk-analysis'
  | 'decision-engine'
  | 'simulator'
  | 'fleet'
  | 'maintenance'
  | 'alerts'
  | 'architecture';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAlerts: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadAlerts
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: 'Landing & Showcase', icon: <Home className="w-4 h-4" /> },
    { id: 'overview', label: 'Main Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'digital-twin', label: 'Digital Twin Schema', icon: <Box className="w-4 h-4" /> },
    { id: 'components', label: 'Component Health', icon: <Cpu className="w-4 h-4" /> },
    { id: 'ai-predictions', label: 'AI Predictive Telemetry', icon: <LineChart className="w-4 h-4" /> },
    { id: 'risk-analysis', label: 'Risk Analysis Engine', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'decision-engine', label: 'Modernization Engine', icon: <Compass className="w-4 h-4" /> },
    { id: 'simulator', label: 'What-If Simulator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet Management', icon: <Building className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance History', icon: <History className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alert Center', icon: <Bell className="w-4 h-4" />, badge: unreadAlerts },
    { id: 'architecture', label: 'AI Pipeline Architecture', icon: <Workflow className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-[#070B14] border-r border-cyan-500/20 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center glow-cyan">
          <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="font-extrabold tracking-wider text-white text-lg font-mono">Elev<span className="text-cyan-400">AI</span></span>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/40">TWIN</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">Elevator AI Decision Platform</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500/80 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Panel */}
      <div className="p-3 m-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Digital Twin Sync</span>
          <span className="text-emerald-400 font-mono font-medium">99.8%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-cyan-400 h-full w-[99.8%]" />
        </div>
        <p className="text-[10px] text-slate-500">Autonomous IoT Sensor mesh online. 128 telemetry vectors active.</p>
      </div>
    </aside>
  );
};
