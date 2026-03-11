/**
 * Tests for the certificate page component
 * 
 * Validates:
 * - Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6 (certificate information display)
 * - Requirements 5.7 (certificate styling)
 * - Requirements 6.1, 7.1 (navigation buttons)
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CertificatePage from '../page';
import * as actions from '@/lib/actions';
import * as pdfGenerator from '@/lib/pdf-generator';

// Mock dependencies
jest.mock('@/lib/actions');
jest.mock('@/lib/pdf-generator');
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

describe('CertificatePage', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading message while fetching document', () => {
      (actions.getDocument as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockDocument), 100))
      );

      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      expect(screen.getByText(/Loading certificate/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when document not found', async () => {
      (actions.getDocument as jest.Mock).mockRejectedValue(
        new Error('Document not found.')
      );

      render(<CertificatePage params={{ id: 'invalid-id' }} />);

      await waitFor(() => {
        expect(screen.getByText(/Certificate Not Found/i)).toBeInTheDocument();
        expect(screen.getByText(/Document not found/i)).toBeInTheDocument();
      });
    });

    it('should display return to home link on error', async () => {
      (actions.getDocument as jest.Mock).mockRejectedValue(
        new Error('Document not found.')
      );

      render(<CertificatePage params={{ id: 'invalid-id' }} />);

      await waitFor(() => {
        expect(screen.getByText(/Return to Home/i)).toBeInTheDocument();
      });
    });
  });

  describe('Certificate Information Display', () => {
    beforeEach(() => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);
    });

    it('should display owner name from database', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should display property address from database', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText('123 Main Street, Springfield, IL 62701')).toBeInTheDocument();
      });
    });

    it('should display document type from database', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/deed/i)).toBeInTheDocument();
      });
    });

    it('should display document date from database', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      });
    });

    it('should display SHA-256 fingerprint prominently', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73/)).toBeInTheDocument();
      });
    });

    it('should display registration timestamp from database', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/January 20, 2024/i)).toBeInTheDocument();
      });
    });

    it('should display certificate ID', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/test-id-123/)).toBeInTheDocument();
      });
    });
  });

  describe('Certificate Styling', () => {
    beforeEach(() => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);
    });

    it('should render certificate with official styling', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const certificate = screen.getByText(/CERTIFICATE OF DOCUMENT REGISTRATION/i);
        expect(certificate).toBeInTheDocument();
      });
    });

    it('should display official seal', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument();
        expect(screen.getByText('EXTATE')).toBeInTheDocument();
      });
    });

    it('should display formal header text', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/CERTIFICATE OF DOCUMENT REGISTRATION/i)).toBeInTheDocument();
      });
    });

    it('should display declaration text', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/This certifies that the following property document/i)).toBeInTheDocument();
      });
    });

    it('should display section headers', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/PROPERTY OWNER/i)).toBeInTheDocument();
        expect(screen.getByText(/DOCUMENT TYPE/i)).toBeInTheDocument();
        expect(screen.getByText(/DOCUMENT DATE/i)).toBeInTheDocument();
        expect(screen.getByText(/DOCUMENT FINGERPRINT/i)).toBeInTheDocument();
        expect(screen.getByText(/REGISTRATION DETAILS/i)).toBeInTheDocument();
      });
    });

    it('should display fingerprint in monospace font container', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const fingerprintElement = screen.getByText(/ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73/);
        expect(fingerprintElement).toHaveClass('font-mono');
      });
    });

    it('should display footer text about verification', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/Verify the authenticity of this document/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Buttons', () => {
    beforeEach(() => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);
    });

    it('should display Download PDF button', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();
      });
    });

    it('should display Verify This Document button', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /Verify This Document/i })).toBeInTheDocument();
      });
    });

    it('should link Verify button to correct verification page', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const verifyLink = screen.getByRole('link', { name: /Verify This Document/i });
        expect(verifyLink).toHaveAttribute('href', '/verify/test-id-123');
      });
    });
  });

  describe('PDF Download', () => {
    beforeEach(() => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);
      (pdfGenerator.generateCertificatePDF as jest.Mock).mockImplementation(() => {});
    });

    it('should call PDF generator when Download PDF button is clicked', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /Download PDF/i });
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(pdfGenerator.generateCertificatePDF).toHaveBeenCalledWith(mockDocument);
      });
    });

    it('should show loading state while generating PDF', async () => {
      (pdfGenerator.generateCertificatePDF as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /Download PDF/i });
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Generating PDF/i })).toBeInTheDocument();
      });
    });

    it('should disable Download PDF button while generating', async () => {
      (pdfGenerator.generateCertificatePDF as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /Download PDF/i });
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        const generatingButton = screen.getByRole('button', { name: /Generating PDF/i });
        expect(generatingButton).toBeDisabled();
      });
    });

    it('should display error message if PDF generation fails', async () => {
      (pdfGenerator.generateCertificatePDF as jest.Mock).mockRejectedValue(
        new Error('Failed to generate PDF')
      );

      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /Download PDF/i });
        fireEvent.click(downloadButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Failed to generate PDF/i)).toBeInTheDocument();
      });
    });
  });

  describe('Print Friendly Design', () => {
    beforeEach(() => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);
    });

    it('should display print tip', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        expect(screen.getByText(/You can also print this certificate/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);
    });

    it('should render responsive layout', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveClass('min-h-screen');
        expect(mainElement).toHaveClass('px-4');
      });
    });

    it('should stack buttons vertically on mobile', async () => {
      render(<CertificatePage params={{ id: 'test-id-123' }} />);

      await waitFor(() => {
        const buttonContainer = screen.getByRole('button', { name: /Download PDF/i }).closest('div');
        expect(buttonContainer).toHaveClass('flex-col');
      });
    });
  });
});
