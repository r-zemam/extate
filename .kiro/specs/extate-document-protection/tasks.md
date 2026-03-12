# Implementation Plan: EXTATE Document Protection

## Overview

This plan implements a Next.js 14 document protection platform with client-side SHA-256 hashing, Supabase storage/database, and certificate generation. The implementation follows a bottom-up approach: core utilities first, then components, then pages, and finally integration.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Initialize Next.js 14 project with App Router and TypeScript
  - Install dependencies: Supabase client, jsPDF, Tailwind CSS
  - Configure Tailwind CSS with custom colors for certificate design
  - Create environment variables file for Supabase credentials
  - _Requirements: All (foundation for entire system)_

- [x] 2. Configure Supabase backend
  - [x] 2.1 Create Supabase database table
    - Create `documents` table with schema: id (UUID), owner_name, property_address, document_type, document_date, fingerprint, file_url, created_at
    - Set up UUID auto-generation and timestamp defaults
    - Create index on fingerprint field
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_
  
  - [x] 2.2 Create Supabase storage bucket
    - Create public storage bucket named `documents`
    - Configure 10MB file size limit
    - Set allowed MIME types: application/pdf, image/jpeg, image/png
    - _Requirements: 4.1_
  
  - [ ]* 2.3 Write unit tests for Supabase configuration
    - Test database connection and table schema
    - Test storage bucket accessibility
    - _Requirements: 10.1-10.10_

- [x] 3. Implement core cryptographic utilities
  - [x] 3.1 Create SHA-256 hash computation module
    - Implement `computeSHA256(file: File): Promise<string>` using Web Crypto API
    - Convert hash buffer to lowercase hexadecimal string
    - Add error handling for unsupported browsers
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 3.2 Write unit tests for hash computation
    - Test with known file contents and expected hashes
    - Test hash consistency for same file
    - Test output format (64-character hex string)
    - Test error handling when Web Crypto API unavailable
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Implement form validation utilities and date formatting
  - [x] 4.1 Create validation functions
    - Implement file type validation (PDF, JPG, PNG)
    - Implement file size validation (10MB limit)
    - Implement required field validation
    - Return specific error messages for each validation failure
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 4.2 Create date and label formatting utilities
    - Implement `formatDate(dateString: string): string` to format dates as "Month Day, Year"
    - Implement `formatTimestamp(timestamp: string): string` to format timestamps with time
    - Implement `getPropertyAddressLabel(documentType: string): string` for dynamic labels
    - Export utilities from lib/formatting.ts
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 4.3 Write unit tests for validation and formatting
    - Test file size validation (accept <10MB, reject >10MB)
    - Test file type validation (accept PDF/images, reject others)
    - Test required field validation
    - Test date formatting with various inputs
    - Test timestamp formatting
    - Test property address label logic for all document types
    - _Requirements: 2.1-2.6, 11.1-11.7_

- [x] 5. Create Supabase client and server actions
  - [x] 5.1 Initialize Supabase client
    - Create Supabase client instance with environment variables
    - Export client for use in server actions and components
    - _Requirements: 4.1, 4.2_
  
  - [~] 5.2 Implement document upload server action
    - Create `uploadDocument(formData: FormData)` server action
    - Upload file to Supabase Storage
    - Insert document record into database with all fields
    - Return document ID on success
    - Handle errors with specific messages
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [~] 5.3 Implement document retrieval server action
    - Create `getDocument(id: string)` server action
    - Fetch document record from database by ID
    - Return complete document record
    - Handle not found errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 5.4 Write integration tests for server actions
    - Test document upload with valid data
    - Test document retrieval with valid ID
    - Test error handling for upload failures
    - Test error handling for not found documents
    - _Requirements: 4.1, 4.2, 4.3, 5.1-5.6_

- [~] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Build landing page
  - [x] 7.1 Create landing page component at app/page.tsx
    - Display emotional headline "Your property. Protected forever."
    - Display concise one-sentence paragraph explaining the problem and solution
    - Add "Register a Document" button linking to /upload
    - Add "How it works" section with three numbered steps
    - Replace emoji icons with professional SVG icons (lock, lightning, checkmark)
    - Style with Tailwind CSS for clean, trustworthy design
    - Ensure mobile responsive layout
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ]* 7.2 Write unit tests for landing page
    - Test all required elements render
    - Test button navigation to /upload
    - _Requirements: 1.1-1.6_

