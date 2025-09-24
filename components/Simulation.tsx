import React from 'react';
import { SimulationStatus } from '../types';

interface SimulationProps {
  height: number;
  initialHeight: number;
  status: SimulationStatus;
}

const Simulation: React.FC<SimulationProps> = ({ height, initialHeight, status }) => {
  const fallPercentage = Math.max(0, Math.min(1, 1 - height / initialHeight));
  
  // Calculate top position for the ball, ensuring it doesn't go below ground
  const ballTopPercentage = fallPercentage * 100;
  // Position is capped so the ball rests on the ground, not halfway through it.
  const topPosition = `min(calc(${ballTopPercentage}% - 1rem), calc(100% - 3rem))`;

  
  const scaleMarkers = React.useMemo(() => {
    const markers = [];
    const numMarkers = 10;
    for (let i = 0; i <= numMarkers; i++) {
        const h = initialHeight * (i / numMarkers);
        markers.push({
            value: h.toFixed(0),
            position: `${100 - (i/numMarkers * 100)}%`
        });
    }
    return markers;
  }, [initialHeight]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full min-h-[400px]">
      <h2 className="text-xl font-bold text-[--royal-blue] border-b pb-2 mb-4">Visual Simulation</h2>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full h-full flex flex-row gap-4 items-end">
          {/* Scale */}
          <div className="h-full relative flex flex-col-reverse justify-between text-right pr-2 border-r-2 border-slate-300">
            {scaleMarkers.map(marker => (
                <div key={marker.value} className="relative">
                    <span className="text-xs text-slate-500 absolute right-full bottom-[-8px] pr-2">{marker.value}m</span>
                    <div className="w-2 h-px bg-slate-400"></div>
                </div>
            ))}
          </div>

          {/* Fall Area with Tower and Ground */}
          <div className="relative w-full h-full bg-gradient-to-b from-[#e2adf2]/20 to-slate-50 rounded-lg overflow-hidden border border-slate-200">
             {/* Tower */}
            <div 
              className="absolute bottom-0 left-[15%] w-1/4 h-full bg-slate-600 border-x-2 border-slate-800"
              style={{
                  background: 'linear-gradient(to right, #475569, #64748b, #475569)',
              }}
            >
                {/* Tower windows */}
                {Array.from({length: 10}).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1/3 aspect-square bg-sky-400/50 border border-slate-500 rounded-sm shadow-inner" 
                      style={{
                        top: `${i * 9 + 5}%`, 
                        left: '33%'
                      }}
                    ></div>
                ))}
            </div>

            {/* Ball */}
            <div
              className="absolute w-8 h-8 rounded-full shadow-lg z-10"
              style={{
                top: topPosition,
                left: '60%',
                transform: 'translateX(-50%)',
                transition: status === SimulationStatus.Idle ? 'top 0.5s ease-in-out' : 'none',
                background: 'radial-gradient(circle at 30% 30%, var(--lavender-floral), var(--ultra-violet))',
                boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.4), 2px 2px 5px rgba(0,0,0,0.3)'
              }}
              aria-label="Falling object"
              role="img"
            ></div>

            {/* Ground */}
            <div className="absolute bottom-0 w-full h-4 bg-green-700"
                style={{
                    background: 'linear-gradient(to top, #15803d, #16a34a, #22c55e)'
                }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;