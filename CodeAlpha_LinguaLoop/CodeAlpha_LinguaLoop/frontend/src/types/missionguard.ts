export type CellType = 'EMPTY' | 'OBSTACLE' | 'HAZARD' | 'SAFE_ZONE' | 'COMM_DEAD_ZONE';

export type RobotStatus = 'IDLE' | 'NAVIGATING' | 'ARRIVED' | 'STUCK' | 'RETURN_TO_BASE' | 'STOPPED';

export type ActionType = 'CONTINUE' | 'SLOW' | 'MONITOR' | 'REROUTE' | 'RETURN' | 'SAFE_STOP';

export type DecisionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Position {
  x: number;
  y: number;
}

export interface TelemetryData {
  robot_id: string;
  timestamp: string;
  position: Position;
  battery: number;
  sensor_health: number;
  communication_quality: number;
  speed: number;
  obstacle_density: number;
  environment_risk: number;
  mission_progress: number;
  status: RobotStatus;
  step_count: number;
}

export interface RiskData {
  overall_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  components: {
    battery: number;
    sensor: number;
    communication: number;
    obstacle: number;
    environment: number;
  };
  primary_contributors: string[];
  timestamp: string;
}

export interface FeasibilityData {
  is_feasible: boolean;
  remaining_distance: number;
  return_distance: number;
  estimated_energy_needed: number;
  current_battery: number;
  battery_margin: number;
  battery_deficit: number;
  bottleneck_reason: string;
  timestamp: string;
}

export interface RouteMetricsData {
  route_id: string;
  distance: number;
  risk_score: number;
  total_cost: number;
  path: Position[];
}

export interface RouteComparisonData {
  current_route: RouteMetricsData;
  alternative_route: RouteMetricsData | null;
  recommended_route_id: string;
  risk_delta: number;
  distance_delta: number;
  is_reroute_justified: boolean;
  rationale: string;
}

export interface StructuredDecisionData {
  action: ActionType;
  priority: DecisionPriority;
  risk_score: number;
  risk_level: string;
  reason_codes: string[];
  recommended_route_id: string | null;
  explanation_summary: string;
  timestamp: string;
}

export interface DeteriorationTrendData {
  factor_name: string;
  rate_of_change_per_step: number;
  total_window_delta: number;
  is_rapid_degradation: boolean;
  severity: 'NONE' | 'WARNING' | 'CRITICAL';
}

export interface EmergingRiskReportData {
  has_emerging_risk: boolean;
  warning_level: 'NONE' | 'WARNING' | 'CRITICAL';
  trends: Record<string, DeteriorationTrendData>;
  rapidly_deteriorating_factors: string[];
  timestamp: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}
