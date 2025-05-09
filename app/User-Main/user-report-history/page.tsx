'use client';

import React, { useEffect, useState } from 'react';
import ReportDetailModal from './reportmodal/page';
import UserCard from '../current-user/page';
import LoadingSpinner from '@/app/loading';

interface Report {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    date: string;
    status: string;
    image?: string;
}

export default function ReportHistory() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/rep-his-alert', {
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Failed to fetch reports');

                const data = await res.json();
                setReports(data.reports);
                console.log(data.reports)
            } catch (err) {
                console.error(err);
                setError('Could not load report history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <>
            <UserCard />
            <div className="w-[80%] mx-auto p-4 mt-[5em]">


                <div className="bg-blue-900 text-white font-bold text-xl p-3 rounded mb-4">Report History</div>

                <div className="overflow-x-auto bg-white rounded shadow-lg">
                    <div className="overflow-x-auto w-full border border-gray-200 rounded">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* Table Head */}
                            <thead>
                                <tr className="bg-gray-100 h-[2em] text-left">
                                    <th className="w-[3em] px-2 py-1 font-semibold border-r border-gray-200 overflow-hidden truncate">#</th>
                                    <th className="w-[6em] px-2 py-1 font-semibold border-r border-gray-200 overflow-hidden truncate">Title</th>
                                    <th className="w-[3em] px-2 py-1 font-semibold border-r border-gray-200 overflow-hidden truncate">Type</th>
                                    <th className="w-[5em] px-2 py-1 font-semibold border-r border-gray-200 overflow-hidden truncate">Location</th>
                                    <th className="w-[6em] px-2 py-1 font-semibold border-r border-gray-200 overflow-hidden truncate">Date</th>
                                    <th className="w-[4em] px-2 py-1 font-semibold border-r border-gray-200 overflow-hidden truncate">Status</th>
                                    <th className="w-[8em] px-2 py-1 font-semibold overflow-hidden truncate">Actions</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200">
                                {reports.length > 0 ? (
                                    reports.map((report, index) => (
                                        <tr key={report.id} className="h-[2em] text-gray-700">
                                            <td className="w-[3em] px-2 py-1 border-r border-gray-200 overflow-hidden truncate" title={index + 1}>
                                                {index + 1}
                                            </td>
                                            <td className="w-[6em] px-2 py-1 border-r border-gray-200 overflow-hidden truncate" title={report.title}>
                                                {report.title}
                                            </td>
                                            <td className="w-[3em] px-2 py-1 border-r border-gray-200 overflow-hidden truncate" title={report.type}>
                                                <div className='max-w-[10em] overflow-hidden'>
                                                    {report.type}
                                                </div>
                                            </td>
                                            <td className="w-[5em] px-2 py-1 border-r border-gray-200 overflow-hidden truncate" title={report.location}>
                                                <div className='max-w-[10em] overflow-hidden'>
                                                    {report.location}
                                                </div>
                                            </td>
                                            <td className="w-[6em] px-2 py-1 border-r border-gray-200 overflow-hidden truncate" title={new Date(report.date).toLocaleString()}>
                                                {new Date(report.date).toLocaleString()}
                                            </td>
                                            <td className="w-[4em] px-2 py-1 border-r border-gray-200 overflow-hidden truncate">
                                                <span className={`font-bold ${report.status === 'Active' ? 'text-red-500' : 'text-green-500'}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="w-[8em] px-2 py-1 overflow-hidden truncate">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-gray-600">
                                            No reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedReport && (
                <ReportDetailModal
                    isOpen={!!selectedReport}
                    onClose={() => setSelectedReport(null)}
                    report={selectedReport}
                />
            )}
        </>
    );
}
