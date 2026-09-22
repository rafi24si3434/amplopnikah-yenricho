import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Capture an element and export as high-quality PDF
 */
export async function exportElementToPdf(element, filename = 'amplop-nikah.pdf') {
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High DPI for crisp text and ornaments
      useCORS: true,
      backgroundColor: '#0d0d0d',
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // PDF in landscape format matching envelope proportions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [148, 210] // A5 landscape (148mm x 210mm) - perfect for envelopes
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}

/**
 * Capture all envelopes in bulk and export as multi-page PDF
 */
export async function exportBulkToPdf(
  bulkNames, 
  setRecipientName, 
  elementGetter, 
  baseFilename = 'semua-amplop-nikah.pdf'
) {
  if (!bulkNames || bulkNames.length === 0) return;

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [148, 210] // A5 landscape
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < bulkNames.length; i++) {
      // Set recipient name in DOM
      setRecipientName(bulkNames[i]);
      
      // Allow DOM to re-render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const element = elementGetter();
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#0d0d0d',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (i > 0) {
        pdf.addPage([148, 210], 'landscape');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(baseFilename);
    return true;
  } catch (error) {
    console.error('Failed to export bulk PDF:', error);
    throw error;
  }
}
