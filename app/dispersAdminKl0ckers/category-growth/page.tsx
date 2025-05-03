'use client';
import { useEffect, useState } from 'react';

interface CategoryData {
  category: string;
  count: number;
  percentage: string;
}

export default function CategoryDistribution() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [totalReports, setTotalReports] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/category-distribution');
      const json = await res.json();
      setData(json);
      const total = json.reduce((sum: number, item: CategoryData) => sum + item.count, 0);
      setTotalReports(total);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow border mt-6">
      <h2 className="text-xl font-semibold mb-1 text-gray-800">Report Categories</h2>
      <p className="text-sm text-gray-500 mb-6">Distribution of reports by category</p>

      <div className="flex flex-wrap gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-[250px] h-[150px] bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between border hover:shadow-lg transition duration-200"
          >
            {/* Category Title */}
            <div className="text-lg font-semibold text-gray-800 max-h-[60px] overflow-hidden">
              {item.category}
            </div>

            {/* Report Count */}
            <div className=" text-sm text-gray-500 mt-2 flex gap-2 items-center">
              <h1 className='font-bold text-2xl'>{item.count}</h1> reports
            </div>

            {/* Percentage Bar */}
            <div className="w-full h-[5px] bg-gray-300 rounded mt-4">
              <div
                className="h-full bg-gray-700 rounded"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
             {/* Total Reports Count */}
          </div>
        ))}
      </div>
      <hr className='mt-10'/>
      <div className="mt-8 text-right text-sm text-gray-600">
        Total reports in database: <span className="font-bold text-3xl">{totalReports}</span>
      </div>
    </div>
  );
}
