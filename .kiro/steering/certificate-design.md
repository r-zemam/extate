---
inclusion: fileMatch
fileMatchPattern: "app/certificate/**,app/verify/**,lib/pdf-generator.ts"
---

# Certificate Design System

## Purpose

The certificate is the emotional core of EXTATE. It must look like something a family would print, frame, and keep in a safe — not a generic web UI. Every design decision on the certificate page and PDF should reinforce trust, permanence, and official authority.

Reference: birth certificate, marriage license, property deed, university diploma.

## Custom Tailwind Color Tokens

These are defined in `tailwind.config.ts` and must be used consistently across the web certificate and PDF generator. Never substitute generic Tailwind colors on the certificate page.

| Token | Hex | Usage |
|-------|-----|-------|
| `certificate-gold` | `#D4AF37` | Borders, decorative accents, seal ring, section dividers |
| `certificate-deep-blue` | `#1E3A5F` | Headings, official text, seal background, buttons |
| `certificate-cream` | `#F5F5DC` | Section backgrounds (owner info, document details) |
| `certificate-off-white` | `#FAF9F6` | Certificate body background |
| `certificate-dark-text` | `#2C2C2C` | Body text, fingerprint display background |
| `certificate-bronze` | `#8B6914` | Registration details left-border accent |
| `certificate-forest-green` | `#2D5016` | "Verify This Document" button |

## Typography Rules

- Use `font-serif` (Tailwind) for all certificate text — this maps to Times New Roman / Georgia
- Use `font-mono` for the SHA-256 fingerprint display
- Section headers: `uppercase tracking-wide text-sm font-bold text-certificate-deep-blue`
- Owner name: `text-xl font-semibold font-serif`
- Body text: `font-serif text-base text-certificate-dark-text`
- Never use sans-serif fonts inside the certificate border

## Layout Rules

- Certificate is wrapped in `border-8 border-certificate-gold rounded-lg`
- Top and bottom decorative bars: `h-2 bg-gradient-to-r from-certificate-deep-blue via-certificate-gold to-certificate-deep-blue`
- Official seal: `w-24 h-24 rounded-full border-4 border-certificate-gold bg-certificate-deep-blue`
- Section grouping: `border-l-4 border-certificate-gold` for primary sections, `border-l-4 border-certificate-bronze` for registration details
- Fingerprint box: `border-2 border-certificate-gold` with dark background (`bg-certificate-dark-text`) and gold text (`text-certificate-gold`)

## Certificate ID Format

Always display the certificate ID as `EXTATE-XXXX-XXXX`, never as a raw UUID.

```typescript
function formatCertificateId(id: string): string {
  const clean = id.replace(/-/g, '').toUpperCase();
  return `EXTATE-${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}
```

## Interactive Elements on Certificate Page

- **Copy fingerprint**: Button with clipboard SVG icon, shows "Copied ✓" for 2 seconds after click
- **Share Verify Link**: Uses `navigator.share` on mobile, falls back to `navigator.clipboard.writeText` on desktop
- **Download PDF**: Calls `generateCertificatePDF()` from `lib/pdf-generator.ts`
- **Verify This Document**: Links to `/verify/[id]` using `certificate-forest-green` background

## PDF Generator Rules

The PDF (`lib/pdf-generator.ts`) must mirror the web certificate as closely as jsPDF allows:
- Use `times` font family (jsPDF built-in serif)
- Replicate the color palette using hex values directly
- Include all fields: owner name, property address (with dynamic label), document type, document date (formatted), fingerprint, registration timestamp (formatted), certificate ID (EXTATE-XXXX-XXXX format)
- Filename: `EXTATE_Certificate_[owner_name]_[id].pdf`
- Use `formatDate()`, `formatTimestamp()`, and `getPropertyAddressLabel()` from `lib/formatting.ts`

## What NOT to Do

- Do not use `bg-blue-600` or other generic Tailwind colors inside the certificate border
- Do not use sans-serif fonts for certificate content
- Do not display raw UUIDs as the certificate ID
- Do not display ISO date strings — always use `formatDate()` / `formatTimestamp()`
- Do not make the certificate look like a web app card or dashboard widget
