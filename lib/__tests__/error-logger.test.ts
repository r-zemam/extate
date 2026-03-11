import {
  logError,
  logHashComputationError,
  logUploadError,
  logPdfGenerationError,
  logVerificationError,
  logBrowserCompatibilityIssue,
  ErrorLog,
} from '../error-logger';

describe('Error Logger', () => {
  // Mock console.error
  const originalConsoleError = console.error;
  let consoleErrorSpy: jest.Mock;

  beforeEach(() => {
    consoleErrorSpy = jest.fn();
    console.error = consoleErrorSpy;
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('logError', () => {
    it('should log error with message', () => {
      const error = new Error('Test error');
      logError(error, 'test context');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.message).toBe('Test error');
      expect(loggedData.context).toBe('test context');
    });

    it('should log string errors', () => {
      logError('String error', 'test context');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.message).toBe('String error');
    });

    it('should include severity level', () => {
      const error = new Error('Test error');
      logError(error, 'test context', 'critical');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.severity).toBe('critical');
    });

    it('should include error type', () => {
      const error = new TypeError('Type error');
      logError(error, 'test context');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.errorType).toBe('TypeError');
    });

    it('should include timestamp', () => {
      const error = new Error('Test error');
      logError(error, 'test context');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.timestamp).toBeDefined();
      expect(typeof loggedData.timestamp).toBe('string');
    });
  });

  describe('logHashComputationError', () => {
    it('should log hash computation error with file name', () => {
      const error = new Error('Hash failed');
      logHashComputationError(error, 'document.pdf');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.context).toContain('Hash computation failed');
      expect(loggedData.context).toContain('document.pdf');
    });

    it('should log hash computation error without file name', () => {
      const error = new Error('Hash failed');
      logHashComputationError(error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.context).toContain('Hash computation failed');
    });
  });

  describe('logUploadError', () => {
    it('should log upload error with file name', () => {
      const error = new Error('Upload failed');
      logUploadError(error, 'document.pdf');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.context).toContain('Upload failed');
      expect(loggedData.context).toContain('document.pdf');
    });
  });

  describe('logPdfGenerationError', () => {
    it('should log PDF generation error with document ID', () => {
      const error = new Error('PDF generation failed');
      logPdfGenerationError(error, 'doc-123');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.context).toContain('PDF generation failed');
      expect(loggedData.context).toContain('doc-123');
    });
  });

  describe('logVerificationError', () => {
    it('should log verification error with document ID', () => {
      const error = new Error('Verification failed');
      logVerificationError(error, 'doc-456');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.context).toContain('Verification failed');
      expect(loggedData.context).toContain('doc-456');
    });
  });

  describe('logBrowserCompatibilityIssue', () => {
    it('should log browser compatibility issue', () => {
      logBrowserCompatibilityIssue('Web Crypto API');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.message).toContain('Web Crypto API');
      expect(loggedData.severity).toBe('warning');
    });
  });
});
