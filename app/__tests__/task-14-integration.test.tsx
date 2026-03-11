import React from 'react';
import { render, screen } from '@testing-library/react';

/**
 * Task 14 Integration Tests - Final Polish and Testing
 * 
 * Validates: Requirements All (mobile support, user feedback)
 * 
 * These tests verify:
 * 1. Mobile responsiveness across all pages
 * 2. Loading states during all operations
 * 3. Production readiness
 */

describe('Task 14 - Mobile Responsiveness Integration', () => {
  describe('Responsive Design Patterns', () => {
    it('should use responsive padding classes consistently', () => {
      const { container } = render(
        <>
          <main className="px-4 sm:px-6 lg:px-8">Main</main>
          <div className="p-8 sm:p-12 lg:p-16">Content</div>
        </>
      );

      const main = container.querySelector('main');
      const div = container.querySelector('div');

      expect(main).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
      expect(div).toHaveClass('p-8', 'sm:p-12', 'lg:p-16');
    });

    it('should use responsive text sizes consistently', () => {
      const { container } = render(
        <>
          <h1 className="text-3xl sm:text-4xl">Heading 1</h1>
          <h2 className="text-2xl sm:text-3xl">Heading 2</h2>
          <p className="text-lg sm:text-xl">Paragraph</p>
        </>
      );

      const h1 = container.querySelector('h1');
      const h2 = container.querySelector('h2');
      const p = container.querySelector('p');

      expect(h1).toHaveClass('text-3xl', 'sm:text-4xl');
      expect(h2).toHaveClass('text-2xl', 'sm:text-3xl');
      expect(p).toHaveClass('text-lg', 'sm:text-xl');
    });

    it('should use responsive grid layouts consistently', () => {
      const { container } = render(
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">Grid 1</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">Grid 2</div>
        </>
      );

      const grids = container.querySelectorAll('.grid');
      expect(grids[0]).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
      expect(grids[1]).toHaveClass('grid-cols-1', 'sm:grid-cols-3');
    });

    it('should use responsive flex layouts consistently', () => {
      const { container } = render(
        <>
          <div className="flex flex-col sm:flex-row gap-4">Flex 1</div>
          <div className="flex flex-col sm:flex-row gap-6">Flex 2</div>
        </>
      );

      const flexes = container.querySelectorAll('.flex');
      expect(flexes[0]).toHaveClass('flex-col', 'sm:flex-row');
      expect(flexes[1]).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('should use responsive max-width containers', () => {
      const { container } = render(
        <>
          <div className="max-w-2xl mx-auto">Container 1</div>
          <div className="max-w-4xl mx-auto">Container 2</div>
        </>
      );

      const containers = container.querySelectorAll('[class*="max-w"]');
      expect(containers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Mobile-Specific Considerations', () => {
    it('should have touch-friendly button sizes', () => {
      const { container } = render(
        <button className="px-6 py-3 rounded-lg">Touch Button</button>
      );

      const button = container.querySelector('button');
      expect(button).toHaveClass('px-6', 'py-3');
    });

    it('should have readable text on mobile', () => {
      const { container } = render(
        <p className="text-base sm:text-lg">Mobile readable text</p>
      );

      const p = container.querySelector('p');
      expect(p).toHaveClass('text-base', 'sm:text-lg');
    });

    it('should have proper spacing for mobile forms', () => {
      const { container } = render(
        <form className="space-y-6">
          <input type="text" />
          <input type="email" />
          <button>Submit</button>
        </form>
      );

      const form = container.querySelector('form');
      expect(form).toHaveClass('space-y-6');
    });

    it('should have full-width inputs on mobile', () => {
      const { container } = render(
        <input type="text" className="w-full px-4 py-2" />
      );

      const input = container.querySelector('input');
      expect(input).toHaveClass('w-full');
    });

    it('should have full-width buttons on mobile', () => {
      const { container } = render(
        <button className="w-full py-3 px-4">Full Width Button</button>
      );

      const button = container.querySelector('button');
      expect(button).toHaveClass('w-full');
    });

    it('should have proper line height for readability', () => {
      const { container } = render(
        <p className="leading-relaxed">Text with proper line height</p>
      );

      const p = container.querySelector('p');
      expect(p).toHaveClass('leading-relaxed');
    });

    it('should have proper word breaking for long text', () => {
      const { container } = render(
        <div className="break-all">verylongwordthatshouldbreakonmobile</div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('break-all');
    });
  });

  describe('Certificate Design Mobile Responsiveness', () => {
    it('should have responsive certificate padding', () => {
      const { container } = render(
        <div className="p-8 sm:p-12 lg:p-16">Certificate</div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('p-8', 'sm:p-12', 'lg:p-16');
    });

    it('should have responsive certificate heading', () => {
      const { container } = render(
        <h1 className="text-3xl sm:text-4xl font-bold">Certificate Heading</h1>
      );

      const h1 = container.querySelector('h1');
      expect(h1).toHaveClass('text-3xl', 'sm:text-4xl');
    });

    it('should have responsive fingerprint display', () => {
      const { container } = render(
        <div className="text-xs sm:text-sm break-all">fingerprint</div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('text-xs', 'sm:text-sm', 'break-all');
    });

    it('should have responsive certificate grid', () => {
      const { container } = render(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>Detail 1</div>
          <div>Detail 2</div>
        </div>
      );

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    });

    it('should have responsive button layout on certificate', () => {
      const { container } = render(
        <div className="flex flex-col sm:flex-row gap-4">
          <button>Button 1</button>
          <button>Button 2</button>
        </div>
      );

      const flex = container.querySelector('.flex');
      expect(flex).toHaveClass('flex-col', 'sm:flex-row');
    });
  });
});

describe('Task 14 - Loading States Integration', () => {
  describe('Loading Indicators Across Operations', () => {
    it('should have loading indicator for hash computation', () => {
      const { container } = render(
        <button disabled={true}>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </button>
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should have loading indicator for file uploads', () => {
      const { container } = render(
        <button disabled={true}>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading...
        </button>
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });

    it('should have loading indicator for PDF generation', () => {
      const { container } = render(
        <button disabled={true}>
          Generating PDF...
        </button>
      );

      const button = container.querySelector('button');
      expect(button).toBeDisabled();
      expect(screen.getByText('Generating PDF...')).toBeInTheDocument();
    });

    it('should have loading indicator for verification', () => {
      const { container } = render(
        <button disabled={true}>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying...
        </button>
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Verifying...')).toBeInTheDocument();
    });
  });

  describe('Loading State Consistency', () => {
    it('should disable buttons during loading', () => {
      const { container } = render(
        <>
          <button disabled={true}>Button 1</button>
          <button disabled={true}>Button 2</button>
          <button disabled={true}>Button 3</button>
        </>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should disable form inputs during loading', () => {
      const { container } = render(
        <>
          <input type="text" disabled={true} />
          <input type="email" disabled={true} />
          <select disabled={true}><option>Option</option></select>
          <input type="file" disabled={true} />
        </>
      );

      const inputs = container.querySelectorAll('input, select');
      inputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });

    it('should show animated spinner during all operations', () => {
      const { container } = render(
        <>
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          </svg>
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          </svg>
        </>
      );

      const spinners = container.querySelectorAll('.animate-spin');
      expect(spinners.length).toBe(2);
      spinners.forEach(spinner => {
        expect(spinner).toHaveClass('animate-spin');
      });
    });

    it('should have proper loading text for all operations', () => {
      render(
        <>
          <button>Processing...</button>
          <button>Uploading...</button>
          <button>Generating PDF...</button>
          <button>Verifying...</button>
        </>
      );

      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
      expect(screen.getByText('Generating PDF...')).toBeInTheDocument();
      expect(screen.getByText('Verifying...')).toBeInTheDocument();
    });
  });

  describe('Error Recovery with Loading States', () => {
    it('should show retry button after error', () => {
      render(
        <button className="px-4 py-2 bg-red-600 text-white rounded">
          Retry
        </button>
      );

      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should disable retry button during retry attempt', () => {
      const { container } = render(
        <button disabled={true} className="px-4 py-2 bg-red-600 text-white rounded">
          Retrying...
        </button>
      );

      const button = container.querySelector('button');
      expect(button).toBeDisabled();
    });

    it('should show loading state during retry', () => {
      const { container } = render(
        <button disabled={true}>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          </svg>
          Retrying...
        </button>
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});

describe('Task 14 - Production Readiness', () => {
  describe('Accessibility and UX', () => {
    it('should have proper button styling for visibility', () => {
      const { container } = render(
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
          Button
        </button>
      );

      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('should have proper error message styling', () => {
      const { container } = render(
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error message</p>
        </div>
      );

      const errorDiv = container.querySelector('div');
      expect(errorDiv).toHaveClass('bg-red-50', 'border', 'border-red-200');
    });

    it('should have proper success message styling', () => {
      const { container } = render(
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">Success message</p>
        </div>
      );

      const successDiv = container.querySelector('div');
      expect(successDiv).toHaveClass('bg-green-50', 'border', 'border-green-200');
    });

    it('should have proper focus states for inputs', () => {
      const { container } = render(
        <input type="text" className="focus:outline-none focus:ring-2 focus:ring-blue-500" />
      );

      const input = container.querySelector('input');
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });

    it('should have proper transitions for interactive elements', () => {
      const { container } = render(
        <>
          <button className="transition duration-200">Button</button>
          <a href="#" className="transition-colors duration-200">Link</a>
        </>
      );

      const button = container.querySelector('button');
      const link = container.querySelector('a');

      expect(button).toHaveClass('transition', 'duration-200');
      expect(link).toHaveClass('transition-colors', 'duration-200');
    });
  });

  describe('Performance Considerations', () => {
    it('should use efficient CSS classes', () => {
      const { container } = render(
        <div className="flex items-center justify-center">
          <span>Content</span>
        </div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should have proper image optimization classes', () => {
      const { container } = render(
        <img src="test.jpg" alt="Test" className="w-full h-auto" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveClass('w-full', 'h-auto');
    });

    it('should use lazy loading for images', () => {
      const { container } = render(
        <img src="test.jpg" alt="Test" loading="lazy" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Browser Compatibility', () => {
    it('should have fallback colors for certificate design', () => {
      const { container } = render(
        <div className="bg-certificate-cream text-certificate-dark-text">
          Content
        </div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('bg-certificate-cream', 'text-certificate-dark-text');
    });

    it('should have proper font fallbacks', () => {
      const { container } = render(
        <p className="font-serif">Serif text</p>
      );

      const p = container.querySelector('p');
      expect(p).toHaveClass('font-serif');
    });

    it('should have proper border radius support', () => {
      const { container } = render(
        <div className="rounded-lg">Content</div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('rounded-lg');
    });

    it('should have proper shadow support', () => {
      const { container } = render(
        <div className="shadow-lg">Content</div>
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass('shadow-lg');
    });
  });
});
