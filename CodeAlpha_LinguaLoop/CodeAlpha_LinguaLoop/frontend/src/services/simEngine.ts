import type {
  CellType,
  Position,
  TelemetryData,
  RiskData,
  FeasibilityData,
  RouteMetricsData,
  RouteComparisonData,
  StructuredDecisionData,
  RobotStatus,
} from '../types/missionguard';

export class ClientSimEngine {
  width: number = 20;
  height: number = 20;
  grid: CellType[][];
  startPos: Position = { x: 2, y: 2 };
  targetPos: Position = { x: 17, y: 17 };

  robotX: number = 2;
  robotY: number = 2;
  speed: number = 1.0;
  battery: number = 92.0;
  sensorHealth: number = 96.0;
  commQuality: number = 94.0;
  status: RobotStatus = 'NAVIGATING';
  stepCount: number = 0;
  missionProgress: number = 0.0;
  totalInitialDist: number = 0.0;

  history: TelemetryData[] = [];

  constructor() {
    this.grid = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 'EMPTY' as CellType)
    );
    this.initDefaultMap();
    this.totalInitialDist = this.distance(this.startPos, this.targetPos);
  }

  initDefaultMap() {
    this.grid = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 'EMPTY' as CellType)
    );

    // Safe zone around start
    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        this.grid[y][x] = 'SAFE_ZONE';
      }
    }

    // Obstacle wall at x=8 with gap at y=10
    for (let y = 5; y <= 14; y++) {
      if (y !== 10) {
        this.grid[y][8] = 'OBSTACLE';
      }
    }

    // Hazard zone
    for (let y = 8; y <= 12; y++) {
      for (let x = 11; x <= 14; x++) {
        this.grid[y][x] = 'HAZARD';
      }
    }

    // Comm dead zone
    for (let y = 14; y <= 17; y++) {
      for (let x = 13; x <= 16; x++) {
        this.grid[y][x] = 'COMM_DEAD_ZONE';
      }
    }
  }

  distance(p1: Position, p2: Position): number {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isWalkable(x: number, y: number): boolean {
    if (!this.inBounds(x, y)) return false;
    return this.grid[y][x] !== 'OBSTACLE';
  }

  getObstacleDensity(cx: number, cy: number, radius: number = 3): number {
    let total = 0;
    let obstacles = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (this.inBounds(nx, ny)) {
          total++;
          if (this.grid[ny][nx] === 'OBSTACLE') obstacles++;
        }
      }
    }
    return total > 0 ? obstacles / total : 0;
  }

  getEnvRisk(x: number, y: number): number {
    if (!this.inBounds(x, y)) return 1.0;
    const cell = this.grid[y][x];
    if (cell === 'HAZARD') return 0.85;
    if (cell === 'COMM_DEAD_ZONE') return 0.4;
    if (cell === 'SAFE_ZONE') return 0.0;
    return 0.1;
  }

  step(): TelemetryData {
    if (this.status !== 'NAVIGATING' && this.status !== 'RETURN_TO_BASE') {
      return this.getTelemetry();
    }

    this.stepCount++;
    const dest = this.targetPos;

    if (this.robotX === dest.x && this.robotY === dest.y) {
      this.status = 'ARRIVED';
      this.missionProgress = 100.0;
      return this.getTelemetry();
    }

    const dx = dest.x - this.robotX;
    const dy = dest.y - this.robotY;

    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

    let nextX = this.robotX + stepX;
    let nextY = this.robotY + stepY;

    if (!this.isWalkable(nextX, nextY)) {
      if (stepX !== 0 && this.isWalkable(this.robotX + stepX, this.robotY)) {
        nextX = this.robotX + stepX;
        nextY = this.robotY;
      } else if (stepY !== 0 && this.isWalkable(this.robotX, this.robotY + stepY)) {
        nextX = this.robotX;
        nextY = this.robotY + stepY;
      } else {
        this.status = 'STUCK';
        return this.getTelemetry();
      }
    }

    this.robotX = nextX;
    this.robotY = nextY;

    // Battery consumption
    this.battery = Math.max(0, this.battery - 0.6);

    // Cell effects
    const currentCell = this.grid[this.robotY][this.robotX];
    if (currentCell === 'HAZARD') {
      this.sensorHealth = Math.max(0, this.sensorHealth - 2.5);
    } else if (currentCell === 'COMM_DEAD_ZONE') {
      this.commQuality = Math.max(15, this.commQuality - 12.0);
    } else if (currentCell === 'SAFE_ZONE') {
      this.commQuality = Math.min(100, this.commQuality + 5.0);
      this.sensorHealth = Math.min(100, this.sensorHealth + 1.0);
    } else {
      this.commQuality = Math.max(30, this.commQuality - 0.2);
    }

    // Progress
    const currentDist = this.distance({ x: this.robotX, y: this.robotY }, this.targetPos);
    if (this.totalInitialDist > 0) {
      this.missionProgress = Math.max(0, Math.min(100, ((this.totalInitialDist - currentDist) / this.totalInitialDist) * 100));
    }

    if (this.robotX === this.targetPos.x && this.robotY === this.targetPos.y) {
      this.status = 'ARRIVED';
      this.missionProgress = 100.0;
    }

    const telemetry = this.getTelemetry();
    this.history.push(telemetry);
    if (this.history.length > 50) this.history.shift();

    return telemetry;
  }

  getTelemetry(): TelemetryData {
    return {
      robot_id: 'rover-01',
      timestamp: new Date().toISOString(),
      position: { x: this.robotX, y: this.robotY },
      battery: Math.round(this.battery * 10) / 10,
      sensor_health: Math.round(this.sensorHealth * 10) / 10,
      communication_quality: Math.round(this.commQuality * 10) / 10,
      speed: this.speed,
      obstacle_density: Math.round(this.getObstacleDensity(this.robotX, this.robotY) * 100) / 100,
      environment_risk: Math.round(this.getEnvRisk(this.robotX, this.robotY) * 100) / 100,
      mission_progress: Math.round(this.missionProgress * 10) / 10,
      status: this.status,
      step_count: this.stepCount,
    };
  }

  evaluateRisk(telemetry: TelemetryData): RiskData {
    const batteryRisk = telemetry.battery >= 50 ? ((100 - telemetry.battery) / 100) * 0.6 : 0.3 + 0.7 * Math.pow((50 - telemetry.battery) / 50, 1.2);
    const sensorRisk = (100 - telemetry.sensor_health) / 100;
    const commRisk = (100 - telemetry.communication_quality) / 100;
    const obstacleRisk = telemetry.obstacle_density;
    const envRisk = telemetry.environment_risk;

    const components = {
      battery: Math.round(batteryRisk * 1000) / 10,
      sensor: Math.round(sensorRisk * 1000) / 10,
      communication: Math.round(commRisk * 1000) / 10,
      obstacle: Math.round(obstacleRisk * 1000) / 10,
      environment: Math.round(envRisk * 1000) / 10,
    };

    const overallScore = Math.round(
      (batteryRisk * 0.25 + sensorRisk * 0.2 + commRisk * 0.2 + obstacleRisk * 0.2 + envRisk * 0.15) * 1000
    ) / 10;

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (overallScore > 80) riskLevel = 'CRITICAL';
    else if (overallScore > 60) riskLevel = 'HIGH';
    else if (overallScore > 30) riskLevel = 'MEDIUM';

    const contributors: string[] = [];
    if (components.battery >= 50) contributors.push('battery');
    if (components.sensor >= 50) contributors.push('sensor');
    if (components.communication >= 50) contributors.push('communication');
    if (components.obstacle >= 50) contributors.push('obstacle');
    if (components.environment >= 50) contributors.push('environment');

    return {
      overall_score: overallScore,
      risk_level: riskLevel,
      components,
      primary_contributors: contributors,
      timestamp: new Date().toISOString(),
    };
  }

  evaluateFeasibility(telemetry: TelemetryData): FeasibilityData {
    const remDist = this.distance(telemetry.position, this.targetPos);
    const retDist = this.distance(this.targetPos, this.startPos);
    const envMult = 1.0 + telemetry.environment_risk * 0.4;
    const rate = 0.6 * envMult;

    const needed = (remDist + retDist) * rate + 15.0; // 15% reserve
    const deficit = needed - telemetry.battery;
    const isFeasible = deficit <= 0;

    let reason = 'FEASIBLE';
    if (!isFeasible) {
      if (telemetry.battery < remDist * rate + 15.0) {
        reason = 'INSUFFICIENT_BATTERY_FOR_MISSION';
      } else {
        reason = 'INSUFFICIENT_BATTERY_FOR_RETURN';
      }
    }

    return {
      is_feasible: isFeasible,
      remaining_distance: Math.round(remDist * 10) / 10,
      return_distance: Math.round(retDist * 10) / 10,
      estimated_energy_needed: Math.round(needed * 10) / 10,
      current_battery: telemetry.battery,
      battery_margin: 15.0,
      battery_deficit: Math.max(0, Math.round(deficit * 10) / 10),
      bottleneck_reason: reason,
      timestamp: new Date().toISOString(),
    };
  }

  evaluateDecision(
    risk: RiskData,
    feasibility: FeasibilityData,
    telemetry: TelemetryData,
    routeComp: RouteComparisonData | null
  ): StructuredDecisionData {
    const codes: string[] = [];

    if (telemetry.status === 'STUCK') {
      codes.push('ROBOT_STUCK_OR_BLOCKED');
      return {
        action: 'SAFE_STOP',
        priority: 'CRITICAL',
        risk_score: risk.overall_score,
        risk_level: risk.risk_level,
        reason_codes: codes,
        recommended_route_id: null,
        explanation_summary: 'Safe stop engaged. Robot is physically stuck or path is blocked.',
        timestamp: new Date().toISOString(),
      };
    }

    if (!feasibility.is_feasible) {
      codes.push(feasibility.bottleneck_reason);
      return {
        action: 'RETURN',
        priority: telemetry.battery < 20 ? 'CRITICAL' : 'HIGH',
        risk_score: risk.overall_score,
        risk_level: risk.risk_level,
        reason_codes: codes,
        recommended_route_id: null,
        explanation_summary: `Return to base recommended. Remaining battery (${telemetry.battery}%) is insufficient for safe completion and return.`,
        timestamp: new Date().toISOString(),
      };
    }

    if (risk.risk_level === 'CRITICAL') {
      codes.push('CRITICAL_SYSTEM_RISK');
      return {
        action: 'SAFE_STOP',
        priority: 'CRITICAL',
        risk_score: risk.overall_score,
        risk_level: risk.risk_level,
        reason_codes: codes,
        recommended_route_id: null,
        explanation_summary: `Safe stop recommended. Critical risk score (${risk.overall_score}/100) breached safety threshold.`,
        timestamp: new Date().toISOString(),
      };
    }

    if (risk.risk_level === 'HIGH') {
      codes.push('CURRENT_ROUTE_HIGH_RISK');
      if (routeComp && routeComp.is_reroute_justified) {
        codes.push('ALTERNATIVE_ROUTE_AVAILABLE');
        return {
          action: 'REROUTE',
          priority: 'HIGH',
          risk_score: risk.overall_score,
          risk_level: risk.risk_level,
          reason_codes: codes,
          recommended_route_id: routeComp.recommended_route_id,
          explanation_summary: `Reroute recommended. Current route has high risk (${risk.overall_score}/100) and a significantly safer alternative route is available.`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        action: 'SLOW',
        priority: 'HIGH',
        risk_score: risk.overall_score,
        risk_level: risk.risk_level,
        reason_codes: codes,
        recommended_route_id: null,
        explanation_summary: `Reduce speed recommended. Current route risk is high (${risk.overall_score}/100) but no safer alternative route exists.`,
        timestamp: new Date().toISOString(),
      };
    }

    if (risk.risk_level === 'MEDIUM') {
      if (risk.primary_contributors.includes('communication')) codes.push('ELEVATED_COMM_DEGRADATION');
      if (risk.primary_contributors.includes('sensor')) codes.push('ELEVATED_SENSOR_DEGRADATION');
      if (risk.primary_contributors.includes('obstacle')) codes.push('HIGH_OBSTACLE_DENSITY');
      if (codes.length === 0) codes.push('MODERATE_RISK_DETECTED');

      return {
        action: 'MONITOR',
        priority: 'MEDIUM',
        risk_score: risk.overall_score,
        risk_level: risk.risk_level,
        reason_codes: codes,
        recommended_route_id: null,
        explanation_summary: `Monitor status recommended. Moderate operational risk (${risk.overall_score}/100) detected.`,
        timestamp: new Date().toISOString(),
      };
    }

    codes.push('NOMINAL_OPERATIONS');
    return {
      action: 'CONTINUE',
      priority: 'LOW',
      risk_score: risk.overall_score,
      risk_level: risk.risk_level,
      reason_codes: codes,
      recommended_route_id: null,
      explanation_summary: `Continue mission. Operational state is nominal with low risk (${risk.overall_score}/100).`,
      timestamp: new Date().toISOString(),
    };
  }

  findNaivePath(start: Position, target: Position): Position[] {
    const path: Position[] = [];
    let curr = { ...start };
    path.push({ ...curr });

    while (curr.x !== target.x || curr.y !== target.y) {
      const dx = target.x - curr.x;
      const dy = target.y - curr.y;
      const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
      const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

      curr = { x: curr.x + stepX, y: curr.y + stepY };
      path.push({ ...curr });
    }

    return path;
  }

  evaluateRoutes(start: Position, target: Position): RouteComparisonData {
    const naivePath = this.findNaivePath(start, target);
    let naiveRiskSum = 0;
    for (const p of naivePath) {
      naiveRiskSum += Math.max(this.getEnvRisk(p.x, p.y), this.getObstacleDensity(p.x, p.y)) * 100;
    }
    const naiveRiskAvg = Math.round(naiveRiskSum / Math.max(1, naivePath.length));
    const naiveDist = Math.round(this.distance(start, target) * 10) / 10;

    const currentRoute: RouteMetricsData = {
      route_id: 'route_direct',
      distance: naiveDist,
      risk_score: naiveRiskAvg,
      total_cost: Math.round(naiveDist + naiveRiskAvg * 0.5),
      path: naivePath,
    };

    // Alternative route around wall/hazard
    const altPath: Position[] = [
      start,
      { x: 3, y: 5 },
      { x: 6, y: 10 },
      { x: 8, y: 10 }, // Wall gap
      { x: 10, y: 7 }, // Bypass hazard block
      { x: 15, y: 12 },
      target,
    ];
    const altDist = Math.round((naiveDist + 3.5) * 10) / 10;
    const altRisk = 12.0;

    const altRoute: RouteMetricsData = {
      route_id: 'route_alt_02',
      distance: altDist,
      risk_score: altRisk,
      total_cost: Math.round(altDist + altRisk * 0.5),
      path: altPath,
    };

    const riskDelta = altRisk - naiveRiskAvg;
    const isJustified = naiveRiskAvg >= 40.0;

    return {
      current_route: currentRoute,
      alternative_route: altRoute,
      recommended_route_id: isJustified ? 'route_alt_02' : 'route_direct',
      risk_delta: Math.round(riskDelta * 10) / 10,
      distance_delta: 3.5,
      is_reroute_justified: isJustified,
      rationale: isJustified
        ? `Reroute recommended. Alternative route reduces risk score by ${Math.abs(Math.round(riskDelta))} points.`
        : 'Continue current route. Risk level is acceptable.',
    };
  }
}
