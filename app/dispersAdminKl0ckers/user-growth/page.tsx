'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserData {
  month: string;
  users: number;
}

export default function UserGrowthChart() {
  const [data, setData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/user-growth');
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h2 className="text-lg font-semibold mb-1">User Growth Trends</h2>
      <p className="text-sm text-gray-500 mb-4">Monthly active users</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
