import type { 
  ComponentHealth, 
  TelemetryPoint, 
  Alert, 
  MaintenanceLog, 
  XAIFactor, 
  ElevatorEntity,
  DecisionOption
} from '../types/elevator';

export const initialComponents: ComponentHealth[] = [
  {
    id: 'motor',
    name: 'Main Traction Motor',
    health: 92,
    risk: 'Low',
    failureProbability: 8,
    predictedRULMonths: 34,
    currentTemp: 52.4,
    vibrationLevel: 1.8,
    currentDraw: 42.1,
    cycleCount: 142500,
    lastMaintained: '2026-05-12',
    statusText: 'Optimal magnetic alignment and bearing smooth operation.'
  },
  {
    id: 'brake',
    name: 'Electromagnetic Brake System',
    health: 78,
    risk: 'Medium',
    failureProbability: 38,
    predictedRULMonths: 14,
    currentTemp: 68.2,
    vibrationLevel: 4.6,
    currentDraw: 18.4,
    cycleCount: 198200,
    lastMaintained: '2026-08-01',
    anomalyDetected: true,
    statusText: 'Elevated friction pad temperature & minor micro-vibration detected.'
  },
  {
    id: 'ropes',
    name: 'Steel Traction Ropes & Sheave',
    health: 84,
    risk: 'Low',
    failureProbability: 16,
    predictedRULMonths: 24,
    currentTemp: 34.0,
    vibrationLevel: 2.1,
    currentDraw: 0.0,
    cycleCount: 142500,
    lastMaintained: '2026-04-18',
    statusText: 'Tension uniform. Tensioning equalizer functioning within parameters.'
  },
  {
    id: 'doors',
    name: 'Door Operator & Interlocks',
    health: 69,
    risk: 'High',
    failureProbability: 72,
    predictedRULMonths: 6,
    currentTemp: 74.8,
    vibrationLevel: 5.9,
    currentDraw: 14.2,
    cycleCount: 310400,
    lastMaintained: '2026-06-14',
    anomalyDetected: true,
    statusText: 'Frequent door cycle re-opens due to optical sensor jitter & belt slippage.'
  },
  {
    id: 'controller',
    name: 'Microprocessor Main Controller',
    health: 88,
    risk: 'Low',
    failureProbability: 12,
    predictedRULMonths: 28,
    currentTemp: 44.5,
    vibrationLevel: 0.4,
    currentDraw: 5.2,
    cycleCount: 520000,
    lastMaintained: '2026-07-10',
    statusText: 'CAN bus communication nominal. Firm logic updates installed.'
  },
  {
    id: 'vfd',
    name: 'Variable Frequency Drive (VFD)',
    health: 73,
    risk: 'Medium',
    failureProbability: 45,
    predictedRULMonths: 11,
    currentTemp: 69.1,
    vibrationLevel: 1.2,
    currentDraw: 48.0,
    cycleCount: 410000,
    lastMaintained: '2026-05-30',
    statusText: 'Thermal capacitor degradation detected under peak acceleration curves.'
  },
  {
    id: 'guide-rails',
    name: 'Car Guide Rails & Shoes',
    health: 91,
    risk: 'Low',
    failureProbability: 9,
    predictedRULMonths: 36,
    currentTemp: 31.2,
    vibrationLevel: 1.5,
    currentDraw: 0.0,
    cycleCount: 142500,
    lastMaintained: '2026-03-22',
    statusText: 'Auto-lubricators refilled. Guide shoe wear within 0.2mm tolerance.'
  }
];

export const telemetryHistory: TelemetryPoint[] = [
  { day: 'Aug 05', temperature: 48, vibration: 1.8, motorCurrent: 38, doorCycles: 820, faultFrequency: 0 },
  { day: 'Aug 10', temperature: 50, vibration: 2.1, motorCurrent: 40, doorCycles: 890, faultFrequency: 1 },
  { day: 'Aug 15', temperature: 54, vibration: 2.5, motorCurrent: 41, doorCycles: 940, faultFrequency: 1 },
  { day: 'Aug 20', temperature: 58, vibration: 3.2, motorCurrent: 43, doorCycles: 1020, faultFrequency: 2 },
  { day: 'Aug 25', temperature: 64, vibration: 4.1, motorCurrent: 46, doorCycles: 1150, faultFrequency: 3 },
  { day: 'Aug 30', temperature: 71, vibration: 5.2, motorCurrent: 47, doorCycles: 1280, faultFrequency: 5 },
  { day: 'Sep 03', temperature: 75, vibration: 5.9, motorCurrent: 49, doorCycles: 1390, faultFrequency: 7 }
];

