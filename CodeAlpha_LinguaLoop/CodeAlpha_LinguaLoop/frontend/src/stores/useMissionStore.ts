import { create } from 'zustand';
import type {
  TelemetryData,
  RiskData,
  FeasibilityData,
  RouteComparisonData,
  StructuredDecisionData,
  LogEvent,
  CellType,
  Position,
} from '../types/missionguard';
import { ClientSimEngine } from '../services/simEngine';

interface MissionState {
  simEngine: ClientSimEngine;
  isSimulating: boolean;
  
  // Intelligence & Telemetry State
  grid: CellType[][];
  startPos: Position;
  targetPos: Position;
  telemetry: TelemetryData;
  riskAssessment: RiskData;
  feasibility: FeasibilityData;
  routeComparison: RouteComparisonData;
  decision: StructuredDecisionData;
  
  // History & Logging
  history: TelemetryData[];
  logs: LogEvent[];
  
  // Control Actions
  stepSimulation: () => void;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  applyOverride: (battery?: number, sensor?: number, comms?: number) => void;
  loadPreset: (presetName: string) => void;
}

export const useMissionStore = create<MissionState>((set, get) => {
  const sim = new ClientSimEngine();
  const initialTelemetry = sim.getTelemetry();
  const initialRisk = sim.evaluateRisk(initialTelemetry);
  const initialFeasibility = sim.evaluateFeasibility(initialTelemetry);
  const initialRoutes = sim.evaluateRoutes(sim.startPos, sim.targetPos);
  const initialDecision = sim.evaluateDecision(initialRisk, initialFeasibility, initialTelemetry, initialRoutes);

  return {
    simEngine: sim,
    isSimulating: false,
    
    grid: sim.grid,
    startPos: sim.startPos,
    targetPos: sim.targetPos,
    telemetry: initialTelemetry,
    riskAssessment: initialRisk,
    feasibility: initialFeasibility,
    routeComparison: initialRoutes,
    decision: initialDecision,
    
    history: [initialTelemetry],
    logs: [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        message: 'MissionGuard AI Control System initialized.',
      },
    ],

    stepSimulation: () => {
      const { simEngine, history, logs, decision: prevDecision } = get();
      const newTelemetry = simEngine.step();
      const newRisk = simEngine.evaluateRisk(newTelemetry);
      const newFeasibility = simEngine.evaluateFeasibility(newTelemetry);
      const newRoutes = simEngine.evaluateRoutes({ x: newTelemetry.position.x, y: newTelemetry.position.y }, simEngine.targetPos);
      const newDecision = simEngine.evaluateDecision(newRisk, newFeasibility, newTelemetry, newRoutes);

      const newHistory = [...history, newTelemetry].slice(-30);
      const newLogs = [...logs];

      // Log decision action transitions
      if (prevDecision.action !== newDecision.action) {
        const logLevel: LogEvent['level'] = 
          newDecision.action === 'SAFE_STOP' || newDecision.action === 'RETURN'
            ? 'error'
            : newDecision.action === 'REROUTE'
            ? 'warning'
            : 'info';

        newLogs.unshift({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: logLevel,
          message: `ACTION CHANGE: ${newDecision.action} (${newDecision.explanation_summary})`,
        });
      }

      set({
        telemetry: newTelemetry,
        riskAssessment: newRisk,
        feasibility: newFeasibility,
        routeComparison: newRoutes,
        decision: newDecision,
        history: newHistory,
        logs: newLogs.slice(0, 50),
      });
    },

    toggleSimulation: () => {
      set((state) => ({ isSimulating: !state.isSimulating }));
    },

    resetSimulation: () => {
      const { simEngine } = get();
      simEngine.robotX = simEngine.startPos.x;
      simEngine.robotY = simEngine.startPos.y;
      simEngine.battery = 92.0;
      simEngine.sensorHealth = 96.0;
      simEngine.commQuality = 94.0;
      simEngine.status = 'NAVIGATING';
      simEngine.stepCount = 0;
      simEngine.missionProgress = 0.0;
      simEngine.initDefaultMap();

      const newTelemetry = simEngine.getTelemetry();
      const newRisk = simEngine.evaluateRisk(newTelemetry);
      const newFeasibility = simEngine.evaluateFeasibility(newTelemetry);
      const newRoutes = simEngine.evaluateRoutes(simEngine.startPos, simEngine.targetPos);
      const newDecision = simEngine.evaluateDecision(newRisk, newFeasibility, newTelemetry, newRoutes);

      set({
        isSimulating: false,
        grid: simEngine.grid,
        telemetry: newTelemetry,
        riskAssessment: newRisk,
        feasibility: newFeasibility,
        routeComparison: newRoutes,
        decision: newDecision,
        history: [newTelemetry],
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            level: 'info',
            message: 'Simulation reset to nominal baseline state.',
          },
        ],
      });
    },

    applyOverride: (battery?: number, sensor?: number, comms?: number) => {
      const { simEngine, logs } = get();
      if (battery !== undefined) simEngine.battery = battery;
      if (sensor !== undefined) simEngine.sensorHealth = sensor;
      if (comms !== undefined) simEngine.commQuality = comms;

      const newTelemetry = simEngine.getTelemetry();
      const newRisk = simEngine.evaluateRisk(newTelemetry);
      const newFeasibility = simEngine.evaluateFeasibility(newTelemetry);
      const newRoutes = simEngine.evaluateRoutes({ x: newTelemetry.position.x, y: newTelemetry.position.y }, simEngine.targetPos);
      const newDecision = simEngine.evaluateDecision(newRisk, newFeasibility, newTelemetry, newRoutes);

      const overrideLog: LogEvent = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'warning',
        message: `Manual Override Applied: Battery=${simEngine.battery}%, Sensor=${simEngine.sensorHealth}%, Comms=${simEngine.commQuality}%`,
      };

      set({
        telemetry: newTelemetry,
        riskAssessment: newRisk,
        feasibility: newFeasibility,
        routeComparison: newRoutes,
        decision: newDecision,
        logs: [overrideLog, ...logs].slice(0, 50),
      });
    },

    loadPreset: (presetName: string) => {
      const { simEngine, logs } = get();
      if (presetName === 'SEARCH_AND_RESCUE') {
        simEngine.battery = 92.0;
        simEngine.sensorHealth = 96.0;
        simEngine.commQuality = 94.0;
        simEngine.status = 'NAVIGATING';
        simEngine.initDefaultMap();
      } else if (presetName === 'COMMUNICATION_COLLAPSE') {
        simEngine.commQuality = 18.0;
      } else if (presetName === 'HAZARD_BLOCKADE') {
        simEngine.sensorHealth = 35.0;
        simEngine.commQuality = 30.0;
      } else if (presetName === 'BATTERY_DRAIN') {
        simEngine.battery = 22.0;
      }

      const newTelemetry = simEngine.getTelemetry();
      const newRisk = simEngine.evaluateRisk(newTelemetry);
      const newFeasibility = simEngine.evaluateFeasibility(newTelemetry);
      const newRoutes = simEngine.evaluateRoutes({ x: newTelemetry.position.x, y: newTelemetry.position.y }, simEngine.targetPos);
      const newDecision = simEngine.evaluateDecision(newRisk, newFeasibility, newTelemetry, newRoutes);

      const presetLog: LogEvent = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        message: `Preset Loaded: ${presetName}`,
      };

      set({
        telemetry: newTelemetry,
        riskAssessment: newRisk,
        feasibility: newFeasibility,
        routeComparison: newRoutes,
        decision: newDecision,
        logs: [presetLog, ...logs].slice(0, 50),
      });
    },
  };
});
