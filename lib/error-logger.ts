/**
 * Error logging utilities for EXTATE
 * 
 * This module provides centralized error logging for debugging and monitoring.
 * Errors are logged to the browser console and can be sent to external services.
 */

export interface ErrorLog {
  message: string;
  stack?: string;
  context?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  errorType?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Logs an error with context information
 * 
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 * @param severity - The severity level of the error
 */
export function logError(
  error: Error | string,
  context?: string,
  severity: 'info' | 'warning' | 'error' | 'critical' = 'error'
): void {
  const errorLog: ErrorLog = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    severity,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[EXTATE Error Log]', errorLog);
  }

  // Send to external logging service (optional)
  // This could be integrated with Sentry, LogRocket, or similar services
  if (typeof window !== 'undefined' && severity === 'critical') {
    // Example: sendToLoggingService(errorLog);
  }
}

/**
 * Logs a hash computation error
 */
export function logHashComputationError(
  error: Error,
  fileName?: string
): void {
  logError(
    error,
    `Hash computation failed for file: ${fileName || 'unknown'}`,
    'error'
  );
}

/**
 * Logs an upload error
 */
export function logUploadError(
  error: Error,
  fileName?: string
): void {
  logError(
    error,
    `Upload failed for file: ${fileName || 'unknown'}`,
    'error'
  );
}

/**
 * Logs a PDF generation error
 */
export function logPdfGenerationError(
  error: Error,
  documentId?: string
): void {
  logError(
    error,
    `PDF generation failed for document: ${documentId || 'unknown'}`,
    'error'
  );
}

/**
 * Logs a verification error
 */
export function logVerificationError(
  error: Error,
  documentId?: string
): void {
  logError(
    error,
    `Verification failed for document: ${documentId || 'unknown'}`,
    'error'
  );
}

/**
 * Logs a browser compatibility issue
 */
export function logBrowserCompatibilityIssue(
  feature: string
): void {
  logError(
    `Browser does not support ${feature}`,
    'Browser compatibility check',
    'warning'
  );
}
