
import { useState, useRef, useCallback, useEffect } from 'react';
import { SimulationParams, SimulationState, ChartDataPoint, SimulationStatus } from '../types';
import { AIR_DENSITY } from '../constants';

const getInitialState = (params: SimulationParams): SimulationState => ({
  time: 0,
  height: params.initialHeight,
  velocity: 0,
  acceleration: params.gravity,
});

export const useSimulation = (params: SimulationParams) => {
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.Idle);
  const [simulationState, setSimulationState] = useState<SimulationState>(() => getInitialState(params));
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setStatus(SimulationStatus.Idle);
    setSimulationState(getInitialState(params));
    setChartData([]);
    lastTimeRef.current = null;
  }, [params]);
  
  // Effect to reset the simulation whenever parameters change
  useEffect(() => {
    reset();
  }, [reset]);


  const runSimulation = useCallback((currentTime: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime;
      animationFrameId.current = requestAnimationFrame(runSimulation);
      return;
    }

    const dt = (currentTime - lastTimeRef.current) / 1000; // time in seconds
    lastTimeRef.current = currentTime;

    setSimulationState(prevState => {
      const { mass, dragCoefficient, crossSectionalArea, gravity } = params;

      // Calculate forces
      const forceGravity = mass * gravity;
      const forceDrag = 0.5 * AIR_DENSITY * Math.pow(prevState.velocity, 2) * dragCoefficient * crossSectionalArea;
      const netForce = forceGravity - forceDrag;

      // Calculate new state
      const acceleration = netForce / mass;
      const newVelocity = prevState.velocity + acceleration * dt;
      const newHeight = prevState.height - newVelocity * dt;

      const newState = {
        time: prevState.time + dt,
        height: newHeight,
        velocity: newVelocity,
        acceleration: acceleration,
      };

      setChartData(currentChartData => [
          ...currentChartData,
          { time: newState.time, velocity: newState.velocity, height: newState.height }
      ]);
      
      if (newHeight <= 0) {
        setStatus(SimulationStatus.Finished);
        const finalState = { ...newState, height: 0, velocity: newVelocity };
        setChartData(currentChartData => [
            ...currentChartData.slice(0, -1),
             { time: finalState.time, velocity: finalState.velocity, height: finalState.height }
        ]);
        return finalState;
      } else {
        animationFrameId.current = requestAnimationFrame(runSimulation);
        return newState;
      }
    });
  }, [params]);

  const start = () => {
    if (status === SimulationStatus.Finished) {
        reset();
    }
    setStatus(SimulationStatus.Running);
    lastTimeRef.current = performance.now();
    animationFrameId.current = requestAnimationFrame(runSimulation);
  };
  
  const pause = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setStatus(SimulationStatus.Paused);
  };

  const resume = () => {
    setStatus(SimulationStatus.Running);
    lastTimeRef.current = performance.now();
    animationFrameId.current = requestAnimationFrame(runSimulation);
  }

  return { status, simulationState, chartData, start, pause, resume, reset };
};
