# Requirements Document

## Introduction

EXTATE is a document protection platform that enables families in developing countries to create cryptographic proof of property ownership. The system generates tamper-evident certificates by computing SHA-256 fingerprints of ownership documents, storing them securely, and providing verification capabilities to prove document authenticity.

## Glossary

- **EXTATE_System**: The complete web application including all pages and backend services
- **Document_Uploader**: The component that handles file uploads and metadata collection
- **Hash_Generator**: The browser-based component that computes SHA-256 fingerprints
- **Certificate_Generator**: The component that creates downloadable PDF certificates
- **Verification_Engine**: The component that compares uploaded files against stored fingerprints
- **Document_Store**: The Supabase storage system for uploaded files
- **Document_Registry**: The Supabase database table storing document metadata and fingerprints
- **Property_Document**: A PDF or image file representing ownership evidence (deed, title, inheritance record, or tax document)
- **Document_Fingerprint**: The SHA-256 hash of a Property_Document
- **Certificate**: An official-looking document displaying ownership information and the Document_Fingerprint

## Requirements

### Requirement 1: Landing Page Display

**User Story:** As a property owner, I want to see a clear explanation of the service, so that I understand how EXTATE protects my documents.

#### Acceptance Criteria

1. THE EXTATE_System SHALL display a landing page at the root URL path
2. THE EXTATE_System SHALL display an emotional headline "Your property. Protected forever."
3. THE EXTATE_System SHALL display a concise paragraph (one sentence) explaining how disasters and corruption threaten ownership and how EXTATE provides permanent protection
4. THE EXTATE_System SHALL display a "Register a Document" button that navigates to the upload page
5. THE EXTATE_System SHALL display a "How it works" section with three numbered steps
6. THE EXTATE_System SHALL display trust indicators with professional SVG icons (lock, lightning, checkmark) instead of emojis

### Requirement 2: Document Upload Interface

**User Story:** As a property owner, I want to upload my property document with relevant details, so that I can register it in the system.

#### Acceptance Criteria

1. THE Document_Uploader SHALL display a file input accepting PDF and image formats
2. THE Document_Uploader SHALL display an input field for owner name
3. THE Document_Uploader SHALL display an input field for property address with a dynamic label that changes based on document type selection
4. THE Document_Uploader SHALL display a selection field for document type with options: deed, title, inheritance record, and tax document
5. THE Document_Uploader SHALL display an input field for document date
6. THE Document_Uploader SHALL display a submit button to initiate registration
7. THE Document_Uploader SHALL provide real-time validation feedback with appropriate error styling (red for errors, amber for incomplete selections)
8. THE Document_Uploader SHALL group related fields with blue left border accents for visual hierarchy
9. THE Document_Uploader SHALL update the property address label dynamically:
   - "Property Address" for deed and title
   - "Estate / Property Description" for inheritance record
   - "Tax Parcel / Property Address" for tax document

### Requirement 3: Client-Side Hash Generation

**User Story:** As a property owner, I want my document fingerprinted in my browser, so that the original file integrity can be verified later.

#### Acceptance Criteria

1. WHEN the user submits the upload form, THE Hash_Generator SHALL compute the SHA-256 hash of the uploaded file using the Web Crypto API
2. THE Hash_Generator SHALL complete the hash computation before uploading the file to storage
3. THE Hash_Generator SHALL use the browser's native cryptographic functions without server-side processing

### Requirement 4: Document Storage and Registration

**User Story:** As a property owner, I want my document and its details stored securely, so that I have permanent proof of registration.

#### Acceptance Criteria

1. WHEN the Document_Fingerprint is computed, THE EXTATE_System SHALL upload the Property_Document to the Document_Store
2. WHEN the file upload completes, THE EXTATE_System SHALL create a record in the Document_Registry with owner name, property address, document type, document date, Document_Fingerprint, file URL, and registration timestamp
3. WHEN the registration completes, THE EXTATE_System SHALL redirect the user to the certificate page for the new record

### Requirement 5: Certificate Display

**User Story:** As a property owner, I want to view an official-looking certificate of my registration, so that I have visual proof of my document protection.

#### Acceptance Criteria

