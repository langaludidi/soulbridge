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

    // Store references to removed stylesheets so we can restore them
    const removedStylesheets: { element: Element; parent: Node; nextSibling: Node | null }[] = [];

    try {
      // Get all print pages
      const pages = document.querySelectorAll('.print-page');
      if (!pages.length) {
        alert('No content to export');
        setIsGenerating(false);
        return;
      }

      // Set crossOrigin on all images to avoid CORS issues
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.crossOrigin) {
          img.crossOrigin = 'anonymous';
        }
      });

      // STEP 1: Read ALL computed styles FIRST (while stylesheets are still present)
      const allElements = document.querySelectorAll('*');
      const originalStyles = new Map<Element, string>();
      const computedStylesMap = new Map<Element, CSSStyleDeclaration>();

      allElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        // Save original inline style
        originalStyles.set(el, htmlEl.getAttribute('style') || '');
        // Save computed style (this has correct values because CSS is still loaded)
        computedStylesMap.set(el, window.getComputedStyle(el));
      });

      // STEP 2: Remove stylesheets from the document
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
      styleSheets.forEach(sheet => {
        removedStylesheets.push({
          element: sheet,
          parent: sheet.parentNode!,
          nextSibling: sheet.nextSibling
        });
        sheet.remove();
      });

      // STEP 3: Apply the saved computed styles as inline (now they're RGB from browser)
      allElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const computedStyle = computedStylesMap.get(el);

        if (computedStyle) {
          // Apply all computed styles as inline
          for (let i = 0; i < computedStyle.length; i++) {
            const prop = computedStyle[i];
            const value = computedStyle.getPropertyValue(prop);
            if (value) {
              htmlEl.style.setProperty(prop, value);
            }
          }
        }
      });

      // Store originalStyles reference for restoration
      const savedOriginalStyles = originalStyles;

      // Wait for DOM to settle
      await new Promise(resolve => setTimeout(resolve, 100));

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

        // Capture the page as canvas - now with no stylesheets and all inline styles
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
          imageTimeout: 15000,
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

      // Restore original styles
      allElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const originalStyle = savedOriginalStyles.get(el);
        if (originalStyle !== undefined) {
          if (originalStyle) {
            htmlEl.setAttribute('style', originalStyle);
          } else {
            htmlEl.removeAttribute('style');
          }
        }
      });

      // Restore stylesheets
      removedStylesheets.forEach(({ element, parent, nextSibling }) => {
        if (nextSibling) {
          parent.insertBefore(element, nextSibling);
        } else {
          parent.appendChild(element);
        }
      });

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to generate PDF: ${errorMessage}\n\nPlease try using the Print button instead and save as PDF from your browser.`);

      // Restore stylesheets even on error
      removedStylesheets.forEach(({ element, parent, nextSibling }) => {
        if (nextSibling) {
          parent.insertBefore(element, nextSibling);
        } else {
          parent.appendChild(element);
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="no-print fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href={`/memorials/${memorialId}/order-of-service`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Editor
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center px-6 py-3 bg-[#9FB89D] text-white rounded-lg hover:bg-[#84a182] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-3 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
