import React, { useState } from 'react';
import type { TelemetryPoint, XAIFactor } from '../../types/elevator';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { AlertTriangle, ShieldCheck, Brain, Zap, HelpCircle, Activity } from 'lucide-react';

interface AIPredictionsViewProps {
  telemetryHistory: TelemetryPoint[];
  xaiFactors: XAIFactor[];
}

export const AIPredictionsView: React.FC<AIPredictionsViewProps> = ({
  telemetryHistory,
  xaiFactors
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'temperature' | 'vibration' | 'current' | 'doorCycles'>('all');

  return (
    <div className="space-y-6">
      {/* Top Banner (Section 6 Requirement) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>EXPLAINABLE INDUSTRIAL AI ENGINE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            AI-Powered Predictive Maintenance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous deep neural network forecasting & telemetry anomaly detection across 30-day window.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <button 
            onClick={() => setSelectedMetric('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedMetric === 'all' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            All Telemetry
          </button>
          <button 
            onClick={() => setSelectedMetric('vibration')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedMetric === 'vibration' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Vibration
          </button>
          <button 
            onClick={() => setSelectedMetric('temperature')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedMetric === 'temperature' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Temperature
          </button>
        </div>
      </div>

      {/* AI Prediction & Explanation Banner Cards (Section 6 Requirements) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: AI High-Risk Prediction Card */}
        <div className="glass-panel p-6 rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-red-500/30 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
              <span className="text-xs font-mono font-bold text-red-300">AI PREDICTION ALERT</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-900/60 border border-red-500/50 text-[10px] font-mono text-red-200">
              CONFIDENCE: 94.2%
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-400 font-mono block">Failure Probability</span>
              <span className="text-4xl font-black font-mono text-red-400 glow-red">72%</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Assessed Risk</span>
                <span className="text-lg font-bold font-mono text-red-400">HIGH</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Estimated RUL</span>
                <span className="text-lg font-bold font-mono text-cyan-300">6 Months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 & 3: "Why is this component at risk?" Explanation Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">EXPLAINABLE AI DIAGNOSTIC INSIGHT</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Why is this component at risk?</h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-sans">
              “Vibration levels have increased by <span className="text-red-400 font-bold">18%</span> over the last 30 days and abnormal temperature patterns were detected on the door operator motor and electromagnetic brake friction pads. Continuous micro-spikes indicate bearing raceway degradation.”
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Model: Transformer LSTM Anomaly Classifier v4</span>
            <span className="text-emerald-400">Feature Importance Validated</span>
          </div>
        </div>
      </div>

      {/* Main 30-Day Multi-Telemetry Charts Grid (Section 6 Requirements) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Temperature & Vibration Trend */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">TEMPERATURE (°C) & VIBRATION (mm/s)</h3>
              <p className="text-[10px] text-slate-400">30-Day continuous IoT sensor curve</p>
            </div>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#00F0FF', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#F59E0B" fillOpacity={1} fill="url(#tempGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="vibration" name="Vibration (mm/s)" stroke="#EF4444" fillOpacity={1} fill="url(#vibGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Motor Current & Fault Frequency */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">MOTOR CURRENT (Amps) & FAULT FREQUENCY</h3>
              <p className="text-[10px] text-slate-400">Electrical load spikes & anomaly occurrences</p>
            </div>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#00F0FF', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="motorCurrent" name="Motor Current (A)" stroke="#00F0FF" strokeWidth={2} dot={{ fill: '#00F0FF' }} />
                <Line type="monotone" dataKey="faultFrequency" name="Fault Events" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 15: Explainable AI — "AI That Explains Its Decisions." */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SHAP FEATURE ATTRIBUTION MODEL</span>
            </div>
            <h3 className="text-xl font-extrabold text-white font-mono">
              AI That Explains Its Decisions.
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantified breakdown of mathematical factors contributing to overall component failure risk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Horizontal Feature Contribution Bar Chart */}
          <div className="space-y-4">
            {xaiFactors.map((factor) => (
              <div key={factor.factor} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-200 font-semibold">{factor.factor}</span>
                  <span className="font-bold font-mono" style={{ color: factor.color }}>
                    {factor.percentage}% Impact
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${factor.percentage}%`, backgroundColor: factor.color }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">{factor.detail}</p>
              </div>
            ))}
          </div>

          {/* XAI Factor Matrix Summary */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono border-b border-slate-800 pb-2">
              Model Diagnostic Summary
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <span className="h-2 w-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <p><strong className="text-white font-mono">Primary Risk Driver (35%):</strong> Vibration high-frequency harmonic spikes during deceleration curves.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <p><strong className="text-white font-mono">Secondary Factor (25%):</strong> Inverter & Door operator thermal saturation above 74°C.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <p><strong className="text-white font-mono">Mitigating Factor (8%):</strong> Uniform hoisting cable lubrication reduced friction load baseline.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