1. THE Certificate_Generator SHALL display the owner name from the Document_Registry
2. THE Certificate_Generator SHALL display the property address with a dynamic label based on document type (matching the upload form labels)
3. THE Certificate_Generator SHALL display the document type from the Document_Registry
4. THE Certificate_Generator SHALL display the document date in readable format (e.g., "March 1, 2026")
5. THE Certificate_Generator SHALL display the Document_Fingerprint in a prominent format with monospace font
6. THE Certificate_Generator SHALL display the registration timestamp in readable format with time (e.g., "March 1, 2026 at 2:30 PM")
7. THE Certificate_Generator SHALL style the certificate with:
   - Serif fonts (Times/Georgia) for formal appearance
   - Gold accents (#D4AF37) for borders and decorative elements
   - Deep blue (#1E3A5F) for headings and official elements
   - Cream/off-white backgrounds for sections
   - Official seal with checkmark at the top
   - Decorative borders and left-border accents
   - Government-document aesthetic for trust and authority

### Requirement 6: Certificate Download

**User Story:** As a property owner, I want to download my certificate as a PDF, so that I can print it or share it offline.

#### Acceptance Criteria

1. THE Certificate_Generator SHALL display a download button on the certificate page
2. WHEN the user clicks the download button, THE Certificate_Generator SHALL generate a PDF containing all certificate information using jsPDF
3. THE Certificate_Generator SHALL mirror the web certificate styling in the PDF including serif fonts, gold accents, and official formatting
4. THE Certificate_Generator SHALL format dates in the PDF using readable format (e.g., "March 1, 2026")
5. THE Certificate_Generator SHALL include dynamic property address labels in the PDF based on document type
6. THE Certificate_Generator SHALL initiate a browser download of the generated PDF file

### Requirement 7: Certificate Navigation

**User Story:** As a property owner, I want to access the verification page from my certificate, so that I can verify my document later.

#### Acceptance Criteria

1. THE Certificate_Generator SHALL display a button that navigates to the verification page for the current document

### Requirement 8: Verification Interface

**User Story:** As a property owner or third party, I want to verify a document against its registered fingerprint, so that I can confirm the document has not been altered.

#### Acceptance Criteria

1. THE Verification_Engine SHALL display the stored Document_Fingerprint from the Document_Registry
2. THE Verification_Engine SHALL display a file input for uploading a Property_Document to verify
3. WHEN the user uploads a file, THE Verification_Engine SHALL compute the SHA-256 hash of the uploaded file using the Web Crypto API

### Requirement 9: Verification Result Display

**User Story:** As a property owner or third party, I want to see a clear indication of whether a document matches its registration, so that I can trust or reject the document.

#### Acceptance Criteria

1. WHEN the computed hash matches the stored Document_Fingerprint, THE Verification_Engine SHALL display a green checkmark indicator
2. WHEN the computed hash does not match the stored Document_Fingerprint, THE Verification_Engine SHALL display a red warning indicator
3. THE Verification_Engine SHALL display both the stored fingerprint and the computed fingerprint for comparison

### Requirement 10: Database Schema Implementation

**User Story:** As a system administrator, I want document records stored with all necessary fields, so that the system can retrieve and display complete information.

#### Acceptance Criteria

1. THE Document_Registry SHALL store a unique identifier as the primary key using UUID format
2. THE Document_Registry SHALL store owner name as text
3. THE Document_Registry SHALL store property address as text
4. THE Document_Registry SHALL store document type as text
5. THE Document_Registry SHALL store document date as text
6. THE Document_Registry SHALL store the Document_Fingerprint as text
7. THE Document_Registry SHALL store the file URL as text
8. THE Document_Registry SHALL store the registration timestamp with timezone information
9. WHEN a new record is created, THE Document_Registry SHALL automatically generate the unique identifier
10. WHEN a new record is created, THE Document_Registry SHALL automatically set the registration timestamp to the current time

### Requirement 11: Date and Label Formatting

**User Story:** As a user, I want dates displayed in readable format and labels that match my document type, so that the interface is clear and contextual.

#### Acceptance Criteria

1. THE EXTATE_System SHALL format all document dates as "Month Day, Year" (e.g., "March 1, 2026") instead of ISO format
2. THE EXTATE_System SHALL format all registration timestamps as "Month Day, Year at Hour:Minute AM/PM" (e.g., "March 1, 2026 at 2:30 PM")
3. THE EXTATE_System SHALL provide a utility function `formatDate()` for date formatting
4. THE EXTATE_System SHALL provide a utility function `formatTimestamp()` for timestamp formatting
5. THE EXTATE_System SHALL provide a utility function `getPropertyAddressLabel()` that returns contextual labels based on document type
6. THE EXTATE_System SHALL apply consistent date formatting across all pages (landing, upload, certificate, verification)
7. THE EXTATE_System SHALL apply consistent date formatting in both web views and PDF downloads