- [x] 8. Build document upload page
  - [x] 8.1 Create upload form component at app/upload/page.tsx
    - Create form with file input (accept PDF and images)
    - Add text input for owner name
    - Add text input for property address with dynamic label
    - Add select dropdown for document type (deed, title, inheritance_record, tax_document)
    - Add date input for document date
    - Add submit button
    - Implement form state management
    - Add blue left border accents to visually group form sections
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8_
  
  - [x] 8.2 Implement client-side form validation
    - Validate all required fields before submission
    - Validate file type and size
    - Display specific error messages for each validation failure
    - Highlight invalid fields with appropriate colors (red for errors, amber for incomplete selections)
    - Prevent submission if validation fails
    - Provide real-time validation feedback
    - _Requirements: 2.1-2.7_
  
  - [x] 8.3 Implement dynamic property address label
    - Update label based on document type selection in real-time
    - "Property Address" for deed and title
    - "Estate / Property Description" for inheritance record
    - "Tax Parcel / Property Address" for tax document
    - Update placeholder text to match label
    - _Requirements: 2.3, 2.9_
  
  - [x] 8.4 Implement form submission flow
    - Compute SHA-256 hash of uploaded file on form submit
    - Show loading state during hash computation and upload
    - Call uploadDocument server action with form data and computed hash
    - Handle upload errors with user-friendly messages
    - Redirect to certificate page on success
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_
  
  - [ ]* 8.5 Write unit tests for upload form
    - Test form renders all input fields
    - Test validation prevents submission with invalid data
    - Test error messages display correctly
    - Test dynamic label updates
    - _Requirements: 2.1-2.9_
  
  - [x] 8.6 Write integration tests for upload flow
    - Test complete upload workflow with valid data
    - Test redirect to certificate page after successful upload
    - Test error handling for upload failures
    - _Requirements: 2.1-2.9, 3.1-3.3, 4.1-4.3_

