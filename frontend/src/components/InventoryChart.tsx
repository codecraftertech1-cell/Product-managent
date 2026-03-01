import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { InventoryStat } from '../types';

interface InventoryChartProps {
  data: InventoryStat | null | undefined;
}

// Generate consistent color based on category name
const getCategoryColor = (category: string): string => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#EF4444', // Red
    '#A855F7', // Purple
  ];
  
  // Generate a consistent index based on the category name
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export function InventoryChart({ data }: InventoryChartProps) {
  // Transform the API response to chart format - show product names with quantities
  const chartData = data?.by_category?.map((item) => ({
    name: item.category || 'Unknown',
    value: Number(item.total_quantity),
    color: getCategoryColor(item.category || 'Unknown'),
  })) || [];

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground text-sm">
        No inventory data available
      </div>
    );
  }

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value) => [`${value} units`]}
          />
          <Legend 
            formatter={(value, entry) => {
              const data = entry.payload as { value: number; color: string };
              return `${value}: ${data?.value || 0}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}