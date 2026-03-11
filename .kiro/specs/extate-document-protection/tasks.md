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

- [x] 4. Implement form validation utilities
  - [x] 4.1 Create validation functions
    - Implement file type validation (PDF, JPG, PNG)
    - Implement file size validation (10MB limit)
    - Implement required field validation
    - Return specific error messages for each validation failure
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 4.2 Write unit tests for validation
    - Test file size validation (accept <10MB, reject >10MB)
    - Test file type validation (accept PDF/images, reject others)
    - Test required field validation
    - _Requirements: 2.1-2.6_

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
    - Display headline describing document protection service
    - Display paragraph explaining the problem
    - Add "Protect Your Documents" button linking to /upload
    - Style with Tailwind CSS for clean, trustworthy design
    - Ensure mobile responsive layout
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 7.2 Write unit tests for landing page
    - Test all required elements render
    - Test button navigation to /upload
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 8. Build document upload page
  - [x] 8.1 Create upload form component at app/upload/page.tsx
    - Create form with file input (accept PDF and images)
    - Add text input for owner name
    - Add text input for property address
    - Add select dropdown for document type (deed, title, inheritance_record, tax_document)
    - Add date input for document date
    - Add submit button
    - Implement form state management
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x] 8.2 Implement client-side form validation
    - Validate all required fields before submission
    - Validate file type and size
    - Display specific error messages for each validation failure
    - Highlight invalid fields
    - Prevent submission if validation fails
    - _Requirements: 2.1-2.6_
  
  - [x] 8.3 Implement form submission flow
    - Compute SHA-256 hash of uploaded file on form submit
    - Show loading state during hash computation and upload
    - Call uploadDocument server action with form data and computed hash
    - Handle upload errors with user-friendly messages
    - Redirect to certificate page on success
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_
  
  - [ ]* 8.4 Write unit tests for upload form
    - Test form renders all input fields
    - Test validation prevents submission with invalid data
    - Test error messages display correctly
    - _Requirements: 2.1-2.6_
  
  - [x] 8.5 Write integration tests for upload flow
    - Test complete upload workflow with valid data
    - Test redirect to certificate page after successful upload
    - Test error handling for upload failures
    - _Requirements: 2.1-2.6, 3.1-3.3, 4.1-4.3_

- [x] 9. Build certificate page
  - [x] 9.1 Create certificate page component at app/certificate/[id]/page.tsx
    - Fetch document record using getDocument server action
    - Display owner name from database
    - Display property address from database
    - Display document type from database
    - Display document date from database
    - Display SHA-256 fingerprint prominently in monospace font
    - Display registration timestamp from database
    - Handle document not found errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 9.2 Implement official certificate styling
    - Create government-document-style design with formal typography
    - Add official seal or emblem at top center
    - Use serif fonts (Crimson Text, Libre Baskerville, or EB Garamond)
    - Implement formal centered layout with wide margins
    - Add decorative border or frame around certificate
    - Use traditional document colors (cream background, dark text, gold accents)
    - Structure content: header, seal, declaration, owner info, document details, fingerprint box, registration details, footer
    - Ensure print-friendly design
    - Ensure mobile responsive layout
    - _Requirements: 5.7_
  
  - [x] 9.3 Add certificate navigation buttons
    - Add "Download PDF" button
    - Add "Verify This Document" button linking to /verify/[id]
    - Style buttons to complement certificate design
    - _Requirements: 6.1, 7.1_
  
  - [ ]* 9.4 Write unit tests for certificate page
    - Test certificate renders with mock data
    - Test all document fields display correctly
    - Test navigation buttons render
    - Test error handling for not found documents
    - _Requirements: 5.1-5.7, 6.1, 7.1_

- [-] 10. Implement PDF generation
  - [x] 10.1 Create PDF generation module
    - Implement `generateCertificatePDF(document: DocumentRecord)` using jsPDF
    - Mirror web certificate styling in PDF layout
    - Include all certificate information: owner name, property address, document type, document date, fingerprint, registration timestamp
    - Set filename format: `EXTATE_Certificate_[owner_name]_[id].pdf`
    - Initiate browser download
    - _Requirements: 6.2_
  
  - [x] 10.2 Wire PDF download button
    - Connect "Download PDF" button to PDF generation function
    - Show loading state during PDF generation
    - Handle PDF generation errors with user-friendly messages
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 10.3 Write unit tests for PDF generation
    - Test PDF generation with mock document data
    - Test filename format
    - Test error handling for generation failures
    - _Requirements: 6.1, 6.2_

- [~] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 12. Build verification page
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
  
  - [~] 12.4 Write integration tests for verification flow
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

- [~] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The certificate design is critical to user trust - allocate sufficient time for styling
- All cryptographic operations use browser-native Web Crypto API
- Public Supabase storage simplifies architecture (no signed URLs needed)
- Focus on clear error messages and retry functionality for robust user experience