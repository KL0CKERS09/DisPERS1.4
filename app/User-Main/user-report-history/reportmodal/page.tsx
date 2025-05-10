'use client';

import React from 'react';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    title: string;
    description: string;
    category: string;
    location: string;
    createdAt: string;
    status: string;
    image?: string;
  };
}

export default function ReportDetailModal({ isOpen, onClose, report }: ReportDetailModalProps) {
  if (!isOpen) return null;

  const imageSrc =
    report.image && report.image.startsWith('data:image/')
      ? report.image
      : report.image
      ? `data:image/jpeg;base64,${report.image}`
      : null;
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-fit min-w-md overflow-hidden scale-[.8]">
        <div className="bg-blue-800 text-white text-lg font-semibold p-4 rounded-t-lg">
          Report Details
        </div>

        <div className="p-4 space-y-3">
          {imageSrc && (
            <div className="flex justify-center">
              <img
                src={imageSrc}
                alt="Report"
                className="w-64 max-h-full object-cover rounded border"
              />
            </div>
          )}
          <DetailRow label="Title" value={report.title} />
          <DetailRow label="Title" value={report.description} />
          <DetailRow label="Type" value={report.category} />
          <DetailRow label="Location" value={report.location} />
          <DetailRow label="Date" value={new Date(report.createdAt).toLocaleString()} />
          <DetailRow
            label="Status"
            value={report.status}
            valueClass={report.status === 'Active' ? 'text-red-500' : 'text-green-500'}
          />
        </div>

        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
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
    <div className="flex w-fit justify-start bg-gray-50 px-4 py-2 rounded">
      <span className="font-semibold px-5">{label}:</span>
      <span className={`italic ${valueClass}`}>{value}</span>
    </div>
  );
}
