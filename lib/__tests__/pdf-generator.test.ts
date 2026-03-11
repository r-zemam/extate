/**
 * Tests for the PDF generator module
 * 
 * Validates:
 * - Requirements 6.1, 6.2 (PDF generation and download)
 */

import { generateCertificatePDF } from '../pdf-generator';
import jsPDF from 'jspdf';

// Mock jsPDF
jest.mock('jspdf');

describe('generateCertificatePDF', () => {
  const mockDocument = {
    id: 'test-id-123',
    owner_name: 'John Doe',
    property_address: '123 Main Street, Springfield, IL 62701',
    document_type: 'deed',
    document_date: '2024-01-15',
    fingerprint: 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73',
    file_url: 'https://example.com/file.pdf',
    created_at: '2024-01-20T10:30:00Z',
  };

  let mockPdfInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock PDF instance
    mockPdfInstance = {
      setFont: jest.fn().mockReturnThis(),
      setFontSize: jest.fn().mockReturnThis(),
      setTextColor: jest.fn().mockReturnThis(),
      setDrawColor: jest.fn().mockReturnThis(),
      setLineWidth: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      line: jest.fn().mockReturnThis(),
      splitTextToSize: jest.fn((text) => [text]),
      save: jest.fn(),
      internal: {
        pageSize: {
          getWidth: jest.fn().mockReturnValue(210),
          getHeight: jest.fn().mockReturnValue(297),
        },
      },
    };

    (jsPDF as jest.Mock).mockReturnValue(mockPdfInstance);
  });

  describe('PDF Generation', () => {
    it('should create a PDF with A4 dimensions', () => {
      generateCertificatePDF(mockDocument);

      expect(jsPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
    });

    it('should set fonts for certificate styling', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.setFont).toHaveBeenCalledWith('times', 'normal');
      expect(mockPdfInstance.setFont).toHaveBeenCalledWith('times', 'bold');
      expect(mockPdfInstance.setFont).toHaveBeenCalledWith('times', 'italic');
      expect(mockPdfInstance.setFont).toHaveBeenCalledWith('courier', 'normal');
    });

    it('should set appropriate colors for certificate design', () => {
      generateCertificatePDF(mockDocument);

      // Check for gold color (212, 175, 55)
      expect(mockPdfInstance.setDrawColor).toHaveBeenCalledWith(212, 175, 55);
      // Check for deep blue (30, 58, 95)
      expect(mockPdfInstance.setTextColor).toHaveBeenCalledWith(30, 58, 95);
      // Check for dark text (26, 26, 26)
      expect(mockPdfInstance.setTextColor).toHaveBeenCalledWith(26, 26, 26);
    });

    it('should add decorative borders', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.line).toHaveBeenCalled();
    });

    it('should include certificate header', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.stringContaining('CERTIFICATE OF DOCUMENT REGISTRATION'),
        expect.any(Number),
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should include owner name in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        'John Doe',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include property address in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('123 Main Street')]),
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include document type in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        'deed',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include document date in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        '2024-01-15',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include fingerprint in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73')]),
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include registration timestamp in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.stringContaining('Registered:'),
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include certificate ID in PDF', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.stringContaining('test-id-123'),
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include official seal representation', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        '✓',
        expect.any(Number),
        expect.any(Number),
        expect.any(Object)
      );
      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        'EXTATE',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include declaration text', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('This certifies that')]),
        expect.any(Number),
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should include footer text', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('official proof')]),
        expect.any(Number),
        expect.any(Number),
        expect.any(Object)
      );
    });
  });

  describe('PDF Download', () => {
    it('should call save with correct filename format', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.save).toHaveBeenCalledWith(
        expect.stringMatching(/^EXTATE_Certificate_john_doe_test-id-12\.pdf$/)
      );
    });

    it('should sanitize owner name in filename', () => {
      const docWithSpecialChars = {
        ...mockDocument,
        owner_name: "O'Brien-Smith, Jr.",
      };

      generateCertificatePDF(docWithSpecialChars);

      expect(mockPdfInstance.save).toHaveBeenCalledWith(
        expect.stringMatching(/^EXTATE_Certificate_o_brien_smith_jr_/)
      );
    });

    it('should include document ID in filename', () => {
      generateCertificatePDF(mockDocument);

      expect(mockPdfInstance.save).toHaveBeenCalledWith(
        expect.stringContaining('test-id-12')
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error if PDF generation fails', () => {
      (jsPDF as jest.Mock).mockImplementation(() => {
        throw new Error('PDF creation failed');
      });

      expect(() => {
        generateCertificatePDF(mockDocument);
      }).toThrow('Failed to generate PDF. Please try again.');
    });

    it('should log error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (jsPDF as jest.Mock).mockImplementation(() => {
        throw new Error('PDF creation failed');
      });

      try {
        generateCertificatePDF(mockDocument);
      } catch (e) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith('PDF generation error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Document Type Formatting', () => {
    it('should replace underscores with spaces in document type', () => {
      const docWithUnderscores = {
        ...mockDocument,
        document_type: 'inheritance_record',
      };

      generateCertificatePDF(docWithUnderscores);

      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        'inheritance record',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('Date Formatting', () => {
    it('should format registration date correctly', () => {
      generateCertificatePDF(mockDocument);

      // Should include formatted date like "January 20, 2024"
      expect(mockPdfInstance.text).toHaveBeenCalledWith(
        expect.stringMatching(/Registered: January 20, 2024/),
        expect.any(Number),
        expect.any(Number)
      );
    });
  });
});
