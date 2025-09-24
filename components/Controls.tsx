import React from 'react';
import { SimulationParams, SimulationStatus } from '../types';
import { GRAVITY_PRESETS, OBJECT_PRESETS } from '../constants';

interface ControlsProps {
  params: SimulationParams;
  setParams: <K extends keyof SimulationParams>(param: K, value: SimulationParams[K]) => void;
  status: SimulationStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  objectPreset: string;
  onObjectPresetChange: (presetName: string) => void;
}

const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}> = ({ label, value, min, max, step, unit, onChange, disabled }) => (
  <div>
    <label className="flex justify-between items-center text-sm font-medium text-[--text-light]">
      <span>{label}</span>
      <span className="font-mono bg-slate-200 text-slate-800 text-xs px-2 py-1 rounded">
        {value.toFixed(2)} {unit}
      </span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-2 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({
  params,
  setParams,
  status,
  start,
  pause,
  resume,
  reset,
  objectPreset,
  onObjectPresetChange
}) => {
  const isRunningOrPaused = status === SimulationStatus.Running || status === SimulationStatus.Paused;
  
  const getButtonClass = (color: string) => 
    `w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 ${color}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-[--royal-blue] border-b pb-2">Parameters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[--text-light] mb-2">Object Preset</label>
          <select 
            value={objectPreset}
            onChange={(e) => onObjectPresetChange(e.target.value)}
            disabled={isRunningOrPaused}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-[--majorelle-blue] focus:border-[--majorelle-blue] disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            {Object.keys(OBJECT_PRESETS).map(key => <option key={key} value={key}>{key}</option>)}
          </select>
        </div>
        <SliderInput
          label="Initial Height"
          value={params.initialHeight}
          min={10}
          max={10000}
          step={10}
          unit="m"
          onChange={(e) => setParams('initialHeight', parseFloat(e.target.value))}
          disabled={isRunningOrPaused}
        />
        <SliderInput
          label="Mass"
          value={params.mass}
          min={0.001}
          max={100}
          step={0.1}
          unit="kg"
          onChange={(e) => setParams('mass', parseFloat(e.target.value))}
          disabled={isRunningOrPaused}
        />
        <SliderInput
          label="Drag Coefficient"
          value={params.dragCoefficient}
          min={0}
          max={2}
          step={0.01}
          unit=""
          onChange={(e) => setParams('dragCoefficient', parseFloat(e.target.value))}
          disabled={isRunningOrPaused}
        />
        <SliderInput
          label="Cross-Sectional Area"
          value={params.crossSectionalArea}
          min={0.001}
          max={1}
          step={0.01}
          unit="m²"
          onChange={(e) => setParams('crossSectionalArea', parseFloat(e.target.value))}
          disabled={isRunningOrPaused}
        />
        <div>
          <label className="block text-sm font-medium text-[--text-light] mb-2">Gravity</label>
          <select 
            value={params.gravity}
            onChange={(e) => setParams('gravity', parseFloat(e.target.value))}
            disabled={isRunningOrPaused}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-[--majorelle-blue] focus:border-[--majorelle-blue] disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            {Object.entries(GRAVITY_PRESETS).map(([name, value]) => <option key={name} value={value}>{name} ({value} m/s²)</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
        {status === SimulationStatus.Running ? (
          <button onClick={pause} className={getButtonClass('bg-[--lavender-floral] hover:brightness-110 focus:ring-[--lavender-floral]')}>Pause</button>
        ) : (
          <button onClick={status === SimulationStatus.Paused ? resume : start} className={getButtonClass('bg-[--majorelle-blue] hover:brightness-110 focus:ring-[--majorelle-blue]')}>
            {status === SimulationStatus.Paused ? 'Resume' : status === SimulationStatus.Finished ? 'Start New' : 'Start'}
          </button>
        )}
        <button onClick={reset} className={getButtonClass('bg-[--ultra-violet] hover:brightness-110 focus:ring-[--ultra-violet]')}>Reset</button>
      </div>
    </div>
  );
};

export default Controls;