import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SessionDataPoint } from '../types';

interface Props {
  data: SessionDataPoint[];
}

const SessionChart: React.FC<Props> = ({ data }) => {
  // We only show the last 60 points to keep the graph moving smoothly
  const visibleData = data.slice(-60);

  return (
    <div className="w-full h-64 bg-neuro-800/50 rounded-xl p-4 border border-neuro-700 shadow-inner backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neuro-cyan">Real-time EEG</h3>
        <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neuro-purple"></span> Alpha
            </div>
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neuro-accent"></span> Theta
            </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={visibleData}>
          <defs>
            <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTheta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis hide dataKey="timestamp" />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="alpha" 
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorAlpha)" 
            isAnimationActive={false} 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="theta" 
            stroke="#22d3ee" 
            fillOpacity={1} 
            fill="url(#colorTheta)" 
            isAnimationActive={false} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionChart;