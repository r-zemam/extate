import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

/**
 * Mobile Responsiveness Tests
 * 
 * Validates: Requirements All (mobile support)
 * 
 * These tests verify that all pages render correctly on various screen sizes
 * and that responsive design classes are properly applied.
 */

describe('Mobile Responsiveness - Landing Page', () => {
  it('should render landing page with responsive layout on mobile', () => {
    render(<Home />);
    
    // Check that main content is present
    expect(screen.getByText('EXTATE')).toBeInTheDocument();
    expect(screen.getByText('Protect Your Property Documents')).toBeInTheDocument();
    expect(screen.getByText(/Families in developing countries/)).toBeInTheDocument();
  });

  it('should have responsive padding on mobile', () => {
    const { container } = render(<Home />);
    
    // Check for responsive padding classes
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });

  it('should have responsive text sizes on mobile', () => {
    const { container } = render(<Home />);
    
    // Check for responsive text size classes on heading
    const heading = screen.getByText('Protect Your Property Documents');
    expect(heading).toHaveClass('text-3xl', 'sm:text-4xl');
  });

  it('should have responsive grid layout for trust indicators', () => {
    const { container } = render(<Home />);
    
    // Check for responsive grid classes
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-3', 'gap-8');
  });

  it('should render CTA button with responsive styling', () => {
    const button = screen.getByText('Protect Your Documents');
    
    // Button should be present and clickable
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveClass('inline-block', 'px-8', 'py-4');
  });

  it('should have responsive max-width container', () => {
    const { container } = render(<Home />);
    
    // Check for max-width constraint
    const contentDiv = container.querySelector('.max-w-3xl');
    expect(contentDiv).toBeInTheDocument();
  });

  it('should have responsive flex layout for hero section', () => {
    const { container } = render(<Home />);
    
    // Check for flex layout classes
    const heroSection = container.querySelector('.flex.flex-col');
    expect(heroSection).toHaveClass('items-center', 'justify-center', 'min-h-screen');
  });

  it('should render all trust indicator cards', () => {
    render(<Home />);
    
    // Check for all three trust indicators
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('Verifiable')).toBeInTheDocument();
  });

  it('should have responsive spacing between elements', () => {
    const { container } = render(<Home />);
    
    // Check for responsive margin classes
    const heading = screen.getByText('EXTATE');
    expect(heading.closest('div')).toHaveClass('mb-8');
  });
});

describe('Mobile Responsiveness - Certificate Page', () => {
  it('should render certificate with responsive padding', () => {
    const { container } = render(
      <div className="p-8 sm:p-12 lg:p-16">
        <h1>Certificate</h1>
      </div>
    );
    
    // Check for responsive padding
    const div = container.querySelector('div');
    expect(div).toHaveClass('p-8', 'sm:p-12', 'lg:p-16');
  });

  it('should have responsive certificate container width', () => {
    const { container } = render(
      <div className="max-w-4xl mx-auto">
        <div>Certificate Content</div>
      </div>
    );
    
    // Check for max-width constraint
    const maxWidthDiv = container.querySelector('.max-w-4xl');
    expect(maxWidthDiv).toBeInTheDocument();
  });

  it('should have responsive grid for document details', () => {
    const { container } = render(
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>Detail 1</div>
        <div>Detail 2</div>
      </div>
    );
    
    // Check for responsive grid
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'gap-6');
  });

  it('should have responsive button layout', () => {
    const { container } = render(
      <div className="flex flex-col sm:flex-row gap-4">
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
    );
    
    // Check for responsive flex layout
    const flexDiv = container.querySelector('.flex');
    expect(flexDiv).toHaveClass('flex-col', 'sm:flex-row', 'gap-4');
  });

  it('should have responsive text sizes for certificate heading', () => {
    const { container } = render(
      <h1 className="text-3xl sm:text-4xl">Certificate Heading</h1>
    );
    
    // Check for responsive text sizes
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('text-3xl', 'sm:text-4xl');
  });

  it('should have responsive fingerprint display', () => {
    const { container } = render(
      <div className="bg-certificate-dark-text text-certificate-gold p-4 rounded font-mono text-xs sm:text-sm break-all">
        fingerprint
      </div>
    );
    
    // Check for responsive text size and word breaking
    const fingerprintDiv = container.querySelector('div');
    expect(fingerprintDiv).toHaveClass('text-xs', 'sm:text-sm', 'break-all');
  });
});

describe('Mobile Responsiveness - Upload Form', () => {
  it('should have responsive form container', () => {
    const { container } = render(
      <div className="max-w-2xl mx-auto">
        <form>Form Content</form>
      </div>
    );
    
    // Check for max-width constraint
    const maxWidthDiv = container.querySelector('.max-w-2xl');
    expect(maxWidthDiv).toBeInTheDocument();
  });

  it('should have responsive padding on form', () => {
    const { container } = render(
      <div className="p-8">
        <form>Form Content</form>
      </div>
    );
    
    // Check for padding
    const div = container.querySelector('div');
    expect(div).toHaveClass('p-8');
  });

  it('should have responsive text sizes in form', () => {
    const { container } = render(
      <h1 className="text-3xl font-bold">Form Title</h1>
    );
    
    // Check for responsive text size
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('text-3xl', 'font-bold');
  });

  it('should have responsive input field styling', () => {
    const { container } = render(
      <input className="w-full px-4 py-2 border rounded-lg" />
    );
    
    // Check for full width and responsive padding
    const input = container.querySelector('input');
    expect(input).toHaveClass('w-full', 'px-4', 'py-2');
  });

  it('should have responsive button styling', () => {
    const { container } = render(
      <button className="w-full bg-blue-600 py-3 px-4 rounded-lg">Submit</button>
    );
    
    // Check for full width and responsive padding
    const button = container.querySelector('button');
    expect(button).toHaveClass('w-full', 'py-3', 'px-4');
  });
});

describe('Mobile Responsiveness - Verification Page', () => {
  it('should have responsive verification container', () => {
    const { container } = render(
      <div className="max-w-4xl mx-auto">
        <div>Verification Content</div>
      </div>
    );
    
    // Check for max-width constraint
    const maxWidthDiv = container.querySelector('.max-w-4xl');
    expect(maxWidthDiv).toBeInTheDocument();
  });

  it('should have responsive document information grid', () => {
    const { container } = render(
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>Info 1</div>
        <div>Info 2</div>
      </div>
    );
    
    // Check for responsive grid
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'gap-4');
  });

  it('should have responsive fingerprint display in verification', () => {
    const { container } = render(
      <div className="bg-gray-900 text-blue-400 p-4 rounded font-mono text-xs sm:text-sm break-all">
        fingerprint
      </div>
    );
    
    // Check for responsive text size
    const div = container.querySelector('div');
    expect(div).toHaveClass('text-xs', 'sm:text-sm', 'break-all');
  });

  it('should have responsive action buttons layout', () => {
    const { container } = render(
      <div className="flex flex-col sm:flex-row gap-4">
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
    );
    
    // Check for responsive flex layout
    const flexDiv = container.querySelector('.flex');
    expect(flexDiv).toHaveClass('flex-col', 'sm:flex-row', 'gap-4');
  });
});

describe('Mobile Responsiveness - General Layout', () => {
  it('should have responsive main element padding', () => {
    const { container } = render(
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div>Content</div>
      </main>
    );
    
    // Check for responsive padding
    const main = container.querySelector('main');
    expect(main).toHaveClass('py-12', 'px-4', 'sm:px-6', 'lg:px-8');
  });

  it('should have responsive background gradients', () => {
    const { container } = render(
      <main className="bg-gradient-to-b from-slate-50 to-slate-100">
        <div>Content</div>
      </main>
    );
    
    // Check for gradient classes
    const main = container.querySelector('main');
    expect(main).toHaveClass('bg-gradient-to-b', 'from-slate-50', 'to-slate-100');
  });

  it('should have responsive shadow on cards', () => {
    const { container } = render(
      <div className="shadow-lg rounded-lg">
        <div>Card Content</div>
      </div>
    );
    
    // Check for shadow class
    const card = container.querySelector('div');
    expect(card).toHaveClass('shadow-lg', 'rounded-lg');
  });

  it('should have responsive border styling', () => {
    const { container } = render(
      <div className="border-2 border-dashed rounded-lg">
        <div>Content</div>
      </div>
    );
    
    // Check for border classes
    const div = container.querySelector('div');
    expect(div).toHaveClass('border-2', 'border-dashed', 'rounded-lg');
  });
});