export const initialAlerts: Alert[] = [
  {
    id: 'alt-01',
    severity: 'high',
    component: 'Doors',
    title: 'Door Motor Temperature & Friction Alert',
    message: 'Door operator motor temperature exceeded normal threshold (74.8°C) with 72% failure probability in 6 months.',
    timestamp: '10 minutes ago',
    resolved: false
  },
  {
    id: 'alt-02',
    severity: 'medium',
    component: 'Brake',
    title: 'Brake Pad Micro-Vibration Anomaly',
    message: 'Brake vibration levels increased by 18% over the last 30 days during rapid deceleration.',
    timestamp: '2 hours ago',
    resolved: false
  },
  {
    id: 'alt-03',
    severity: 'medium',
    component: 'VFD',
    title: 'VFD Capacitor Heat Dissipation',
    message: 'Inverter heat sink temperature elevated during rush hour traffic cycles.',
    timestamp: '1 day ago',
    resolved: false
  },
  {
    id: 'alt-04',
    severity: 'normal',
    component: 'Motor',
    title: 'Main Traction Motor Calibration',
    message: 'Traction motor operating within expected speed curve and magnetic flux bounds.',
    timestamp: '3 days ago',
    resolved: true
  }
];

export const initialMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'log-01',
    date: '2026-08-01',
    type: 'Inspection',
    component: 'Brake',
    description: 'Electromagnetic brake clearance and air gap inspection completed. Pads show 3.2mm remaining wear layer.',
    technician: 'Marcus Vance (Senior IoT Field Eng)',
    status: 'Completed'
  },
  {
    id: 'log-02',
    date: '2026-07-15',
    type: 'Anomaly',
    component: 'Doors',
    description: 'Abnormal vibration detected on 7th floor door interlock contact switch.',
    technician: 'ElevAI Autonomous Monitoring',
    status: 'Completed'
  },
  {
    id: 'log-03',
    date: '2026-05-30',
    type: 'Upgrade',
    component: 'VFD',
    description: 'VFD firmware upgraded to v4.22 with regenerative energy feedback optimization.',
    technician: 'Sarah Chen (Control Systems Specialist)',
    status: 'Completed'
  },
  {
    id: 'log-04',
    date: '2026-04-18',
    type: 'Preventive',
    component: 'Ropes',
    description: 'Rope lubrication and tension equalizer adjustment completed across all 5 hoisting cables.',
    technician: 'Dave Miller (Mechanical Lead)',
    status: 'Completed'
  }
];

export const xaiFactors: XAIFactor[] = [
  {
    factor: 'Vibration Anomalies',
    percentage: 35,
    color: '#EF4444',
    impact: 'High Negative',
    detail: '+18% acceleration spikes over last 30 days in brake & door assemblies.'
  },
  {
    factor: 'Thermal Dissipation Pattern',
    percentage: 25,
    color: '#F59E0B',
    impact: 'Moderate Negative',
    detail: 'Peak operating temperatures exceed baseline by 14.2°C during high duty cycles.'
  },
  {
    factor: 'Historical Fault Frequency',
    percentage: 20,
    color: '#3B82F6',
    impact: 'Moderate Negative',
    detail: '7 door sensor retries logged in the past week.'
  },
  {
    factor: 'Component Operating Age',
    percentage: 12,
    color: '#8B5CF6',
    impact: 'Neutral',
    detail: 'Sub-components reached 68% of manufacturer design life.'
  },
  {
    factor: 'Maintenance History & Lubrication',
    percentage: 8,
    color: '#10B981',
    impact: 'Positive',
    detail: 'Recent rope alignment & guide rail lubrication lowered baseline drag.'
  }
];

