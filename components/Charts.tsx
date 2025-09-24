import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { ChartDataPoint } from '../types';

interface ChartsProps {
  data: ChartDataPoint[];
  terminalVelocity: number;
}

// Custom axis line components with arrows for the velocity chart
const XAxisLineWithArrow = ({ x, y, width }: any) => (
    <g>
        <line x1={x} y1={y} x2={x + width} y2={y} stroke="var(--text-dark)" strokeWidth={1.5} />
        <path d={`M ${x + width} ${y} l -10 -5 v 10 z`} fill="var(--text-dark)" />
    </g>
);

const YAxisLineWithArrow = ({ x, y, height }: any) => (
    <g>
        <line x1={x} y1={y} x2={x} y2={y - height} stroke="var(--text-dark)" strokeWidth={1.5} />
        <path d={`M ${x} ${y - height} l -5 10 h 10 z`} fill="var(--text-dark)" />
    </g>
);

const Chart: React.FC<{
    data: ChartDataPoint[];
    dataKey: keyof ChartDataPoint;
    stroke: string;
    title: string;
    unit: string;
    terminalVelocity?: number;
    isVelocityChart?: boolean;
}> = ({ data, dataKey, stroke, title, unit, terminalVelocity, isVelocityChart = false}) => {
    
    const chartStroke = isVelocityChart ? '#ef4444' : stroke;
    const chartStrokeWidth = isVelocityChart ? 3 : 2;

    return (
        <div className="h-1/2 flex flex-col">
            <h3 className="text-md font-semibold text-[--text-dark] text-center mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 40, left: 10, bottom: 20, }}
                >
                    {!isVelocityChart && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                    <XAxis 
                        dataKey="time" 
                        type="number" 
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(tick) => tick.toFixed(1)}
                        label={{ value: "Time (s)", position: isVelocityChart ? "right" : "insideBottom", offset: isVelocityChart ? 0 : -10, fill: 'var(--text-light)' }}
                        stroke="var(--text-light)"
                        axisLine={isVelocityChart ? <XAxisLineWithArrow /> : true}
                        tick={!isVelocityChart}
                        tickLine={!isVelocityChart}
                    />
                    <YAxis 
                        domain={[0, 'auto']}
                        tickFormatter={(tick) => tick.toFixed(0)}
                        label={{ value: isVelocityChart ? `Velocity (${unit})` : unit, angle: isVelocityChart ? 0 : -90, position: isVelocityChart ? 'top' : 'insideLeft', offset: isVelocityChart ? -10 : -5, dy: isVelocityChart ? -5 : 0,  fill: 'var(--text-light)' }}
                        stroke="var(--text-light)"
                        axisLine={isVelocityChart ? <YAxisLineWithArrow /> : true}
                        tick={!isVelocityChart}
                        tickLine={!isVelocityChart}
                    />
                    <Tooltip
                        formatter={(value: number) => [value.toFixed(2), unit]}
                        labelFormatter={(label: number) => `Time: ${label.toFixed(2)}s`}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(2px)', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                    />
                    {!isVelocityChart && <Legend verticalAlign="top" height={36} />}
                    
                    {isVelocityChart && terminalVelocity && isFinite(terminalVelocity) && (
                        <ReferenceLine y={terminalVelocity} stroke="#654597" strokeDasharray="5 5">
                            <Label 
                                value={`Stable speed`} 
                                position="right" 
                                fill="#654597"
                                fontSize={14}
                                dx={-10}
                            />
                        </ReferenceLine>
                    )}

                    <Line type="monotone" dataKey={dataKey} stroke={chartStroke} strokeWidth={chartStrokeWidth} dot={false} name={isVelocityChart ? "Velocity" : title} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const Charts: React.FC<ChartsProps> = ({ data, terminalVelocity }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 h-full min-h-[500px]">
        <h2 className="text-xl font-bold text-[--royal-blue] border-b pb-2">Charts</h2>
        {data.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-slate-500">
                <p>Run simulation to generate chart data.</p>
            </div>
        ) : (
            <div className="flex-grow flex flex-col gap-4">
               <Chart data={data} dataKey="velocity" stroke="var(--majorelle-blue)" title="Velocity vs. Time" unit="m/s" terminalVelocity={terminalVelocity} isVelocityChart={true} />
               <Chart data={data} dataKey="height" stroke="var(--lavender-floral)" title="Height vs. Time" unit="m" />
            </div>
        )}
    </div>
  );
};

export default Charts;