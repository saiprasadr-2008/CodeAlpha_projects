import React from 'react';
import type { ElevatorEntity, ComponentHealth } from '../../types/elevator';
import { ElevatorDigitalTwin } from '../digital-twin/ElevatorDigitalTwin';
import { 
  Bot, 
  ArrowRight, 
  ShieldAlert, 
  DollarSign, 
  HelpCircle, 
  Radio, 
  Cpu, 
  Box, 
  Brain, 
  Compass
} from 'lucide-react';

interface LandingPageProps {
  currentElevator: ElevatorEntity;
  onSelectComponent: (comp: ComponentHealth) => void;
  onNavigateToDashboard: () => void;
  onNavigateToTwin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentElevator,
  onSelectComponent,
  onNavigateToDashboard,
  onNavigateToTwin
}) => {
  return (
    <div className="space-y-16 py-4">
      {/* SECTION 2: HERO SECTION */}
      <section className="relative glass-panel rounded-3xl p-8 lg:p-12 border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI + IoT DIGITAL TWIN PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Elev<span className="text-gradient-cyan">AI</span> Twin
            </h1>

            <h2 className="text-lg sm:text-xl font-bold text-cyan-300 font-mono">
              AI-Powered Elevator Modernization Decision Platform
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-sans max-w-xl">
              Predict elevator failures. Optimize maintenance. Make smarter modernization decisions.
            </p>

            {/* CTA Buttons (Section 2 Requirement) */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onNavigateToDashboard}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-sm shadow-xl glow-cyan flex items-center space-x-3 transition-all hover:scale-105"
              >
                <span>View Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToTwin}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-sm flex items-center space-x-3 transition-all hover:scale-105"
              >
                <Box className="w-4 h-4 text-cyan-400" />
                <span>Explore Digital Twin</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D-styled Digital Elevator Representation (Section 2 Requirement) */}
          <div className="lg:col-span-6">
            <ElevatorDigitalTwin
              components={currentElevator.components}
              onSelectComponent={onSelectComponent}
              systemHealth={85}
              riskLevel="Medium"
              predictedRULMonths={18}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: PROBLEM SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">INDUSTRY CHALLENGE</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            “Elevator Maintenance Should Be Predictive, Not Reactive.”
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Aging elevators can operate while their components gradually deteriorate. Building owners often lack a unified system to understand component health and decide whether to repair, upgrade, or replace equipment.
          </p>
        </div>

        {/* 3 Problem Cards (Section 3 Requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-red-500/30 hover:border-red-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono">Unexpected Breakdowns</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unexpected component failures cause critical building downtime, trapping passengers and halting operations.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono">High Maintenance Costs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reactive maintenance emergency callouts and repeated spot repairs exponentially increase operational expenses.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono">Uncertain Decisions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Owners lack data-driven information to objectively decide between repair, targeted upgrade, and full replacement.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: SOLUTION SECTION */}
      <section className="glass-panel p-8 lg:p-12 rounded-3xl border border-cyan-500/30 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">THE PLATFORM SOLUTION</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            “One Intelligent Platform. Smarter Elevator Decisions.”
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            ElevAI Twin combines real-time IoT sensor telemetry and historical elevator data to provide predictive insights and modernization recommendations.
          </p>
        </div>

        {/* Animated Workflow Connecting Steps (Section 4 Requirement) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-center relative">
          {[
            { step: 'IoT Sensors', icon: <Radio className="w-5 h-5 text-cyan-400" /> },
            { step: 'Data Processing', icon: <Cpu className="w-5 h-5 text-blue-400" /> },
            { step: 'Digital Twin', icon: <Box className="w-5 h-5 text-emerald-400" /> },
            { step: 'AI/ML Prediction', icon: <Brain className="w-5 h-5 text-amber-400" /> },
            { step: 'Risk Analysis', icon: <ShieldAlert className="w-5 h-5 text-red-400" /> },
            { step: 'Decision Engine', icon: <Compass className="w-5 h-5 text-cyan-400" /> }
          ].map((item) => (
            <div key={item.step} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center space-y-2 relative group hover:border-cyan-400 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-mono text-xs font-bold text-white">{item.step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 18: FOOTER */}
      <footer className="border-t border-cyan-500/20 pt-8 pb-12 space-y-6 text-xs text-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <span className="font-extrabold text-white text-lg font-mono">Elev<span className="text-cyan-400">AI</span> Twin</span>
            <p className="text-slate-400 leading-relaxed">
              “Smarter elevators through AI-powered predictive maintenance.”
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white font-mono mb-2">Product</h4>
            <ul className="space-y-1">
              <li><button onClick={onNavigateToDashboard} className="hover:text-cyan-300">Live Dashboard</button></li>
              <li><button onClick={onNavigateToTwin} className="hover:text-cyan-300">Digital Twin Schema</button></li>
              <li><a href="#simulator" className="hover:text-cyan-300">What-If Simulator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white font-mono mb-2">Technology</h4>
            <ul className="space-y-1">
              <li>Industrial IoT Mesh</li>
              <li>Explainable AI (XAI)</li>
              <li>Prescriptive Analytics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white font-mono mb-2">About</h4>
            <p className="text-slate-400">
              Built for intelligent elevator modernization & smart city facility management.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <span>© 2026 ElevAI Twin. All rights reserved. Hackathon & Enterprise Edition.</span>
          <span>Built for intelligent elevator modernization.</span>
        </div>
      </footer>
    </div>
  );
};
