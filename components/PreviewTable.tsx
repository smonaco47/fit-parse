
import React from 'react';
import { WorkoutSet } from '../types';

interface PreviewTableProps {
  data: WorkoutSet[];
  onDownload: () => void;
  onReset: () => void;
}

const PreviewTable: React.FC<PreviewTableProps> = ({ data, onDownload, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Extracted Sets ({data.length})</h2>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Upload New
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Download CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exercise</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reps</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Set #</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((set, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{set.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{set.exercise}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{set.weight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{set.reps}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{set.set_number}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={set.notes}>
                  {set.notes || <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewTable;
