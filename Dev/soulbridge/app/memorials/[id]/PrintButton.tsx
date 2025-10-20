'use client';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Save & Print
      </h3>
      <button
        onClick={handlePrint}
        className="inline-flex items-center px-6 py-3 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print or Save as PDF
      </button>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Use your browser's print dialog to save this memorial as a PDF or print a physical copy
      </p>
    </div>
  );
}
