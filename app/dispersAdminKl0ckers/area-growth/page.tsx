'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AreaData {
  area: string;
  reports: number;
}

export default function AreaGrowthChart() {
  const [data, setData] = useState<AreaData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/area-growth');
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow border mt-6">
      <h2 className="text-lg font-semibold mb-1">Area Report Growth</h2>
      <p className="text-sm text-gray-500 mb-4">Number of reports per area</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="area" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="reports" fill="#8884d8" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
