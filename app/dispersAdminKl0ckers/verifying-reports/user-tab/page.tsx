'use client';

import { report } from 'process';
import { useState, useEffect } from 'react';

interface Report {
    id: string;
    status: string;
    category: string;
    severity: string;
    location: string;
    createdAt: string; // <-- was previously 'date'
    reporter: string;
    description?: string;
    image?: string;
    title: string;
    user?: {
        username: string;
        profilePicture?: string;
    };
}


export default function UserTab() {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const [filterRange, setFilterRange] = useState<'1d' | '1w' | '1m' | '1y' | null>(null);

    useEffect(() => {
        fetch('/api/admin/reportsPendingVerification')
            .then((res) => res.json())
            .then((data) => setReports(data.reverse()))
            .catch((err) => console.error(err));
    }, []);

    const handleVerify = async (id: string) => {
        await fetch(`/api/admin/verifyReport/${id}`, { method: 'POST' });
        setReports((prev) =>
            prev.map((report) =>
                report.id === id ? { ...report, status: 'Resolved' } : report
            )
        );
    };

    const handleActivate = async (id: string) => {
        await fetch(`/api/admin/activateReport/${id}`, { method: 'POST' });
        setReports((prev) =>
            prev.map((report) =>
                report.id === id ? { ...report, status: 'Active' } : report
            )
        );
    };

    const openModal = async (id: string) => {
        const res = await fetch(`/api/admin/getReportDetails/${id}`);
        const data = await res.json();

        const mappedReport: Report = {
            id: data._id,
            status: data.status,
            category: data.category,
            severity: data.severity,
            location: data.location,
            createdAt: data.createdAt,
            reporter: data.user?.username || 'Unknown',
            description: data.description,
            image: data.image,
            title: data.title,
            user: data.user || undefined,
        };

        setSelectedReport(mappedReport);
        setModalOpen(true); // Open the modal when selecting a report
    };

    const filteredReports = reports.filter((report) => {
        const matchesDate = (() => {
            if (!filterRange) return true;
    
            const now = new Date();
            const createdAt = new Date(report.createdAt);
            const compareDate = new Date();
    
            switch (filterRange) {
                case '1d':
                    compareDate.setDate(now.getDate() - 1);
                    break;
                case '1w':
                    compareDate.setDate(now.getDate() - 7);
                    break;
                case '1m':
                    compareDate.setMonth(now.getMonth() - 1);
                    break;
                case '1y':
                    compareDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
    
            return createdAt >= compareDate;
        })();
    
        const matchesSearch =
            report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.category.toLowerCase().includes(searchTerm.toLowerCase());
    
        return matchesDate && matchesSearch;
    });
    
    console.log(report)
    

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                User Account Pending Reports
            </h2>

            {/* Search bar */}
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="flex gap-2">
                    {(['1d', '1w', '1m', '1y'] as const).map((range) => (
                        <button
                            key={range}
                            className={`px-3 py-1 rounded border ${filterRange === range ? 'bg-blue-600 text-white' : 'bg-white'}`}
                            onClick={() => setFilterRange(range)}
                        >
                            {range === '1d' ? '1 Day' : range === '1w' ? '1 Week' : range === '1m' ? '1 Month' : '1 Year'}
                        </button>
                    ))}
                    <button
                        onClick={() => setFilterRange(null)}
                        className="px-3 py-1 border rounded bg-gray-100"
                    >
                        Clear
                    </button>
                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                <table className="min-w-full table-auto text-gray-600">
                    <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Title</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Type</th>
                            <th className="px-6 py-3 text-left">Severity</th>
                            <th className="px-6 py-3 text-left">Location</th>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Reporter</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredReports.map((report, index) => (
                            <tr
                                key={report.id}
                                className="border-t hover:bg-gray-300 cursor-pointer"
                                onClick={() => openModal(report.id)}
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4 max-w-[10em] truncate">{report.title}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${report.status === 'Resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 max-w-[10em] truncate">{report.category}</td>
                                <td className="px-6 py-4">{report.severity}</td>
                                <td className="px-6 py-4 max-w-[10em] truncate">{report.location}</td>
                                <td className="px-6 py-4">{new Date(report.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4">{report.user?.username || 'Unknown User'}</td>
                                <td className="px-6 py-4 flex gap-3" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className={`px-4 py-2 rounded text-white transition-all duration-300 ${report.status === 'Resolved' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                        onClick={() => handleVerify(report.id)}
                                        disabled={report.status === 'Resolved'}
                                    >
                                        Verify
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-green-600"
                                        onClick={() => handleActivate(report.id)}
                                    >
                                        Activate
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && selectedReport && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 h-[100vh]">
                    <div className="bg-white rounded-lg shadow-lg w-fit min-w-[40em] max-w-[80vw] max-h-[1000px] overflow-hidden scale-[.7]">
                        <div className="bg-blue-800 text-white text-lg font-semibold p-4 rounded-t-lg">
                            Report Details
                        </div>
                        <div className="p-4 flex flex-col gap-5">
                            {/* Profile Section */}
                            <div className="flex items-center md:items-start gap-2 min-w-[160px] h-[5em]">
                                {selectedReport.user?.profilePicture ? (
                                    <img
                                        src={selectedReport.user.profilePicture}
                                        alt="Reporter"
                                        className="w-20 h-20 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl">
                                        ?
                                    </div>
                                )}
                                <div className="text-center h-[100%] md:text-left flex flex-col items-start justify-center">
                                    <p className="text-lg font-semibold">{selectedReport.user?.username || 'Unknown User'}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(selectedReport.createdAt).toLocaleString()}
                                    </p>

                                </div>
                            </div>

                            {/* Report Details */}
                            <div className="flex-1 space-y-3">
                                {selectedReport.image && (
                                    <div className="flex justify-center">
                                        <img
                                            src={selectedReport.image}
                                            alt="Report"
                                            className="w-64 max-h-full object-cover rounded border cursor-zoom-in hover:opacity-80 transition"
                                            onClick={() => setZoomImage(selectedReport.image ?? null)}
                                        />
                                    </div>
                                )}

                                <DetailRow label="Title" value={selectedReport.title} />
                                <DetailRow label="Status" value={selectedReport.status} />
                                <DetailRow label="Category" value={selectedReport.category} />
                                <DetailRow label="Severity" value={selectedReport.severity} />
                                <DetailRow label="Location" value={selectedReport.location} />
                                <DetailRow label="Reporter ID" value={selectedReport.reporter} />

                                {selectedReport.description && (
                                    <div className="bg-gray-50 px-4 py-2 rounded">
                                        <span className="font-semibold block mb-1">Description:</span>
                                        <p className="italic whitespace-pre-wrap break-words max-h-60 overflow-y-auto pr-2">
                                            {selectedReport.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex justify-end">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Zoom Image */}
            {zoomImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 cursor-zoom-out"
                    onClick={() => setZoomImage(null)}
                >
                    <img
                        src={zoomImage}
                        alt="Zoomed"
                        className="max-w-5xl max-h-[90vh] object-contain rounded shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}

function DetailRow({
    label,
    value,
    valueClass = '',
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="flex w-fit justify-start gap-5 bg-gray-50 px-4 py-2 rounded">
            <span className="font-semibold">{label}:</span>
            <span className={`italic ${valueClass} w-fit`}>{value}</span>
        </div>
    );
}