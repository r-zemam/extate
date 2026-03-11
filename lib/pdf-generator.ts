import jsPDF from 'jspdf';
import { logPdfGenerationError } from './error-logger';
import { formatDate, formatTimestamp, getPropertyAddressLabel } from './formatting';

interface DocumentRecord {
  id: string;
  owner_name: string;
  property_address: string;
  document_type: string;
  document_date: string;
  fingerprint: string;
  file_url: string;
  created_at: string;
}

/**
 * Generate a PDF certificate for a document record
 * Mirrors the web certificate styling and includes all certificate information
 * 
 * @param document - The document record to generate a certificate for
 * @throws {Error} If PDF generation fails
 */
export function generateCertificatePDF(document: DocumentRecord): void {
  try {
    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Set default font
    pdf.setFont('times', 'normal');

    // Add decorative top border
    pdf.setDrawColor(212, 175, 55); // Gold
    pdf.setLineWidth(2);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // Add official seal (text representation)
    pdf.setFont('times', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text('✓', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(212, 175, 55); // Gold
    pdf.text('EXTATE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Add header
    pdf.setFont('times', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text('CERTIFICATE OF DOCUMENT REGISTRATION', pageWidth / 2, yPosition, {
      align: 'center',
      maxWidth: contentWidth,
    });
    yPosition += 10;

    // Add decorative line
    pdf.setDrawColor(212, 175, 55); // Gold
    pdf.setLineWidth(1);
    pdf.line(pageWidth / 2 - 15, yPosition, pageWidth / 2 + 15, yPosition);
    yPosition += 8;

    // Add declaration
    pdf.setFont('times', 'italic');
    pdf.setFontSize(11);
    pdf.setTextColor(26, 26, 26); // Dark text
    const declarationText =
      'This certifies that the following property document has been registered and protected with cryptographic verification.';
    const declarationLines = pdf.splitTextToSize(declarationText, contentWidth);
    pdf.text(declarationLines, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += declarationLines.length * 5 + 8;

    // Owner Information Section
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text('PROPERTY OWNER', margin, yPosition);
    yPosition += 6;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(26, 26, 26); // Dark text
    pdf.text(document.owner_name, margin, yPosition);
    yPosition += 7;

    // Add dynamic property address label
    const propertyAddressLabel = getPropertyAddressLabel(document.document_type);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text(propertyAddressLabel.toUpperCase(), margin, yPosition);
    yPosition += 5;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(26, 26, 26); // Dark text
    const addressLines = pdf.splitTextToSize(document.property_address, contentWidth - 10);
    pdf.text(addressLines, margin, yPosition);
    yPosition += addressLines.length * 5 + 8;

    // Document Details Section
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text('DOCUMENT TYPE', margin, yPosition);
    pdf.text('DOCUMENT DATE', pageWidth / 2, yPosition);
    yPosition += 6;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(26, 26, 26); // Dark text
    pdf.text(document.document_type.replace(/_/g, ' '), margin, yPosition);
    pdf.text(formatDate(document.document_date), pageWidth / 2, yPosition);
    yPosition += 8;

    // Fingerprint Section
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text('DOCUMENT FINGERPRINT (SHA-256)', margin, yPosition);
    yPosition += 6;

    // Add fingerprint in monospace-like font
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(26, 26, 26); // Dark text
    const fingerprintLines = pdf.splitTextToSize(document.fingerprint, contentWidth - 4);
    pdf.text(fingerprintLines, margin + 2, yPosition);
    yPosition += fingerprintLines.length * 4 + 6;

    // Add fingerprint note
    pdf.setFont('times', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100); // Gray
    const noteText =
      'This unique fingerprint proves the authenticity and integrity of the registered document.';
    const noteLines = pdf.splitTextToSize(noteText, contentWidth - 4);
    pdf.text(noteLines, margin + 2, yPosition);
    yPosition += noteLines.length * 4 + 8;

    // Registration Details Section
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 58, 95); // Deep blue
    pdf.text('REGISTRATION DETAILS', margin, yPosition);
    yPosition += 6;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(26, 26, 26); // Dark text
    pdf.text(`Registered: ${formatTimestamp(document.created_at)}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Certificate ID: ${document.id}`, margin, yPosition);
    yPosition += 10;

    // Add decorative bottom border
    pdf.setDrawColor(212, 175, 55); // Gold
    pdf.setLineWidth(2);
    pdf.line(margin, pageHeight - margin - 5, pageWidth - margin, pageHeight - margin - 5);

    // Add footer
    pdf.setFont('times', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100); // Gray
    const footerText =
      'This certificate serves as official proof of document registration and protection. Verify the authenticity of this document at any time using the verification page.';
    const footerLines = pdf.splitTextToSize(footerText, contentWidth);
    pdf.text(footerLines, pageWidth / 2, pageHeight - margin + 2, { align: 'center' });

    // Generate filename
    const sanitizedName = document.owner_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `EXTATE_Certificate_${sanitizedName}_${document.id.slice(0, 8)}.pdf`;

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logPdfGenerationError(err, document.id);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}
