import React from 'react';
import type { ComponentHealth } from '../../types/elevator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface RiskAnalysisViewProps {
  components: ComponentHealth[];
  overallRisk: string;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  components,
  overallRisk
}) => {
  const lowRiskCount = components.filter(c => c.risk === 'Low').length;
  const medRiskCount = components.filter(c => c.risk === 'Medium').length;
  const highRiskCount = components.filter(c => c.risk === 'High').length;

  const riskData = [
    { name: 'Low Risk', value: lowRiskCount, color: '#10B981' },
    { name: 'Medium Risk', value: medRiskCount, color: '#F59E0B' },
    { name: 'High Risk', value: highRiskCount, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>RISK ASSESSMENT & FAILURE HAZARD SCORE MATRIX</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Elevator Risk Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Subsystem vulnerability profiling and failure risk distribution models.
          </p>
        </div>

        {/* Overall Elevator Risk Required by Section 8 */}
        <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center space-x-3 shadow-lg">
          <AlertTriangle className="w-6 h-6 text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">OVERALL ELEVATOR RISK</span>
            <span className="text-xl font-black font-mono text-amber-400">{overallRisk.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Grid: Donut Chart & Risk Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut Chart (Section 8 Requirement) */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-mono mb-1">Risk Distribution Donut</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown of component vulnerabilities</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#070B14" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#00F0FF', borderRadius: '8px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center text-xs font-mono">
            <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 font-bold block text-sm">{lowRiskCount}</span>
              <span className="text-[10px] text-slate-400">Low Risk</span>
            </div>
            <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
              <span className="text-amber-400 font-bold block text-sm">{medRiskCount}</span>
              <span className="text-[10px] text-slate-400">Medium</span>
            </div>
            <div className="bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
              <span className="text-red-400 font-bold block text-sm">{highRiskCount}</span>
              <span className="text-[10px] text-slate-400">High Risk</span>
            </div>
          </div>
        </div>

        {/* Detailed Risk Heat Table */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 lg:col-span-2">
          <h3 className="text-base font-bold text-white font-mono mb-4">Subsystem Risk Assessment Matrix</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyan-500/20 text-slate-400">
                  <th className="pb-3 px-2">COMPONENT</th>
                  <th className="pb-3 px-2">HEALTH</th>
                  <th className="pb-3 px-2">RISK SCORE</th>
                  <th className="pb-3 px-2">FAIL PROBABILITY</th>
                  <th className="pb-3 px-2">EST. RUL</th>
                  <th className="pb-3 px-2">ACTION NEEDED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {components.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-2 text-white font-bold">{comp.name}</td>
                    <td className="py-3 px-2">
                      <span className={`font-bold ${comp.health >= 85 ? 'text-emerald-400' : comp.health >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        {comp.health}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        comp.risk === 'High' 
                          ? 'bg-red-950 text-red-400 border border-red-500/40' 
                          : comp.risk === 'Medium' 
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/40' 
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {comp.risk}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-cyan-300 font-bold">{comp.failureProbability}%</td>
                    <td className="py-3 px-2 text-blue-300 font-bold">{comp.predictedRULMonths} Months</td>
                    <td className="py-3 px-2 text-slate-300">
                      {comp.risk === 'High' ? 'Immediate Overhaul' : comp.risk === 'Medium' ? 'Monitor & Schedule' : 'Routine Inspection'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
