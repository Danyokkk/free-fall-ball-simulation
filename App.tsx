import React, { useState } from 'react';
import { SimulationParams, SimulationStatus } from './types';
import { INITIAL_PARAMS, AIR_DENSITY } from './constants';
import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import Controls from './components/Controls';
import DataDisplay from './components/DataDisplay';
import Simulation from './components/Simulation';
import Charts from './components/Charts';
import { OBJECT_PRESETS } from './constants';

const Formula: React.FC<{ title: string; equation: string }> = ({ title, equation }) => (
  <div>
    <h4 className="font-semibold text-[--lavender-floral]">{title}</h4>
    <p className="font-mono text-lg text-[--mauve] bg-black/20 p-2 rounded mt-1 overflow-x-auto">
      {equation}
    </p>
  </div>
);

const FormulaDisplay: React.FC = () => {
  return (
    <div className="bg-[--royal-blue] p-6 rounded-lg shadow-md text-white">
      <h2 className="text-xl font-bold mb-4 border-b border-[--ultra-violet] pb-2">Key Physics Formulas</h2>
      <div className="space-y-4">
        <Formula 
          title="Position (Ideal)" 
          equation="s = v₀t + ½at²" 
        />
        <Formula 
          title="Net Force (with Drag)" 
          equation="Fₙₑₜ = Fɢ - Fᴅ" 
        />
        <Formula 
          title="Drag Force" 
          equation="Fᴅ = ½ρv²CᴅA"
        />
      </div>
      <div className="mt-4 pt-4 border-t border-[--ultra-violet] text-xs text-[--lavender-floral]">
        <p>s: position, v₀: initial velocity, a: acceleration, t: time, ρ: air density, v: velocity, Cᴅ: drag coefficient, A: area.</p>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
  const [objectPreset, setObjectPreset] = useState<string>('Skydiver');
  const { status, simulationState, chartData, start, pause, resume, reset } = useSimulation(params);

  const handleParamChange = <K extends keyof SimulationParams>(
    param: K,
    value: SimulationParams[K]
  ) => {
    setParams(prev => ({ ...prev, [param]: value }));
    setObjectPreset('Custom');
  };
  
  const handleObjectPresetChange = (presetName: string) => {
    setObjectPreset(presetName);
    if (presetName !== 'Custom') {
      const presetValues = OBJECT_PRESETS[presetName];
      setParams(prev => ({...prev, ...presetValues}));
    }
  }

  const terminalVelocity = Math.sqrt((2 * params.mass * params.gravity) / (AIR_DENSITY * params.crossSectionalArea * params.dragCoefficient));

  return (
    <div className="flex flex-col min-h-screen bg-[--background] text-[--text-dark]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left Main Column: Visuals */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Simulation
              height={simulationState.height}
              initialHeight={params.initialHeight}
              status={status}
            />
            <Charts data={chartData} terminalVelocity={terminalVelocity} />
          </div>

          {/* Right Sidebar Column: Controls & Data */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Controls
              params={params}
              setParams={handleParamChange}
              status={status}
              start={start}
              pause={pause}
              resume={resume}
              reset={reset}
              objectPreset={objectPreset}
              onObjectPresetChange={handleObjectPresetChange}
            />
            <FormulaDisplay />
            <DataDisplay state={simulationState} params={params} terminalVelocity={terminalVelocity}/>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-[--text-light] text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS. Physics formulas include gravity and air resistance.</p>
      </footer>
    </div>
  );
};

export default App;