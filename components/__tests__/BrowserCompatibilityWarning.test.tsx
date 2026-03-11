import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BrowserCompatibilityWarning from '../BrowserCompatibilityWarning';
import * as cryptoModule from '@/lib/crypto';

// Mock the crypto module
jest.mock('@/lib/crypto', () => ({
  isCryptoSupported: jest.fn(),
}));

describe('BrowserCompatibilityWarning', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should not render when crypto is supported', () => {
    (cryptoModule.isCryptoSupported as jest.Mock).mockReturnValue(true);

    const { container } = render(<BrowserCompatibilityWarning />);
    expect(container.firstChild).toBeNull();
  });

  it('should render warning when crypto is not supported', () => {
    (cryptoModule.isCryptoSupported as jest.Mock).mockReturnValue(false);

    render(<BrowserCompatibilityWarning />);

    expect(screen.getByText('Browser Compatibility Warning')).toBeInTheDocument();
    expect(screen.getByText(/Web Crypto API required/i)).toBeInTheDocument();
  });

  it('should display recommended browsers', () => {
    (cryptoModule.isCryptoSupported as jest.Mock).mockReturnValue(false);

    render(<BrowserCompatibilityWarning />);

    expect(screen.getByText('Google Chrome (version 37+)')).toBeInTheDocument();
    expect(screen.getByText('Mozilla Firefox (version 34+)')).toBeInTheDocument();
    expect(screen.getByText('Apple Safari (version 11+)')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Edge (version 79+)')).toBeInTheDocument();
  });

  it('should dismiss warning when dismiss button is clicked', () => {
    (cryptoModule.isCryptoSupported as jest.Mock).mockReturnValue(false);

    const { container, rerender } = render(<BrowserCompatibilityWarning />);

    expect(screen.getByText('Browser Compatibility Warning')).toBeInTheDocument();

    // Click dismiss button
    const dismissButton = screen.getByLabelText('Dismiss warning');
    fireEvent.click(dismissButton);

    // Re-render and check if warning is gone
    rerender(<BrowserCompatibilityWarning />);
    expect(container.querySelector('[class*="fixed"]')).toBeNull();
  });

  it('should persist dismissed state in localStorage', () => {
    (cryptoModule.isCryptoSupported as jest.Mock).mockReturnValue(false);

    const { rerender } = render(<BrowserCompatibilityWarning />);

    // Dismiss warning
    const dismissButton = screen.getByLabelText('Dismiss warning');
    fireEvent.click(dismissButton);

    // Check localStorage
    expect(localStorage.getItem('crypto-warning-dismissed')).toBe('true');

    // Re-render and verify warning doesn't show
    rerender(<BrowserCompatibilityWarning />);
    expect(screen.queryByText('Browser Compatibility Warning')).not.toBeInTheDocument();
  });

  it('should not render if warning was previously dismissed', () => {
    (cryptoModule.isCryptoSupported as jest.Mock).mockReturnValue(false);
    localStorage.setItem('crypto-warning-dismissed', 'true');

    const { container } = render(<BrowserCompatibilityWarning />);
    expect(container.firstChild).toBeNull();
  });
});
