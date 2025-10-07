// src/components/InteractionsGrowthChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InteractionsGrowthChartProps {
  data: any[]; // Data for the chart
}

const InteractionsGrowthChart: React.FC<InteractionsGrowthChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="likes" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="replies" stroke="#82ca9d" />
        <Line type="monotone" dataKey="impressions" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InteractionsGrowthChart;
