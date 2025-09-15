import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { DigitalOrderOfService, Memorial } from '@shared/schema';

// Professional PDF generation with enhanced styling inspired by memorial service templates
export function generatePrintableOrderOfService(
  orderOfService: DigitalOrderOfService & { events?: any[] },
  memorial: Memorial
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const filename = `${memorial.firstName}_${memorial.lastName}_Order_of_Service`;
      
      // Create enhanced PDF using html2canvas and jsPDF
      generateEnhancedPDF(orderOfService, memorial, filename)
        .then(() => resolve())
        .catch(() => {
          // Fallback to browser print if PDF generation fails
          generateBrowserPrint(orderOfService, memorial, filename)
            .then(() => resolve())
            .catch(reject);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Enhanced PDF generation with professional styling
async function generateEnhancedPDF(
  orderOfService: DigitalOrderOfService & { events?: any[] },
  memorial: Memorial,
  filename: string
): Promise<void> {
  // Create a temporary container for the PDF content
  const pdfContainer = document.createElement('div');
  pdfContainer.style.position = 'absolute';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.width = '210mm'; // A4 width
  pdfContainer.style.fontFamily = 'serif';
  pdfContainer.style.background = 'white';
  pdfContainer.style.padding = '20mm';
  pdfContainer.style.boxSizing = 'border-box';
  
  // Generate the professional PDF content
  pdfContainer.innerHTML = generateProfessionalOrderOfServiceHTML(orderOfService, memorial);
  
  document.body.appendChild(pdfContainer);

  try {
    // Generate canvas from the container
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
  } finally {
    // Cleanup
    document.body.removeChild(pdfContainer);
  }
}

// Fallback browser print function
async function generateBrowserPrint(
  orderOfService: DigitalOrderOfService & { events?: any[] },
  memorial: Memorial,
  filename: string
): Promise<void> {
  const originalTitle = document.title;
  document.title = filename;

  // Add print-specific metadata
  const printMeta = document.createElement('meta');
  printMeta.name = 'print-title';
  printMeta.content = `Order of Service - ${memorial.firstName} ${memorial.lastName}`;
  document.head.appendChild(printMeta);

  // Wait for images to load
  const images = document.querySelectorAll('img');
  await Promise.all(Array.from(images).map(img => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve(img);
      } else {
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
      }
    });
  }));

  // Add print optimization
  document.body.classList.add('printing');
  
  // Trigger print
  window.print();

  // Cleanup after print
  const cleanup = () => {
    document.title = originalTitle;
    document.body.classList.remove('printing');
    if (printMeta.parentNode) {
      document.head.removeChild(printMeta);
    }
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);
  setTimeout(cleanup, 1000);
}

