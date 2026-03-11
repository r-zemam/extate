/**
 * Utility functions for formatting dates and labels
 */

/**
 * Format a date string to full readable format
 * @param dateString - Date string in ISO format or YYYY-MM-DD format
 * @returns Formatted date like "March 1, 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a timestamp to full readable format with time
 * @param timestamp - ISO timestamp string
 * @returns Formatted date like "March 1, 2026 at 2:30 PM"
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get the appropriate property address label based on document type
 * @param documentType - The type of document (deed, title, inheritance_record, tax_document)
 * @returns The appropriate label for the property address field
 */
export function getPropertyAddressLabel(documentType: string): string {
  switch (documentType.toLowerCase()) {
    case 'deed':
    case 'title':
      return 'Property Address';
    case 'inheritance_record':
      return 'Estate / Property Description';
    case 'tax_document':
      return 'Tax Parcel / Property Address';
    default:
      return 'Property Address';
  }
}
