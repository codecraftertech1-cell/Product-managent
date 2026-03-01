import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { productAPI } from '../services/api';
import type { InventoryStat } from '../types';

// Generate consistent color based on product name - SAME as InventoryChart
const getProductColor = (name: string): string => {
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
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export function TrendChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await productAPI.getStats();
      const stats: InventoryStat = statsRes.data;
      
      // Get products and sort by quantity (highest to lowest)
      const products = stats.by_category
        .map((item) => ({
          name: item.category || 'Unknown',
          quantity: Number(item.total_quantity),
          color: getProductColor(item.category || 'Unknown'),
        }))
        .sort((a, b) => b.quantity - a.quantity);
      
      // Create data for line chart
      // X-axis shows product names, each line represents a product
      const data = products.map((product) => ({
        name: product.name,
        [product.name]: product.quantity,
        quantity: product.quantity,
        color: product.color,
      }));
      
      // Create lines configuration
      const lineConfig = products.map((product) => ({
        dataKey: product.name,
        stroke: product.color,
        strokeWidth: 2,
        dot: { fill: product.color, strokeWidth: 2 },
        activeDot: { r: 6, fill: product.color },
      }));
      
      setChartData(data);
      setLines(lineConfig);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground text-sm">
        No product data available
      </div>
    );
  }

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="name" 
            stroke="#94A3B8" 
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line 
              key={index}
              type="monotone" 
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              dot={line.dot}
              activeDot={line.activeDot}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}