// Generate professional HTML template for PDF with Canva-inspired styling
function generateProfessionalOrderOfServiceHTML(
  orderOfService: DigitalOrderOfService & { events?: any[] },
  memorial: Memorial
): string {
  const birthYear = memorial.dateOfBirth ? new Date(memorial.dateOfBirth).getFullYear() : '';
  const passingYear = memorial.dateOfPassing ? new Date(memorial.dateOfPassing).getFullYear() : '';
  const serviceDate = orderOfService.serviceDate 
    ? new Date(orderOfService.serviceDate).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      })
    : '';

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Serif+Pro:wght@300;400;600&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      .order-service-pdf {
        font-family: 'Source Serif Pro', Georgia, serif;
        line-height: 1.6;
        color: #2c2c2c;
        max-width: 170mm;
        margin: 0 auto;
        background: white;
      }
      
      .header {
        text-align: center;
        padding: 20px 0 30px;
        border-bottom: 2px solid #d4b896;
        margin-bottom: 30px;
      }
      
      .ornament {
        font-size: 24px;
        color: #d4b896;
        margin-bottom: 15px;
      }
      
      .title {
        font-family: 'Playfair Display', serif;
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      
      .subtitle {
        font-size: 16px;
        color: #666;
        font-weight: 300;
        margin-bottom: 25px;
      }
      
      .memorial-info {
        text-align: center;
        padding: 25px 0;
        background: linear-gradient(135deg, #f8f6f3 0%, #ffffff 100%);
        border: 1px solid #e8e1d9;
        border-radius: 8px;
        margin-bottom: 30px;
      }
      
      .name {
        font-family: 'Playfair Display', serif;
        font-size: 32px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 8px;
      }
      
      .dates {
        font-size: 18px;
        color: #666;
        font-weight: 400;
        margin-bottom: 15px;
      }
      
      .memorial-message {
        font-style: italic;
        font-size: 14px;
        color: #555;
        max-width: 400px;
        margin: 0 auto;
        line-height: 1.7;
      }
      
      .service-details {
        background: #f9f7f4;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #d4b896;
        margin-bottom: 30px;
      }
      
      .service-details h3 {
        font-family: 'Playfair Display', serif;
        font-size: 20px;
        color: #1a1a1a;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .service-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        font-size: 14px;
      }
      
      .service-item {
        display: flex;
        flex-direction: column;
      }
      
      .service-label {
        font-weight: 600;
        color: #8b6914;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 12px;
      }
      
      .service-value {
        color: #333;
      }
      
      .tribute-quote {
        text-align: center;
        padding: 25px;
        background: linear-gradient(135deg, #f5f3f0 0%, #ffffff 100%);
        border-radius: 8px;
        margin-bottom: 30px;
        position: relative;
      }
      
      .tribute-quote::before,
      .tribute-quote::after {
        content: '"';
        font-family: 'Playfair Display', serif;
        font-size: 48px;
        color: #d4b896;
        position: absolute;
        line-height: 1;
      }
      
      .tribute-quote::before {
        top: 10px;
        left: 20px;
      }
      
      .tribute-quote::after {
        bottom: 10px;
        right: 20px;
      }
      
      .tribute-text {
        font-style: italic;
        font-size: 16px;
        color: #444;
        line-height: 1.8;
        margin: 0 40px;
      }
      
      .events-section {
        margin-bottom: 30px;
      }
      
      .section-title {
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        color: #1a1a1a;
        text-align: center;
        margin-bottom: 25px;
        padding-bottom: 10px;
        border-bottom: 1px solid #d4b896;
      }
      
      .event-item {
        display: flex;
        align-items: flex-start;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .event-item:last-child {
        border-bottom: none;
      }
      
      .event-number {
        background: #d4b896;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        margin-right: 20px;
        flex-shrink: 0;
      }
      
      .event-content {
        flex: 1;
      }
      
      .event-title {
        font-family: 'Playfair Display', serif;
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 5px;
      }
      
      .event-details {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .event-description {
        font-size: 14px;
        color: #555;
        line-height: 1.6;
      }
      
      .footer {
        text-align: center;
        padding: 25px 0;
        border-top: 2px solid #d4b896;
        margin-top: 30px;
        font-size: 12px;
        color: #888;
      }
      
      .footer-ornament {
        font-size: 20px;
        color: #d4b896;
        margin-bottom: 10px;
      }
    </style>
    
    <div class="order-service-pdf">
      <div class="header">
        <div class="ornament">❦</div>
        <h1 class="title">${orderOfService.title || 'Order of Service'}</h1>
        <p class="subtitle">In Loving Memory</p>
      </div>
      
      <div class="memorial-info">
        <h2 class="name">${memorial.firstName} ${memorial.lastName}</h2>
        <p class="dates">${birthYear} – ${passingYear}</p>
        ${memorial.memorialMessage ? `<p class="memorial-message">${memorial.memorialMessage}</p>` : ''}
      </div>
      
      ${orderOfService.serviceDate || orderOfService.serviceTime || orderOfService.venue || orderOfService.officiant ? `
        <div class="service-details">
          <h3>Service Information</h3>
          <div class="service-info">
            ${serviceDate ? `
              <div class="service-item">
                <div class="service-label">Date</div>
                <div class="service-value">${serviceDate}</div>
              </div>
            ` : ''}
            ${orderOfService.serviceTime ? `
              <div class="service-item">
                <div class="service-label">Time</div>
                <div class="service-value">${orderOfService.serviceTime}</div>
              </div>
            ` : ''}
            ${orderOfService.venue ? `
              <div class="service-item">
                <div class="service-label">Location</div>
                <div class="service-value">${orderOfService.venue}</div>
              </div>
            ` : ''}
            ${orderOfService.officiant ? `
              <div class="service-item">
                <div class="service-label">Officiant</div>
                <div class="service-value">${orderOfService.officiant}</div>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
      
      ${orderOfService.tributeQuote ? `
        <div class="tribute-quote">
          <p class="tribute-text">${orderOfService.tributeQuote}</p>
        </div>
      ` : ''}
      
      ${orderOfService.events && orderOfService.events.length > 0 ? `
        <div class="events-section">
          <h3 class="section-title">Order of Service</h3>
          ${orderOfService.events.map((event: any, index: number) => `
            <div class="event-item">
              <div class="event-number">${index + 1}</div>
              <div class="event-content">
                <h4 class="event-title">${event.title}</h4>
                ${event.speaker || event.duration ? `
                  <div class="event-details">
                    ${event.speaker ? `Speaker: ${event.speaker}` : ''}
                    ${event.speaker && event.duration ? ' • ' : ''}
                    ${event.duration ? `Duration: ${event.duration}` : ''}
                  </div>
                ` : ''}
                ${event.description || event.content ? `
                  <p class="event-description">${event.description || event.content}</p>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="footer">
        <div class="footer-ornament">❦</div>
        <p>Created with love and remembrance</p>
        <p>SoulBridge Digital Memorial Platform</p>
      </div>
    </div>
  `;
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