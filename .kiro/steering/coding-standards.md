# EXTATE Coding Standards

## TypeScript

### Strict Mode
- TypeScript strict mode is enabled
- No `any` types unless absolutely necessary
- All function parameters and return types must be explicitly typed
- Use interfaces for object shapes

### Type Safety
```typescript
// ✅ Good
interface DocumentRecord {
  id: string;
  owner_name: string;
  property_address: string;
  document_type: string;
  document_date: string;
  fingerprint: string;
  file_url: string;
  created_at: string;
}

function getDocument(id: string): Promise<DocumentRecord> {
  // ...
}

// ❌ Bad
function getDocument(id: any): Promise<any> {
  // ...
}
```

## Error Handling

### User-Friendly Messages
- All errors must show user-friendly messages
- Never expose technical error details to users
- Always provide context about what went wrong
- Always provide retry options or next steps

```typescript
// ✅ Good
try {
  await uploadDocument(formData, fingerprint);
} catch (error) {
  setError('Failed to upload document. Please check your connection and try again.');
  setShowRetry(true);
}

// ❌ Bad
try {
  await uploadDocument(formData, fingerprint);
} catch (error) {
  setError(error.message); // May expose technical details
}
```

### Error Message Guidelines
- Use simple, clear language
- Explain what happened in user terms
- Suggest a solution or next step
- Avoid technical jargon (no "500 error", "null pointer", etc.)

Examples:
- ✅ "Failed to upload document. Please check your connection and try again."
- ✅ "Document not found. Please check the certificate ID and try again."
- ❌ "Error: ECONNREFUSED"
- ❌ "Uncaught TypeError: Cannot read property 'id' of undefined"

## Mobile Responsiveness

### Required for All Pages
- Every page must be fully responsive
- Test on mobile viewport (375px width minimum)
- Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`)
- Touch targets must be at least 44x44px

```typescript
// ✅ Good - Responsive button
<button className="px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl">
  Register Document
</button>

// ❌ Bad - Fixed sizing
<button className="px-4 py-2 text-sm">
  Register Document
</button>
```

### Mobile-First Approach
- Design for mobile first, then enhance for desktop
- Use `min-width` media queries (Tailwind's `sm:`, `md:`, etc.)
- Ensure text is readable without zooming
- Ensure buttons are easily tappable

## Code Quality

### No Console Logs in Production
- Remove all `console.log()` statements before committing
- Use proper error logging utilities instead
- For debugging, use conditional logging based on environment

```typescript
// ✅ Good
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Or use error logger
logError(error, context);

// ❌ Bad
console.log('User data:', userData);
```

### Clean Code Principles
- Functions should do one thing
- Keep functions small and focused
- Use descriptive variable names
- Avoid deep nesting (max 3 levels)
- Extract complex logic into separate functions

## Date Formatting

### Always Use Readable Format
- Format dates as "Month Day, Year" (e.g., "March 1, 2026")
- Never show ISO format dates to users (no "2026-03-01")
- Use the `formatDate()` and `formatTimestamp()` utilities from `lib/formatting.ts`

```typescript
// ✅ Good
import { formatDate, formatTimestamp } from '@/lib/formatting';

<p>Document Date: {formatDate(document.document_date)}</p>
<p>Registered: {formatTimestamp(document.created_at)}</p>

// ❌ Bad
<p>Document Date: {document.document_date}</p> // Shows "2026-03-01"
<p>Registered: {document.created_at}</p> // Shows ISO timestamp
```

## Component Structure

### Client vs Server Components
- Use server components by default
- Only use `'use client'` when you need:
  - State (`useState`, `useReducer`)
  - Effects (`useEffect`)
  - Event handlers
  - Browser APIs

```typescript
// ✅ Good - Server component (default)
export default function CertificatePage({ params }: { params: { id: string } }) {
  const document = await getDocument(params.id);
  return <div>{document.owner_name}</div>;
}

// ✅ Good - Client component (when needed)
'use client';
export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  // ...
}
```

### Props and Interfaces
- Always define prop types with interfaces
- Use descriptive prop names
- Document complex props with JSDoc comments

```typescript
interface CertificateProps {
  params: {
    id: string;
  };
}

export default function CertificatePage({ params }: CertificateProps) {
  // ...
}
```

## File Naming

- Use kebab-case for files: `pdf-generator.ts`, `error-logger.ts`
- Use PascalCase for React components: `BrowserCompatibilityWarning.tsx`
- Test files: `[filename].test.ts` or `[filename].test.tsx`
- Place tests in `__tests__` directory next to source files

## Comments and Documentation

### JSDoc Comments
- Add JSDoc comments to all exported functions
- Include parameter descriptions
- Include return type descriptions
- Include usage examples for complex functions

```typescript
/**
 * Generate a PDF certificate for a document record
 * 
 * @param document - The document record to generate a certificate for
 * @throws {Error} If PDF generation fails
 * 
 * @example
 * ```typescript
 * generateCertificatePDF(documentRecord);
 * ```
 */
export function generateCertificatePDF(document: DocumentRecord): void {
  // ...
}
```

### Inline Comments
- Use comments to explain "why", not "what"
- Avoid obvious comments
- Use comments for complex logic or non-obvious decisions

```typescript
// ✅ Good - Explains why
// Generate unique filename with UUID to prevent collisions and enhance security
const fileName = `${crypto.randomUUID()}.${fileExtension}`;

// ❌ Bad - States the obvious
// Set the file name
const fileName = `${crypto.randomUUID()}.${fileExtension}`;
```

## Testing

### Test Coverage
- All utility functions should have tests
- All server actions should have tests
- All pages should have basic rendering tests
- Test error cases, not just happy paths

### Test File Location
```
lib/
  actions.ts
  __tests__/
    actions.test.ts
app/
  upload/
    page.tsx
    __tests__/
      page.test.tsx
```

## Accessibility

### Basic Requirements
- All images must have alt text
- All form inputs must have labels
- Use semantic HTML elements
- Ensure keyboard navigation works
- Maintain sufficient color contrast

```typescript
// ✅ Good
<label htmlFor="ownerName" className="block mb-2">
  Property Owner Name
</label>
<input
  id="ownerName"
  type="text"
  name="ownerName"
  required
  className="w-full px-4 py-2"
/>

// ❌ Bad
<div>Name</div>
<input type="text" name="ownerName" />
```

## Performance

### Optimization Guidelines
- Use Next.js Image component for images
- Lazy load components when appropriate
- Minimize client-side JavaScript
- Use server components for static content
- Avoid unnecessary re-renders

## Security

### Best Practices
- Never expose sensitive data in client code
- Validate all user inputs
- Use environment variables for secrets
- Sanitize user-generated content
- Use HTTPS in production

### Environment Variables
```typescript
// ✅ Good - Server-side only
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ❌ Bad - Hardcoded credentials
const supabaseUrl = 'https://myproject.supabase.co';
```

## Git Commit Messages

- Use clear, descriptive commit messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Reference issue numbers when applicable
- Keep first line under 72 characters

Examples:
- ✅ "Add date formatting utilities for certificate display"
- ✅ "Fix mobile responsiveness on upload page"
- ❌ "updates"
- ❌ "fixed stuff"