- [x] 9. Build certificate page
  - [x] 9.1 Create certificate page component at app/certificate/[id]/page.tsx
    - Fetch document record using getDocument server action
    - Display owner name from database
    - Display property address with dynamic label based on document type
    - Display document type from database
    - Display document date in readable format using formatDate()
    - Display SHA-256 fingerprint prominently in monospace font
    - Display registration timestamp in readable format using formatTimestamp()
    - Handle document not found errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 11.1, 11.2, 11.6_
  
  - [x] 9.2 Implement official certificate styling
    - Use serif fonts (Times/Georgia) for formal appearance
    - Add gold accents (#D4AF37) for borders and decorative elements
    - Use deep blue (#1E3A5F) for headings and official elements
    - Use cream/off-white backgrounds (#FAF9F6, #F5F5DC) for sections
    - Add official seal with checkmark at top center
    - Implement decorative gold borders at top and bottom
    - Add blue left-border accents to sections
    - Structure content: header, seal, declaration, owner info, document details, fingerprint box, registration details, footer
    - Ensure print-friendly design
    - Ensure mobile responsive layout
    - _Requirements: 5.7_
  
  - [x] 9.3 Add certificate navigation buttons
    - Add "Download PDF" button with consistent blue styling
    - Add "Verify This Document" button linking to /verify/[id]
    - Style buttons to complement certificate design
    - _Requirements: 6.1, 7.1_
  
  - [ ]* 9.4 Write unit tests for certificate page
    - Test certificate renders with mock data
    - Test all document fields display correctly with formatted dates
    - Test dynamic property address label displays correctly
    - Test navigation buttons render
    - Test error handling for not found documents
    - _Requirements: 5.1-5.7, 6.1, 7.1, 11.1, 11.2, 11.6_

- [x] 10. Implement PDF generation
  - [x] 10.1 Create PDF generation module
    - Implement `generateCertificatePDF(document: DocumentRecord)` using jsPDF
    - Mirror web certificate styling: serif fonts, gold accents, official formatting
    - Include all certificate information with formatted dates using formatDate() and formatTimestamp()
    - Include dynamic property address labels using getPropertyAddressLabel()
    - Set filename format: `EXTATE_Certificate_[owner_name]_[id].pdf`
    - Initiate browser download
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 11.2, 11.7_
  
  - [x] 10.2 Wire PDF download button
    - Connect "Download PDF" button to PDF generation function
    - Show loading state during PDF generation
    - Handle PDF generation errors with user-friendly messages
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 10.3 Write unit tests for PDF generation
    - Test PDF generation with mock document data
    - Test filename format
    - Test error handling for generation failures
    - _Requirements: 6.1-6.6, 11.7_

- [~] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Build verification page
  - [x] 12.1 Create verification page component at app/verify/[id]/page.tsx
    - Fetch document record using getDocument server action
    - Display stored fingerprint from database
    - Add file input for uploading document to verify
    - Implement verification state management
    - Handle document not found errors
    - _Requirements: 8.1, 8.2_
  
  - [x] 12.2 Implement verification logic
    - Compute SHA-256 hash of uploaded file when user selects file
    - Compare computed hash with stored fingerprint
    - Display green checkmark indicator when hashes match
    - Display red warning indicator when hashes don't match
    - Display both stored and computed fingerprints side-by-side for comparison
    - Show loading state during hash computation
    - _Requirements: 8.3, 9.1, 9.2, 9.3_
  
  - [ ]* 12.3 Write unit tests for verification page
    - Test verification page renders with mock data
    - Test stored fingerprint displays correctly
    - Test file input renders
    - _Requirements: 8.1, 8.2_
  
  - [x] 12.4 Write integration tests for verification flow
    - Test verification with matching document (green checkmark)
    - Test verification with non-matching document (red warning)
    - Test side-by-side fingerprint comparison display
    - Test error handling for hash computation failures
    - _Requirements: 8.1-8.3, 9.1-9.3_

- [x] 13. Implement comprehensive error handling
  - [x] 13.1 Add error boundaries and error pages
    - Create custom 404 page for not found documents
    - Create error boundary for unexpected errors
    - Add error logging for debugging
    - _Requirements: All (error handling across system)_
  
  - [x] 13.2 Implement retry functionality
    - Add retry buttons for failed uploads
    - Add retry buttons for failed hash computations
    - Add retry buttons for failed PDF generation
    - Preserve form data during retries
    - _Requirements: All (error recovery)_
  
  - [x] 13.3 Add browser compatibility detection
    - Detect Web Crypto API support on page load
    - Display warning for unsupported browsers
    - Suggest modern browser alternatives
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 14. Final polish and testing
  - [x] 14.1 Ensure mobile responsiveness
    - Test all pages on various screen sizes
    - Adjust certificate design for mobile viewing
    - Ensure forms are usable on mobile devices
    - _Requirements: All (mobile support)_
  
  - [x] 14.2 Verify loading states
    - Ensure loading indicators display during hash computation
    - Ensure loading indicators display during file uploads
    - Ensure loading indicators display during PDF generation
    - Ensure loading indicators display during verification
    - _Requirements: All (user feedback)_
  
  - [ ]* 14.3 Run full integration test suite
    - Test complete registration flow end-to-end
    - Test certificate download flow
    - Test verification flow with matching and non-matching documents
    - Test error handling across all flows
    - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
    - _Requirements: All_

- [x] 15. UI refinements and improvements
  - [x] 15.1 Improve landing page copy and design
    - Shorten body text to one punchy sentence
    - Replace emoji icons with professional SVG icons
    - Maintain emotional headline "Your property. Protected forever."
    - _Requirements: 1.2, 1.3, 1.6_
  
  - [x] 15.2 Add dynamic property address labels to upload form
    - Implement real-time label updates based on document type selection
    - Update placeholder text to match label
    - _Requirements: 2.3, 2.9, 11.5_
  
  - [x] 15.3 Enhance upload form visual design
    - Add blue left border accents to form sections
    - Use amber/yellow validation styling for incomplete selections
    - Ensure consistent button colors across all pages
    - _Requirements: 2.7, 2.8_
  
  - [x] 15.4 Implement date formatting across all pages
    - Apply formatDate() to all document dates
    - Apply formatTimestamp() to all registration timestamps
    - Ensure consistency in web views and PDF downloads
    - _Requirements: 11.1, 11.2, 11.6, 11.7_
  
  - [x] 15.5 Create steering files for project standards
    - Create tech-stack.md with architecture guidelines
    - Create project-context.md with mission and user context
    - Create coding-standards.md with TypeScript, error handling, and formatting rules
    - _Requirements: All (development standards)_
  
  - [x] 15.6 Create agent hooks for code quality
    - Create auto-docs hook to add JSDoc comments on file save
    - Create test-reminder hook to prompt for test files on file creation
    - _Requirements: All (code quality automation)_

- [ ] 16. Remaining polish tasks
  - [ ] 16.1 Add comprehensive JSDoc comments
    - Review all exported functions in lib/ directory
    - Add JSDoc comments with parameter descriptions and examples
    - Ensure formatting utilities have complete documentation
    - _Requirements: All (code documentation)_
  
  - [ ] 16.2 Accessibility audit
    - Verify all form inputs have proper labels
    - Check color contrast ratios meet WCAG standards
    - Test keyboard navigation on all pages
    - Ensure screen reader compatibility
    - _Requirements: All (accessibility)_
  
  - [ ] 16.3 Performance optimization
    - Analyze bundle size and optimize if needed
    - Ensure images are optimized (if any added)
    - Verify server components are used where appropriate
    - Test page load times on slow connections
    - _Requirements: All (performance)_
  
  - [ ]* 16.4 Create user documentation
    - Write README with setup instructions
    - Document environment variable configuration
    - Add troubleshooting guide for common issues
    - Create deployment guide for production
    - _Requirements: All (documentation)_

- [x] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The certificate design is critical to user trust - allocate sufficient time for styling
- All cryptographic operations use browser-native Web Crypto API
- Public Supabase storage simplifies architecture (no signed URLs needed)
- Focus on clear error messages and retry functionality for robust user experience