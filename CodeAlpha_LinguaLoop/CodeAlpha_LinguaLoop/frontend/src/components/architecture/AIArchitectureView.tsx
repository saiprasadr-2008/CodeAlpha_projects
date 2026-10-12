import React from 'react';
import { Workflow, Cpu, Cloud, Radio, Box, Brain, Compass, Server, CheckCircle2 } from 'lucide-react';

export const AIArchitectureView: React.FC = () => {
  // Section 13 Flow Steps
  const flowSteps = [
    { title: 'IoT Sensors', icon: <Radio className="w-5 h-5 text-cyan-400" />, desc: 'Vibration, Temp, Current, Optical Door' },
    { title: 'Data Collection', icon: <Server className="w-5 h-5 text-blue-400" />, desc: 'Edge Gateway Telemetry Buffering' },
    { title: 'Data Processing', icon: <Cpu className="w-5 h-5 text-emerald-400" />, desc: 'FFT Spectral Analysis & Noise Filter' },
    { title: 'Digital Twin', icon: <Box className="w-5 h-5 text-cyan-400" />, desc: 'Virtual Component State Synchronization' },
    { title: 'AI/ML Models', icon: <Brain className="w-5 h-5 text-amber-400" />, desc: 'LSTM Neural Networks & Random Forest' },
    { title: 'Health Prediction', icon: <Workflow className="w-5 h-5 text-blue-400" />, desc: 'Failure Probability & RUL Scoring' },
    { title: 'Risk Scoring', icon: <Compass className="w-5 h-5 text-red-400" />, desc: 'Vulnerability Matrix Classification' },
    { title: 'Decision Engine', icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />, desc: 'Prescriptive Modernization Engine' },
    { title: 'Repair / Upgrade / Replace', icon: <Box className="w-5 h-5 text-emerald-400" />, desc: 'Targeted Lifecycle Execution' }
  ];

  // Section 12 Tech Cards
  const techCards = [
    { title: 'IoT Mesh Sensors', category: 'Hardware / Edge', desc: 'Real-time multi-vector sensor monitoring for vibration, current, and temperature.', icon: <Radio className="w-6 h-6 text-cyan-400" /> },
    { title: 'Digital Twin', category: 'State Engine', desc: 'Virtual 3D-styled physical representation synced at 240Hz telemetry rates.', icon: <Box className="w-6 h-6 text-blue-400" /> },
    { title: 'AI/ML Analytics', category: 'Intelligence', desc: 'Failure prediction and RUL estimation powered by deep neural networks.', icon: <Brain className="w-6 h-6 text-amber-400" /> },
    { title: 'Python Pipeline', category: 'Data Science', desc: 'Feature engineering, signal FFT filtering, and ML development backend.', icon: <Cpu className="w-6 h-6 text-emerald-400" /> },
    { title: 'Cloud & Database', category: 'Infrastructure', desc: 'Time-series historical data storage and edge synchronization.', icon: <Cloud className="w-6 h-6 text-cyan-400" /> },
    { title: 'Analytics Dashboard', category: 'UX / Control', desc: 'Real-time visualization and decision support platform.', icon: <Workflow className="w-6 h-6 text-blue-400" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>SYSTEM PIPELINE ARCHITECTURE & TECH STACK</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            AI Pipeline & Technology Infrastructure
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end data processing workflow from edge IoT sensors to prescriptive modernization recommendations.
          </p>
        </div>
      </div>

      {/* Section 13: Animated Data Flow Diagram */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <h3 className="text-base font-bold text-white font-mono mb-2">AI Architectural Data Flow Pipeline</h3>
        <p className="text-xs text-slate-400 mb-6">Continuous streaming pipeline connecting physical elevator hardware to AI decision engine.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-2 relative">
          {flowSteps.map((step) => (
            <div key={step.title} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-col justify-between hover:border-cyan-400 transition-colors text-center">
              <div className="flex justify-center mb-2">{step.icon}</div>
              <span className="font-mono text-xs font-bold text-white mb-1 block">{step.title}</span>
              <span className="text-[9px] text-slate-400">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 12: Technology Section Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-mono">Platform Technology Stack</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCards.map((tech) => (
            <div key={tech.title} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                  {tech.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white font-mono text-base">{tech.title}</h4>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase">{tech.category}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
