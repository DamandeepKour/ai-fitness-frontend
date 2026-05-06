// src/components/CalorieChart.jsx

import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const CalorieChart = ({ data }) => {
    return (
      <div className="h-60">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#007AFF" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default CalorieChart;