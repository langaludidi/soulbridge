// PDF and Print utility functions for Order of Service

export function generatePrintableOrderOfService(
  orderOfService: any,
  memorial: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Set document title for PDF filename
      const originalTitle = document.title;
      const filename = `${memorial.firstName}_${memorial.lastName}_Order_of_Service`;
      document.title = filename;

      // Add print-specific metadata to the document
      const printMeta = document.createElement('meta');
      printMeta.name = 'print-title';
      printMeta.content = `Order of Service - ${memorial.firstName} ${memorial.lastName}`;
      document.head.appendChild(printMeta);

      // Ensure all images are loaded before printing
      const images = document.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(img);
          } else {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img); // Continue even if image fails
          }
        });
      });

      Promise.all(imagePromises).then(() => {
        // Add print classes to optimize layout
        document.body.classList.add('printing');
        
        // Trigger the browser's print dialog
        window.print();

        // Cleanup after print dialog closes
        const afterPrint = () => {
          document.title = originalTitle;
          document.body.classList.remove('printing');
          document.head.removeChild(printMeta);
          window.removeEventListener('afterprint', afterPrint);
          resolve();
        };

        // Listen for print completion
        window.addEventListener('afterprint', afterPrint);
        
        // Fallback timeout in case afterprint doesn't fire
        setTimeout(afterPrint, 1000);
      });

    } catch (error) {
      reject(error);
    }
  });
}

export function downloadAsImage(
  elementId: string,
  filename: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // This is a fallback method - in a real implementation,
      // you might want to use html2canvas or similar library
      
      const element = document.getElementById(elementId);
      if (!element) {
        reject(new Error('Element not found'));
        return;
      }

      // For now, we'll just trigger the print dialog
      // In a more advanced implementation, you could:
      // 1. Use html2canvas to capture the element as an image
      // 2. Convert to PDF using jsPDF
      // 3. Download as PNG/JPEG
      
      window.print();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function formatOrderOfServiceForPrint(
  orderOfService: any,
  memorial: any,
  events: any[]
): string {
  // Generate a formatted text version for accessibility
  const lines = [];
  
  lines.push('=' .repeat(60));
  lines.push(`ORDER OF SERVICE`);
  lines.push(`${orderOfService.title || 'Celebration of Life'}`);
  lines.push('=' .repeat(60));
  lines.push('');
  
  lines.push(`In Loving Memory of`);
  lines.push(`${memorial.firstName} ${memorial.lastName}`);
  
  if (memorial.dateOfBirth && memorial.dateOfPassing) {
    const birthYear = new Date(memorial.dateOfBirth).getFullYear();
    const passingYear = new Date(memorial.dateOfPassing).getFullYear();
    lines.push(`${birthYear} - ${passingYear}`);
  }
  
  lines.push('');
  lines.push('-' .repeat(60));
  
  if (orderOfService.serviceDate || orderOfService.serviceTime || orderOfService.venue) {
    lines.push('SERVICE DETAILS:');
    
    if (orderOfService.serviceDate) {
      lines.push(`Date: ${new Date(orderOfService.serviceDate).toLocaleDateString()}`);
    }
    
    if (orderOfService.serviceTime) {
      lines.push(`Time: ${orderOfService.serviceTime}`);
    }
    
    if (orderOfService.venue) {
      lines.push(`Venue: ${orderOfService.venue}`);
    }
    
    if (orderOfService.officiant) {
      lines.push(`Officiant: ${orderOfService.officiant}`);
    }
    
    lines.push('');
  }
  
  if (orderOfService.tributeQuote) {
    lines.push('TRIBUTE:');
    lines.push(`"${orderOfService.tributeQuote}"`);
    lines.push('');
  }
  
  if (events && events.length > 0) {
    lines.push('ORDER OF SERVICE:');
    lines.push('');
    
    events.forEach((event, index) => {
      lines.push(`${index + 1}. ${event.title}`);
      
      if (event.speaker) {
        lines.push(`   Speaker: ${event.speaker}`);
      }
      
      if (event.duration) {
        lines.push(`   Duration: ${event.duration}`);
      }
      
      if (event.description) {
        lines.push(`   ${event.description}`);
      }
      
      if (event.content) {
        lines.push(`   Content: ${event.content}`);
      }
      
      lines.push('');
    });
  }
  
  lines.push('-' .repeat(60));
  lines.push('Created with SoulBridge Digital Memorial Platform');
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  
  return lines.join('\n');
}

// Utility function to check if the browser supports printing
export function isPrintingSupported(): boolean {
  return typeof window !== 'undefined' && 'print' in window;
}

// Utility function to prepare the page for printing
export function preparePrintLayout(): void {
  // Add any last-minute print optimizations
  const printStylesheet = document.createElement('style');
  printStylesheet.textContent = `
    @media print {
      /* Last-minute print adjustments */
      .print-optimize {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  `;
  document.head.appendChild(printStylesheet);
}

export default {
  generatePrintableOrderOfService,
  downloadAsImage,
  formatOrderOfServiceForPrint,
  isPrintingSupported,
  preparePrintLayout
};