'use client';

import { useEffect, useState } from 'react';

interface AnonymousReport {
  _id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  email: string;
  image: string;
  createdAt: string;
  status: string;
}

export default function AnonymousTab() {
  const [reports, setReports] = useState<AnonymousReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AnonymousReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRange, setFilterRange] = useState<'1d' | '1w' | '1m' | '1y' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AnonymousReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/admin/anonymous-report');
        const data = await response.json();

        if (Array.isArray(data.reports)) {
          setReports(data.reports);
          setFilteredReports(data.reports);
        } else {
          console.error('Expected array but got:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((report) =>
        report.title.toLowerCase().includes(term) || report.type.toLowerCase().includes(term)
      );
    }

    // Date filter
    if (filterRange) {
      const now = new Date();
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

      filtered = filtered.filter(
        (report) => new Date(report.createdAt) >= compareDate
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, filterRange, reports]);

  const handleStatusUpdate = async (_id: string, status: 'Active' | 'Resolved') => {
    try {
      const res = await fetch(`/api/admin/anonymous-report/${_id}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r._id === _id ? { ...r, status } : r))
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };



  const openModal = (report: AnonymousReport) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Anonymous Reports</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title or type..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {loading ? (
        <p>Loading...</p>
      ) : filteredReports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full table-auto text-gray-600">
            <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr
                  key={report._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => openModal(report)}
                >
                  <td className="px-4 py-2 text-xs">{index + 1}</td>
                  <td className="px-4 py-2 text-xs">{report.title}</td>
                  <td className="px-4 py-2 text-xs">
                    <div className='max-w-[10em]'>
                      {report.type}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs">{report.description}</td>
                  <td className="px-4 py-2 text-xs">{report.location}</td>
                  <td className="px-4 py-2 text-xs">{report.email}</td>

                  <td className="px-4 py-2">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${report.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'Resolved'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {report.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(report._id, 'Active');
                      }}
                      disabled={report.status === 'Active'}
                      className={`px-4 py-2 rounded text-white transition-all duration-300 ${report.status === 'Active'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                      Activate
                    </button>


                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(report._id, 'Resolved');
                      }}
                      disabled={report.status === 'Resolved'}
                      className={`w-full px-3 py-1 rounded z-99 text-white transition-all duration-300 ${report.status === 'Resolved'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                      Verify
                    </button>



                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for report details */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg w-fit min-w-[40em] max-w-[80vw] max-h-[1000px] overflow-hidden scale-[.8]">
            <div className="bg-blue-800 text-white text-lg font-semibold p-4 rounded-t-lg">
              Report Details
            </div>
            <div className="p-4 flex flex-col gap-5 ">
              {/* Report Details */}
              {selectedReport.image && (
                <div className="flex flex-col items-center gap-2 w-full h-[20em] overflow-hidden">
                  <img
                    src={selectedReport.image}
                    alt="Report Image"
                    className="h-full  rounded "
                  />
                </div>
              )}

              <DetailRow label="Title" value={selectedReport.title} />
              <DetailRow label="Type" value={selectedReport.type} />
              <DetailRow label="Description" value={selectedReport.description} />
              <DetailRow label="Location" value={selectedReport.location} />
              <DetailRow label="Email" value={selectedReport.email} />
              <DetailRow label="Created At" value={new Date(selectedReport.createdAt).toLocaleString()} />
              <DetailRow label="Status" value={selectedReport.status || 'Pending'} />
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-start gap-[2em]">
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}