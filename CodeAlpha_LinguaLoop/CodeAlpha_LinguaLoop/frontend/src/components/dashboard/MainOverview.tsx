import React from 'react';
import type { ElevatorEntity, ComponentHealth, Alert } from '../../types/elevator';
import { ElevatorDigitalTwin } from '../digital-twin/ElevatorDigitalTwin';
import { 
  Activity, 
  ShieldAlert, 
  Clock, 
  Compass, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MainOverviewProps {
  currentElevator: ElevatorEntity;
  onSelectComponent: (component: ComponentHealth) => void;
  onNavigateToTab: (tab: any) => void;
  alerts: Alert[];
}

export const MainOverview: React.FC<MainOverviewProps> = ({
  currentElevator,
  onSelectComponent,
  onNavigateToTab,
  alerts
}) => {
  // Risk Donut Data Calculation
  const lowRiskCount = currentElevator.components.filter(c => c.risk === 'Low').length;
  const medRiskCount = currentElevator.components.filter(c => c.risk === 'Medium').length;
  const highRiskCount = currentElevator.components.filter(c => c.risk === 'High').length;

  const riskData = [
    { name: 'Low Risk', value: lowRiskCount, color: '#10B981' },
    { name: 'Medium Risk', value: medRiskCount, color: '#F59E0B' },
    { name: 'High Risk', value: highRiskCount, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>EXECUTIVE MONITORING CONSOLE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {currentElevator.building} — <span className="text-gradient-cyan">{currentElevator.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Location: {currentElevator.location} • Age: {currentElevator.ageYears} Years • Real-Time AI Telemetry Active
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateToTab('simulator')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg glow-cyan flex items-center space-x-2"
          >
            <span>Launch What-If Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Header (Required by Section 17 & Section 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Overall Health */}
        <div className="glass-card p-4 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">OVERALL HEALTH</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white">{currentElevator.health}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-400 h-full" style={{ width: `${currentElevator.health}%` }} />
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block font-mono">Nominal System Integrity</span>
        </div>

        {/* KPI 2: Risk Level */}
        <div className="glass-card p-4 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">RISK LEVEL</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-extrabold font-mono ${
              currentElevator.risk === 'High' ? 'text-red-400' : currentElevator.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {currentElevator.risk.toUpperCase()}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-mono">
            {highRiskCount} High Risk • {medRiskCount} Med Risk
          </p>
        </div>

        {/* KPI 3: Failure Probability */}
        <div className="glass-card p-4 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">FAILURE PROBABILITY</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black font-mono text-cyan-300">{currentElevator.failureProbability}%</span>
          </div>
          <p className="text-[10px] text-cyan-400 mt-3 font-mono">Next 90 Days Horizon</p>
        </div>

        {/* KPI 4: Predicted RUL */}
        <div className="glass-card p-4 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">PREDICTED RUL</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black font-mono text-blue-300">{currentElevator.rulMonths}</span>
            <span className="text-xs text-slate-400 font-mono ml-1">Months</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-mono">Est. Remaining Useful Life</p>
        </div>

        {/* KPI 5: AI Recommendation */}
        <div className="glass-card p-4 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/60 to-slate-900 relative overflow-hidden group hover:border-cyan-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400">AI RECOMMENDATION</span>
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-gradient-cyan">
              {currentElevator.recommendedAction.toUpperCase()}
            </span>
          </div>
          <button 
            onClick={() => onNavigateToTab('decision-engine')}
            className="text-[10px] text-cyan-300 hover:text-white mt-3 font-mono flex items-center space-x-1"
          >
            <span>View Rationale & Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center Layout Grid: Interactive Twin (Left) & Risk Donut + Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Large Interactive Elevator Digital Twin */}
        <div className="lg:col-span-2">
          <ElevatorDigitalTwin
            components={currentElevator.components}
            onSelectComponent={onSelectComponent}
            systemHealth={currentElevator.health}
            riskLevel={currentElevator.risk}
            predictedRULMonths={currentElevator.rulMonths}
          />
        </div>

        {/* Right Column: Risk Overview & Active Alerts */}
        <div className="space-y-6">
          {/* Risk Overview Donut Chart Card */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">COMPONENT RISK MATRIX</h3>
                <p className="text-[10px] text-slate-400">Risk Distribution breakdown</p>
              </div>
              <button 
                onClick={() => onNavigateToTab('risk-analysis')}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Details →
              </button>
            </div>

            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#070B14" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0D1527', borderColor: '#00F0FF', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-mono">RISK</span>
                <span className="text-lg font-bold font-mono text-amber-400">{currentElevator.risk}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-800 text-center text-xs font-mono">
              <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 block font-bold">{lowRiskCount}</span>
                <span className="text-[10px] text-slate-400">Low Risk</span>
              </div>
              <div className="bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
                <span className="text-amber-400 block font-bold">{medRiskCount}</span>
                <span className="text-[10px] text-slate-400">Medium</span>
              </div>
              <div className="bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                <span className="text-red-400 block font-bold">{highRiskCount}</span>
                <span className="text-[10px] text-slate-400">High Risk</span>
              </div>
            </div>
          </div>

          {/* Active Alerts Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">SYSTEM ALERTS ({alerts.filter(a => !a.resolved).length})</h3>
              </div>
              <button 
                onClick={() => onNavigateToTab('alerts')}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Alert Center →
              </button>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {alerts.slice(0, 3).map((alt) => (
                <div 
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs ${
                    alt.severity === 'high' 
                      ? 'bg-red-950/30 border-red-500/40 text-red-200' 
                      : alt.severity === 'medium'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold mb-1">
                    <span className="truncate">{alt.title}</span>
                    <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{alt.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