export const decisionOptions: DecisionOption[] = [
  {
    id: 'repair',
    title: 'Targeted Component Repair',
    subtitle: 'Short-term Patch for Isolated Anomalies',
    description: 'Replace door operator motor, recalibrate optical door interlocks, and replace brake friction pads.',
    estimatedCost: '$2,400 - $3,800',
    downtime: '6 - 8 Hours',
    reliabilityGain: '+12%',
    extendedLifespan: '+1.5 Years',
    energySavings: '0%',
    score: 64
  },
  {
    id: 'upgrade',
    title: 'Strategic System Upgrade (Modernization)',
    subtitle: 'Optimal Data-Driven Recommendation',
    description: 'Upgrade Door Operator to smart Brushless DC system, install modern Regenerative VFD, and upgrade Controller firmware with Digital Twin integration.',
    estimatedCost: '$12,500 - $18,000',
    downtime: '1 - 2 Days',
    reliabilityGain: '+38%',
    extendedLifespan: '+8 - 10 Years',
    energySavings: '-28% Energy',
    isRecommended: true,
    score: 92
  },
  {
    id: 'replace',
    title: 'Full Elevator Replacement',
    subtitle: 'Complete Shaft & Gearless Overhaul',
    description: 'Tear out entire traction machine, hoist ropes, car frame, and doors for next-gen gearless elevator system.',
    estimatedCost: '$75,000 - $110,000',
    downtime: '14 - 21 Days',
    reliabilityGain: '+45%',
    extendedLifespan: '+25 Years',
    energySavings: '-35% Energy',
    score: 51
  }
];

export const fleetElevators: ElevatorEntity[] = [
  {
    id: 'elev-01',
    name: 'Elevator #01 (Car A)',
    location: 'North Tower - Main Passenger',
    building: 'Plaza Executive Center',
    health: 85,
    risk: 'Medium',
    failureProbability: 24,
    rulMonths: 18,
    ageYears: 12,
    recommendedAction: 'Upgrade',
    components: initialComponents
  },
  {
    id: 'elev-02',
    name: 'Elevator #02 (Car B)',
    location: 'South Tower - High Speed Express',
    building: 'Metro Financial Tower',
    health: 74,
    risk: 'Medium',
    failureProbability: 42,
    rulMonths: 11,
    ageYears: 15,
    recommendedAction: 'Upgrade',
    components: initialComponents.map(c => ({
      ...c,
      health: Math.max(40, c.health - 12),
      failureProbability: Math.min(90, c.failureProbability + 10)
    }))
  },
  {
    id: 'elev-03',
    name: 'Elevator #03 (Freight)',
    location: 'Service Shaft - Loading Bay',
    building: 'SkyLine Innovation Hub',
    health: 58,
    risk: 'High',
    failureProbability: 78,
    rulMonths: 4,
    ageYears: 19,
    recommendedAction: 'Replace',
    components: initialComponents.map(c => ({
      ...c,
      health: Math.max(30, c.health - 25),
      risk: c.health < 60 ? 'High' : 'Medium',
      failureProbability: Math.min(95, c.failureProbability + 25)
    }))
  },
  {
    id: 'elev-04',
    name: 'Elevator #04 (Car C)',
    location: 'East Wing - Low Rise',
    building: 'Tech Park HQ',
    health: 94,
    risk: 'Low',
    failureProbability: 6,
    rulMonths: 42,
    ageYears: 4,
    recommendedAction: 'Repair',
    components: initialComponents.map(c => ({
      ...c,
      health: Math.min(98, c.health + 10),
      risk: 'Low',
      failureProbability: Math.max(2, c.failureProbability - 10)
    }))
  },
  {
    id: 'elev-05',
    name: 'Elevator #05 (VIP Express)',
    location: 'Executive Suite - Sky Deck',
    building: 'Apex Tower',
    health: 91,
    risk: 'Low',
    failureProbability: 9,
    rulMonths: 38,
    ageYears: 6,
    recommendedAction: 'Repair',
    components: initialComponents.map(c => ({
      ...c,
      health: Math.min(96, c.health + 8),
      risk: 'Low'
    }))
  }
];
