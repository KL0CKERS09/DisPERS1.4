'use client';
import { useEffect, useState } from 'react';
import UserGrowthChart from './user-growth/page';
import AreaGrowthChart from './area-growth/page';
import CategoryDistribution from './category-growth/page';
import LoadingSpinner from '../loading';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'area' | 'category'>('user');
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [usersRes, reportsRes, anonymousRes, alertsRes] = await Promise.all([
          fetch('/api/stats/users'),
          fetch('/api/stats/reports'),
          fetch('/api/stats/anonymous-report'),  // Add this
          fetch('/api/stats/alerts'),
        ]);
  
        const [users, reports, anonymousReports, alerts] = await Promise.all([
          usersRes.json(),
          reportsRes.json(),
          anonymousRes.json(), // And this
          alertsRes.json(),
        ]);
  
        setStats({
          users: users.count,
          reports: reports.count + anonymousReports.count,  // Combine both
          alerts: alerts.count,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchStats();
  }, []);
    if (loading) return <LoadingSpinner />;


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {loading ? (
            <Card title="Loading..." value="..." color="text-gray-500" />
          ) : (
            <>
              <Card title="Total Users" value={stats.users ? stats.users.toString() : '0'} color="text-orange-500" />
              <Card title="Total Reports" value={stats.reports ? stats.reports.toString() : '0'} color="text-blue-500" />
              <Card title="Alerts" value={stats.alerts ? stats.alerts.toString() : '0'} color="text-red-500" />

            </>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
          <ButtonTab text="User Growth" active={activeTab === 'user'} onClick={() => setActiveTab('user')} />
          <ButtonTab text="Area Report Growth" active={activeTab === 'area'} onClick={() => setActiveTab('area')} />
          <ButtonTab text="Types of Report Growth" active={activeTab === 'category'} onClick={() => setActiveTab('category')} />
        </div>

        {/* Conditional Chart Rendering */}
        {activeTab === 'user' && <UserGrowthChart />}
        {activeTab === 'area' && <AreaGrowthChart />}
        {activeTab === 'category' && <CategoryDistribution />}
      </div>
    </div>
  );
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span className={`${color} text-xs px-2 py-1 rounded-md`}>{text}</span>
  );
}

function ButtonTab({ text, active, onClick }: { text: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm transition ${active ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      {text}
    </button>
  );
}
