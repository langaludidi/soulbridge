'use client';

import Link from 'next/link';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PreviewControls({
  memorialId,
  memorialName
}: {
  memorialId: string;
  memorialName: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);

    try {
      // Get all print pages
      const pages = document.querySelectorAll('.print-page');
      if (!pages.length) {
        alert('No content to export');
        setIsGenerating(false);
        return;
      }

      // Create PDF in A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;

        // Simple html2canvas configuration
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true, // Allow cross-origin images
          logging: false,
          backgroundColor: '#ffffff',
          imageTimeout: 0, // No timeout
          removeContainer: true,
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');

        // Add page to PDF
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate dimensions to fit A4
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        // Ensure image doesn't exceed page height
        if (imgHeight > pageHeight) {
          const ratio = pageHeight / imgHeight;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, pageHeight);
        } else {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }
      }

      // Generate filename
      const filename = `Order-of-Service-${memorialName.replace(/\s+/g, '-')}.pdf`;

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      // Show user-friendly error with print alternative
      alert(
        `PDF Download temporarily unavailable: ${errorMsg}\n\n` +
        `Alternative: Click the "Print" button and choose "Save as PDF" from your browser's print dialog.\n` +
        `This will give you the same result with better quality.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="no-print fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href={`/memorials/${memorialId}/order-of-service`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Editor
        </Link>

        <div className="flex items-center gap-3">
          {/* Print button - Primary recommendation */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-3 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors font-medium shadow-sm"
            title="Recommended: Use browser's print dialog to save as PDF"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save as PDF
          </button>

          {/* Download PDF button - Secondary option */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center px-6 py-3 bg-[#9FB89D] text-white rounded-lg hover:bg-[#84a182] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Direct PDF download (experimental)"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quick Download
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper text */}
      <div className="max-w-7xl mx-auto mt-2 text-xs text-gray-500 text-right">
        Tip: For best quality, use "Print / Save as PDF"
      </div>
    </div>
  );
}
