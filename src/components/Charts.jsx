import React from 'react';
import { PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

// Color palette for pie chart slices
const COLORS = [
  '#1E40AF', '#3B82F6', '#93C5FD', '#10B981', '#14B8A6', 
  '#FB923C', '#F97316', '#EF4444', '#9333EA', '#8B5CF6'
];

// Generates custom colors for any number of categories
const getColor = (index) => {
  return COLORS[index % COLORS.length];
};

const formatCurrency = (value) => {
  return `$${value.toFixed(2)}`;
};

const Charts = ({ spendingByCategory, spendingOverTime }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown */}
      <div className="card animate-fade-in h-[400px]">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon size={20} className="text-primary-700" />
          <h2 className="text-xl font-semibold">Spending by Category</h2>
        </div>
        
        {spendingByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No data available
          </div>
        )}
      </div>
      
      {/* Spending Over Time */}
      <div className="card animate-fade-in h-[400px]">
        <div className="flex items-center gap-2 mb-4">
          <LineChartIcon size={20} className="text-primary-700" />
          <h2 className="text-xl font-semibold">Spending Trend</h2>
        </div>
        
        {spendingOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={spendingOverTime}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'MMM d')}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                labelFormatter={(date) => format(parseISO(date), 'MMMM d, yyyy')}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#1E40AF"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;