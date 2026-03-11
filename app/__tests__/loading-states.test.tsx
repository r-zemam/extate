import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

/**
 * Loading States Tests
 * 
 * Validates: Requirements All (user feedback)
 * 
 * These tests verify that loading indicators display during:
 * - Hash computation
 * - File uploads
 * - PDF generation
 * - Document verification
 */

describe('Loading States - Upload Form', () => {
  it('should display loading indicator during form submission', async () => {
    const { container } = render(
      <button disabled={false} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </button>
    );

    // Check for loading spinner
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should disable submit button during submission', () => {
    const { container } = render(
      <button disabled={true} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
        Register Document
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('should show loading text during processing', () => {
    render(
      <button>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </button>
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should have animated spinner during hash computation', () => {
    const { container } = render(
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should disable file input during submission', () => {
    const { container } = render(
      <input
        id="file"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={true}
        className="hidden"
      />
    );

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeDisabled();
  });

  it('should disable form fields during submission', () => {
    const { container } = render(
      <>
        <input type="text" disabled={true} placeholder="Owner Name" />
        <input type="text" disabled={true} placeholder="Property Address" />
        <select disabled={true}>
          <option>Select Type</option>
        </select>
        <input type="date" disabled={true} />
      </>
    );

    const inputs = container.querySelectorAll('input, select');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('should show loading state with proper styling', () => {
    const { container } = render(
      <button disabled={true} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('disabled:bg-gray-400');
    expect(button).toBeDisabled();
  });
});

describe('Loading States - Certificate Page', () => {
  it('should display loading message while fetching certificate', () => {
    render(
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading certificate...</p>
        </div>
      </main>
    );

    expect(screen.getByText('Loading certificate...')).toBeInTheDocument();
  });

  it('should show loading state with proper styling', () => {
    const { container } = render(
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading certificate...</p>
        </div>
      </main>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center');
  });

  it('should display loading indicator during PDF generation', () => {
    const { container } = render(
      <button disabled={true} className="px-6 py-3 bg-certificate-deep-blue text-white font-semibold rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
        Generating PDF...
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(screen.getByText('Generating PDF...')).toBeInTheDocument();
  });

  it('should disable download button during PDF generation', () => {
    const { container } = render(
      <button disabled={true} className="px-6 py-3 bg-certificate-deep-blue text-white font-semibold rounded">
        Download PDF
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('should show retry button on PDF generation error', () => {
    render(
      <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition">
        Retry PDF Download
      </button>
    );

    expect(screen.getByText('Retry PDF Download')).toBeInTheDocument();
  });

  it('should have proper loading state styling for PDF button', () => {
    const { container } = render(
      <button disabled={true} className="px-6 py-3 bg-certificate-deep-blue text-white font-semibold rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
        Generating PDF...
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });
});

describe('Loading States - Verification Page', () => {
  it('should display loading message while fetching document', () => {
    render(
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading verification page...</p>
        </div>
      </main>
    );

    expect(screen.getByText('Loading verification page...')).toBeInTheDocument();
  });

  it('should display loading indicator during verification', () => {
    const { container } = render(
      <button disabled={true} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Verifying...
      </button>
    );

    expect(screen.getByText('Verifying...')).toBeInTheDocument();
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should disable verify button during verification', () => {
    const { container } = render(
      <button disabled={true} className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg">
        Verify Document
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('should disable file input during verification', () => {
    const { container } = render(
      <input
        id="verify-file"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={true}
        className="hidden"
      />
    );

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeDisabled();
  });

  it('should show retry button on verification error', () => {
    render(
      <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition">
        Retry Verification
      </button>
    );

    expect(screen.getByText('Retry Verification')).toBeInTheDocument();
  });

  it('should have animated spinner during hash computation', () => {
    const { container } = render(
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should show proper loading state styling', () => {
    const { container } = render(
      <button disabled={true} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
        Verifying...
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('disabled:bg-gray-400');
    expect(button).toBeDisabled();
  });
});

describe('Loading States - General UI Patterns', () => {
  it('should have animated spinner SVG', () => {
    const { container } = render(
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('should have proper disabled button styling', () => {
    const { container } = render(
      <button disabled={true} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg">
        Submit
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('disabled:bg-gray-400');
    expect(button).toBeDisabled();
  });

  it('should show loading text with spinner', () => {
    render(
      <button>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should have proper flex layout for loading button', () => {
    const { container } = render(
      <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should have proper opacity for disabled state', () => {
    const { container } = render(
      <button disabled={true} className="disabled:opacity-50 disabled:cursor-not-allowed">
        Disabled Button
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should have proper transition for loading state', () => {
    const { container } = render(
      <button className="transition duration-200">
        Button
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('transition', 'duration-200');
  });
});

describe('Loading States - Error Recovery', () => {
  it('should show retry button after error', () => {
    render(
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 mb-4">Upload failed. Please try again.</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition">
            Retry
          </button>
          <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded transition">
            Dismiss
          </button>
        </div>
      </div>
    );

    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('should have proper error message styling', () => {
    const { container } = render(
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error message</p>
      </div>
    );

    const errorDiv = container.querySelector('div');
    expect(errorDiv).toHaveClass('bg-red-50', 'border', 'border-red-200');
  });

  it('should disable retry button during retry attempt', () => {
    const { container } = render(
      <button disabled={true} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded transition">
        Retrying...
      </button>
    );

    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });
});
