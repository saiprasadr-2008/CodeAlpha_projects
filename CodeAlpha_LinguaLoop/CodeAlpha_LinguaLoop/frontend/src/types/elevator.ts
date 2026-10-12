export type RiskLevel = 'Low' | 'Medium' | 'High';

export type ComponentId = 
  | 'motor' 
  | 'brake' 
  | 'ropes' 
  | 'doors' 
  | 'controller' 
  | 'vfd' 
  | 'guide-rails';

export interface ComponentHealth {
  id: ComponentId;
  name: string;
  health: number; // 0 - 100%
  risk: RiskLevel;
  failureProbability: number; // 0 - 100%
  predictedRULMonths: number;
  currentTemp: number; // °C
  vibrationLevel: number; // mm/s
  currentDraw: number; // Amps
  cycleCount: number;
  lastMaintained: string;
  statusText: string;
  anomalyDetected?: boolean;
}

export interface TelemetryPoint {
  day: string;
  temperature: number;
  vibration: number;
  motorCurrent: number;
  doorCycles: number;
  faultFrequency: number;
}

export interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'normal';
  component: string;
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  type: 'Inspection' | 'Repair' | 'Upgrade' | 'Anomaly' | 'Preventive';
  component: string;
  description: string;
  technician: string;
  status: 'Completed' | 'Scheduled' | 'In Progress';
}

export interface DecisionOption {
  id: 'repair' | 'upgrade' | 'replace';
  title: string;
  subtitle: string;
  description: string;
  estimatedCost: string;
  downtime: string;
  reliabilityGain: string;
  extendedLifespan: string;
  energySavings: string;
  isRecommended?: boolean;
  score: number;
}

export interface XAIFactor {
  factor: string;
  percentage: number;
  color: string;
  impact: 'High Negative' | 'Moderate Negative' | 'Neutral' | 'Positive';
  detail: string;
}

export interface ElevatorEntity {
  id: string;
  name: string;
  location: string;
  building: string;
  health: number;
  risk: RiskLevel;
  failureProbability: number;
  rulMonths: number;
  ageYears: number;
  recommendedAction: 'Repair' | 'Upgrade' | 'Replace';
  components: ComponentHealth[];
}
