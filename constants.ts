
import { SimulationParams } from './types';

export const AIR_DENSITY = 1.225; // kg/m^3

export const GRAVITY_PRESETS: { [key: string]: number } = {
  'Earth': 9.81,
  'Moon': 1.62,
  'Mars': 3.72,
  'Jupiter': 24.79,
  'No Gravity': 0,
};

export const OBJECT_PRESETS: { [key: string]: Partial<SimulationParams> } = {
  'Custom': {},
  'Soccer Ball': {
    mass: 0.43,
    dragCoefficient: 0.25,
    crossSectionalArea: 0.038, // d = 22cm
  },
  'Bowling Ball': {
    mass: 7.2,
    dragCoefficient: 0.4,
    crossSectionalArea: 0.036, // d = 21.6cm
  },
  'Ping Pong Ball': {
    mass: 0.0027,
    dragCoefficient: 0.5,
    crossSectionalArea: 0.00125, // d = 4cm
  },
  'Skydiver': {
    mass: 75,
    dragCoefficient: 1.0, // spread-eagle
    crossSectionalArea: 0.7,
  }
};

export const INITIAL_PARAMS: SimulationParams = {
  mass: 75, // Skydiver
  initialHeight: 1000,
  dragCoefficient: 1.0,
  crossSectionalArea: 0.7,
  gravity: GRAVITY_PRESETS.Earth,
};
