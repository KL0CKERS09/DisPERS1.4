'use client';
import { useEffect, useState } from 'react';

interface CategoryData {
  category: string;
  count: number;
  percentage: string;
}

interface AnonymousReport {
  type: string;
}

export default function CategoryDistribution() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [totalReports, setTotalReports] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const [adminRes, anonRes] = await Promise.all([
        fetch('/api/admin/category-distribution'),
        fetch('/api/anonymous'),
      ]);

      const adminData = await adminRes.json();
      const anonData = await anonRes.json();

      const adminCategories = adminData as CategoryData[];
      const anonymousReports = anonData.reports as AnonymousReport[];

      // Count anonymous reports by type
      const anonCategoryCount: Record<string, number> = {};
      anonymousReports.forEach((report) => {
        if (report.type) {
          anonCategoryCount[report.type] = (anonCategoryCount[report.type] || 0) + 1;
        }
      });

      // Merge with admin data
      const mergedMap: Record<string, number> = {};

      adminCategories.forEach(({ category, count }) => {
        mergedMap[category] = (mergedMap[category] || 0) + count;
      });

      Object.entries(anonCategoryCount).forEach(([category, count]) => {
        mergedMap[category] = (mergedMap[category] || 0) + count;
      });

      const total = Object.values(mergedMap).reduce((sum, count) => sum + count, 0);

      const mergedData: CategoryData[] = Object.entries(mergedMap).map(([category, count]) => ({
        category,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }));

      setData(mergedData);
      setTotalReports(total);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow border mt-6">
      <h2 className="text-xl font-semibold mb-1 text-gray-800">
        Report Categories (including anonymous)
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Distribution of all reports by category, including anonymous submissions
      </p>

      <div className="flex flex-wrap gap-6">
        {data.map((item) => (
          <div
            key={item.category}
            className="w-[250px] h-[150px] bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between border hover:shadow-lg transition duration-200"
          >
            <div className="text-lg font-semibold text-gray-800 max-h-[60px] overflow-hidden">
              {item.category}
            </div>
            <div className="text-sm text-gray-500 mt-2 flex gap-2 items-center">
              <h1 className="font-bold text-2xl">{item.count}</h1> reports
            </div>
            <div className="w-full h-[5px] bg-gray-300 rounded mt-4">
              <div
                className="h-full bg-gray-700 rounded"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <hr className="mt-10" />

      <div className="mt-8 text-right text-sm text-gray-600">
        Total reports in database (including anonymous):{' '}
        <span className="font-bold text-3xl">{totalReports}</span>
      </div>
    </div>
  );
}
