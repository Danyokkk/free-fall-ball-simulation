
export interface SimulationParams {
  mass: number;
  initialHeight: number;
  dragCoefficient: number;
  crossSectionalArea: number;
  gravity: number;
}

export interface SimulationState {
  time: number;
  height: number;
  velocity: number;
  acceleration: number;
}

export interface ChartDataPoint {
  time: number;
  velocity: number;
  height: number;
}

export enum SimulationStatus {
  Idle,
  Running,
  Paused,
  Finished,
}
