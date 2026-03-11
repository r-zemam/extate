/**
 * Tests for the upload page component
 * 
 * Validates:
 * - Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6 (form fields and validation)
 * - Requirements 3.1, 3.2, 4.1, 4.2, 4.3 (hash computation and submission)
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadPage from '../page';
import * as actions from '@/lib/actions';
import * as crypto from '@/lib/crypto';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/actions');
jest.mock('@/lib/crypto');
jest.mock('next/navigation');

describe('UploadPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Form Rendering', () => {
    it('should render all required form fields', () => {
      render(<UploadPage />);

      // Check for all required fields
      expect(screen.getByLabelText(/Document File/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Owner Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Property Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Document Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Document Date/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register Document/i })).toBeInTheDocument();
    });

    it('should render document type options', () => {
      render(<UploadPage />);

      const select = screen.getByLabelText(/Document Type/i) as HTMLSelectElement;
      const options = Array.from(select.options).map(opt => opt.value);

      expect(options).toContain('deed');
      expect(options).toContain('title');
      expect(options).toContain('inheritance_record');
      expect(options).toContain('tax_document');
    });

    it('should have correct file input accept attribute', () => {
      render(<UploadPage />);

      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      expect(fileInput.accept).toBe('.pdf,.jpg,.jpeg,.png');
    });
  });

  describe('Form Validation', () => {
    it('should prevent submission with empty required fields', async () => {
      render(<UploadPage />);

      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please select a file to upload/i)).toBeInTheDocument();
        expect(screen.getByText(/Owner name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Property address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Document type is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Document date is required/i)).toBeInTheDocument();
      });

      expect(actions.uploadDocument).not.toHaveBeenCalled();
    });

    it('should display error for invalid file type', async () => {
      render(<UploadPage />);

      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      const invalidFile = new File(['content'], 'document.txt', { type: 'text/plain' });

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please upload a PDF or image file/i)).toBeInTheDocument();
      });

      expect(actions.uploadDocument).not.toHaveBeenCalled();
    });

    it('should display error for file exceeding size limit', async () => {
      render(<UploadPage />);

      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      // Create a file larger than 10MB
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/File size must be under 10MB/i)).toBeInTheDocument();
      });

      expect(actions.uploadDocument).not.toHaveBeenCalled();
    });

    it('should highlight invalid fields with red styling', async () => {
      render(<UploadPage />);

      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Document File/i).closest('div');
        expect(fileInput).toHaveClass('border-red-300');
      });
    });
  });

  describe('Form Submission', () => {
    it('should compute hash and call uploadDocument on valid submission', async () => {
      const mockHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';
      (crypto.computeSHA256 as jest.Mock).mockResolvedValue(mockHash);
      (actions.uploadDocument as jest.Mock).mockResolvedValue({ id: 'test-id-123' });

      render(<UploadPage />);

      // Fill form
      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await userEvent.type(screen.getByLabelText(/Owner Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Property Address/i), '123 Main St');
      await userEvent.selectOptions(screen.getByLabelText(/Document Type/i), 'deed');
      await userEvent.type(screen.getByLabelText(/Document Date/i), '2024-01-15');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(crypto.computeSHA256).toHaveBeenCalledWith(file);
        expect(actions.uploadDocument).toHaveBeenCalled();
      });
    });

    it('should show loading state during submission', async () => {
      (crypto.computeSHA256 as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('hash'), 100))
      );
      (actions.uploadDocument as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 'test-id' }), 100))
      );

      render(<UploadPage />);

      // Fill form
      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await userEvent.type(screen.getByLabelText(/Owner Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Property Address/i), '123 Main St');
      await userEvent.selectOptions(screen.getByLabelText(/Document Type/i), 'deed');
      await userEvent.type(screen.getByLabelText(/Document Date/i), '2024-01-15');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Processing/i)).toBeInTheDocument();
      });
    });

    it('should redirect to certificate page on successful upload', async () => {
      const mockHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';
      const documentId = 'test-id-123';
      (crypto.computeSHA256 as jest.Mock).mockResolvedValue(mockHash);
      (actions.uploadDocument as jest.Mock).mockResolvedValue({ id: documentId });

      render(<UploadPage />);

      // Fill form
      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await userEvent.type(screen.getByLabelText(/Owner Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Property Address/i), '123 Main St');
      await userEvent.selectOptions(screen.getByLabelText(/Document Type/i), 'deed');
      await userEvent.type(screen.getByLabelText(/Document Date/i), '2024-01-15');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(`/certificate/${documentId}`);
      });
    });

    it('should display error message on upload failure', async () => {
      (crypto.computeSHA256 as jest.Mock).mockResolvedValue('hash');
      (actions.uploadDocument as jest.Mock).mockRejectedValue(
        new Error('Upload failed. Please check your connection and try again.')
      );

      render(<UploadPage />);

      // Fill form
      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await userEvent.type(screen.getByLabelText(/Owner Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Property Address/i), '123 Main St');
      await userEvent.selectOptions(screen.getByLabelText(/Document Type/i), 'deed');
      await userEvent.type(screen.getByLabelText(/Document Date/i), '2024-01-15');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
      });
    });

    it('should handle CryptoNotSupportedError gracefully', async () => {
      (crypto.computeSHA256 as jest.Mock).mockRejectedValue(
        new crypto.CryptoNotSupportedError()
      );

      render(<UploadPage />);

      // Fill form
      const fileInput = screen.getByLabelText(/Document File/i) as HTMLInputElement;
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await userEvent.type(screen.getByLabelText(/Owner Name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/Property Address/i), '123 Main St');
      await userEvent.selectOptions(screen.getByLabelText(/Document Type/i), 'deed');
      await userEvent.type(screen.getByLabelText(/Document Date/i), '2024-01-15');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Your browser does not support/i)).toBeInTheDocument();
      });
    });
  });

  describe('Field Highlighting', () => {
    it('should clear error highlighting when user corrects field', async () => {
      render(<UploadPage />);

      // Submit with empty fields to trigger validation
      const submitButton = screen.getByRole('button', { name: /Register Document/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Owner name is required/i)).toBeInTheDocument();
      });

      // Fill the field
      const ownerNameInput = screen.getByLabelText(/Owner Name/i);
      await userEvent.type(ownerNameInput, 'John Doe');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Owner name is required/i)).not.toBeInTheDocument();
      });
    });
  });
});
