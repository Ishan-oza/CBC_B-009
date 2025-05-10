
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  previousValue?: number;
}

interface DashboardChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  compareKey?: string;
  gradient?: {
    start: string;
    end: string;
  };
  compareGradient?: {
    start: string;
    end: string;
  };
}

const DashboardChart = ({
  title,
  data,
  dataKey,
  compareKey,
  gradient = { start: '#8b5cf6', end: '#c4b5fd' },
  compareGradient = { start: '#94a3b8', end: '#cbd5e1' }
}: DashboardChartProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradient.start} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradient.end} stopOpacity={0}/>
              </linearGradient>
              {compareKey && (
                <linearGradient id="colorPrevValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={compareGradient.start} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={compareGradient.end} stopOpacity={0}/>
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={gradient.start} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            {compareKey && (
              <Area 
                type="monotone" 
                dataKey={compareKey} 
                stroke={compareGradient.start} 
                fillOpacity={1} 
                fill="url(#colorPrevValue)" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
