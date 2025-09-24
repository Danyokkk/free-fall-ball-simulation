import React from 'react';
import { SimulationState, SimulationParams } from '../types';
import { AIR_DENSITY } from '../constants';

interface DataDisplayProps {
  state: SimulationState;
  params: SimulationParams;
  terminalVelocity: number;
}

const DataItem: React.FC<{ label: string; value: string; unit: string;}> = ({ label, value, unit }) => (
    <div className="bg-slate-100 p-3 rounded-lg flex justify-between items-baseline border-l-4 border-slate-100 hover:border-[--lavender-floral] transition-colors duration-200">
        <span className="text-sm text-[--text-light]">{label}</span>
        <span className="font-mono text-lg font-semibold text-[--text-dark]">
            {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
        </span>
    </div>
);

const DataDisplay: React.FC<DataDisplayProps> = ({ state, params, terminalVelocity }) => {
  const forceGravity = params.mass * params.gravity;
  const forceDrag = 0.5 * AIR_DENSITY * Math.pow(state.velocity, 2) * params.dragCoefficient * params.crossSectionalArea;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-[--royal-blue] border-b pb-2">Real-Time Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <DataItem label="Time" value={state.time.toFixed(2)} unit="s" />
            <DataItem label="Height" value={state.height.toFixed(2)} unit="m" />
            <DataItem label="Velocity" value={state.velocity.toFixed(2)} unit="m/s" />
            <DataItem label="Acceleration" value={state.acceleration.toFixed(2)} unit="m/s²" />
            <DataItem label="Force of Gravity" value={forceGravity.toFixed(2)} unit="N" />
            <DataItem label="Force of Drag" value={forceDrag.toFixed(2)} unit="N" />
            <DataItem label="Terminal Velocity" value={isFinite(terminalVelocity) ? terminalVelocity.toFixed(2) : 'N/A'} unit="m/s" />
        </div>
    </div>
  );
};

export default DataDisplay;