# EXTATE — Property Document Protection Platform

> *Because a paper deed shouldn't be the only thing standing between a family and their home.*

EXTATE gives families a permanent, cryptographic backup of their property ownership documents. Upload any document, receive a tamper-evident verification certificate, and prove authenticity forever — no account required.

---

## The Problem

Property fraud and title disputes aren't just a developing-world problem. In the United States and Europe, forged deeds, title fraud, and ownership disputes cost families thousands in legal fees and years of stress — even in countries with sophisticated land registries. A forged signature on a transfer document. A fraudulent lien filed against a property. A disputed inheritance where the original deed has been altered. These cases happen everywhere.

In the developing world, the problem is compounded by weak infrastructure. Property ownership often exists on a single piece of paper with no digital backup, no redundant registry, and no recourse when that paper is gone. Families face:

- Informal land ownership with no formal registry backing
- Documents destroyed by floods, earthquakes, or fires with no recovery path
- Officials who question title when the original deed cannot be produced
- Displacement where returnees find someone else claiming their property
- Inheritance disputes when the original owner dies and deeds disappear
- Outright forgery — altered documents that are impossible to disprove without the original

EXTATE doesn't replace the legal system. It creates a permanent, independently verifiable record that a specific document existed in an exact state, who owned it, and when — evidence that survives anything and can expose forgery instantly.

---

## Who This Is For

- A family whose only proof of ownership is a paper deed stored at home in a flood-prone area
- A homeowner in any country who wants tamper-evident proof their deed hasn't been altered
- Someone whose local land registry was destroyed or corrupted and records no longer exist
- A displaced family trying to reclaim their property after returning from refuge
- Anyone dealing with an inheritance dispute where document authenticity is questioned

---

## How It Works

1. **Upload** — Select your property document (PDF, JPG, or PNG)
2. **Fingerprint** — SHA-256 hash is computed entirely in your browser. Your document never leaves your device unencrypted.
3. **Store** — The fingerprint, owner details, and timestamp are stored permanently in the database
4. **Certificate** — Receive an official verification certificate you can download as a PDF
5. **Verify** — Anyone can re-upload the document at any time to confirm it matches the original fingerprint. Any alteration — even a single character — produces a completely different hash, exposing the forgery immediately.

---

## What is SHA-256?

SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic function that takes any file as input and produces a fixed 64-character string called a hash or fingerprint. It has two critical properties for document protection:

**Deterministic** — the same file always produces the exact same hash. Upload your deed today and in ten years, the hash will be identical.

**Avalanche effect** — change even a single pixel or character in the document and the hash changes completely and unpredictably. There is no way to forge a document that produces the same hash as the original. This is mathematically guaranteed.

EXTATE uses the browser-native Web Crypto API to compute `SHA-256` entirely client-side:
```typescript
const arrayBuffer = await file.arrayBuffer();
const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const fingerprint = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
```

The server never sees the document — only the 64-character fingerprint. This is the core privacy and trust guarantee of the system.

---

## Features

- Client-side SHA-256 cryptographic hashing via Web Crypto API — document never leaves the browser unencrypted
- Official certificate design (government document aesthetic — serif fonts, gold border, cream background)
- PDF certificate download mirroring the web certificate layout exactly
- Document verification with side-by-side fingerprint comparison
- Dynamic form labels based on document type
- No account or login required — the fingerprint is the proof, not the account
- Mobile responsive, mobile-first design
- TypeScript strict mode throughout

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | ^14.2.0 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS | ^3 |
| Database | Supabase PostgreSQL | — |
| File Storage | Supabase Storage | — |
| Supabase Client | @supabase/supabase-js | ^2.39.0 |
| Cryptography | Web Crypto API (browser-native) | — |
| PDF Generation | jsPDF | ^2.5.1 |
| UI Library | React | ^18.3.1 |
| Testing | Jest + React Testing Library | — |

---

## Design Decisions

**Next.js 14 App Router over Pages Router**
File-based routing under `app/`, server components by default, and server actions via `'use server'` for all database calls. No separate API routes needed — actions live in `lib/actions.ts` and are called directly from client components. This keeps the architecture flat and simple.

**Why client-side hashing?**
Privacy. The document file is hashed entirely in the browser using `crypto.subtle.digest('SHA-256', arrayBuffer)`. Only the 64-character hex fingerprint is sent to the server — never the file contents. A family uploading sensitive ownership documents doesn't have to trust EXTATE with the document itself, only with the proof that it exists.

**Why Supabase over Firebase or raw AWS RDS?**
Supabase provides managed PostgreSQL with row-level security, built-in file storage, and a generous free tier — without the operational overhead of managing infrastructure. RLS policies allow public read and insert with no auth required, which matches the no-account design goal. The anon key is safe to expose client-side because RLS enforces access control at the database level.

**Why no authentication?**
Deliberate. Requiring an account creates a barrier for families in low-connectivity environments who may not have reliable email access. The fingerprint itself is the proof. Anyone with a certificate ID can verify a document.

**UUID file naming in storage**
Files are stored with `crypto.randomUUID()` + original extension. UUID naming prevents directory enumeration — you can't guess other users' file URLs by incrementing an ID.

**Why no blockchain for v1?**
Complexity vs. timeline trade-off. SHA-256 + Supabase timestamp demonstrates the tamper-evidence concept cleanly. Blockchain anchoring (Ethereum or Polygon) is the natural v2 enhancement for fully trustless verification — but it adds wallet complexity and gas fees that create new barriers for the target users.

---

## Kiro Usage

This project was built entirely with spec-driven development in Kiro — not vibe coding.

**Spec-Driven Development**
Before writing a single line of code, I used Kiro's Spec mode to turn a rough idea into 18 concrete requirements, a full design document with TypeScript interfaces, and a 15-task implementation plan with checkpoints. The difference compared to vibe coding was immediate: error states, mobile responsiveness, validation logic, and edge cases were all planned before implementation started. Nothing was discovered mid-build.

The spec iteration process caught requirements I would have missed — like dynamic property address labels based on document type, the distinction between a missing-selection validation error (amber, not red) versus an actual input error, and the need for retry buttons on every error state.

**Steering Files**
Three steering files in `.kiro/steering/` guided every component Kiro generated:
- `tech-stack.md` — enforced Next.js App Router patterns, server actions, flat component structure
- `project-context.md` — kept the emotional mission (trust, permanence, accessibility) present in every design decision
- `coding-standards.md` — TypeScript strict mode, user-friendly error messages, mobile-first, no console.logs, date formatting standards

With steering files in place, Kiro understood the constraints before each prompt. This eliminated most back-and-forth and produced components that fit the codebase on the first pass.

**Agent Hooks**
Two agent hooks in `.kiro/hooks/` automated repetitive tasks:
- `auto-docs` — triggered on every `.ts` and `.tsx` file save, automatically added JSDoc comments to exported functions missing documentation
- `test-reminder` — triggered on new page or component creation, reminded me to add a corresponding test file

The auto-docs hook was the most impactful. Documentation stayed current throughout development without it ever being a separate task.

**GitHub MCP Integration**
Connected the GitHub MCP server to allow Kiro to review repository state, check commit history, and suggest missing features directly from within the IDE without switching context.

**Best Code Generation Moment**
The certificate page. Because `project-context.md` described the design values — trust, permanence, official document aesthetic — before any code was written, Kiro generated the full government-document design (gold border, serif fonts, cream background, official seal) in a single pass. It understood *why* the certificate needed to look authoritative, not just *what* to build.

---

## Project Structure
```
.
├── app/
│   ├── page.tsx                  # Landing page
│   ├── upload/                   # Document upload + metadata form
│   ├── certificate/[id]/         # Certificate display + PDF download
│   └── verify/[id]/              # Document re-upload + fingerprint comparison
├── lib/
│   ├── crypto.ts                 # SHA-256 hashing, typed error classes
│   ├── validation.ts             # File and form validation, FormValidationResult
│   ├── formatting.ts             # formatDate(), formatTimestamp(), getPropertyAddressLabel()
│   ├── actions.ts                # uploadDocument() and getDocument() server actions
│   ├── supabase.ts               # Supabase client with env var validation
│   ├── error-logger.ts           # Structured error logging (dev-only)
│   └── pdf-generator.ts          # jsPDF certificate generation
├── components/                   # Shared React components
├── __tests__/                    # Jest + React Testing Library tests
└── .kiro/
    ├── specs/                    # Requirements, design, task list
    ├── steering/                 # tech-stack.md, project-context.md, coding-standards.md
    └── hooks/                    # auto-docs, test-reminder
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- Supabase account and project

### Installation
```bash
git clone https://github.com/r-zemam/extate.git
cd extate
npm install
```

### Environment Variables

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

1. Go to your Supabase project → SQL Editor
2. Run `supabase/migrations/001_create_documents_table.sql`
3. Create a storage bucket named `documents` set to public access
4. Apply storage policies from `supabase/storage-policies.sql`

### Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test
```bash
npm test -- --watchAll=false
```

---

## Learning Journey

**Biggest challenge:** Supabase environment variables. The key format changed between versions and caused silent authentication failures for two hours. Fixed by reading raw values directly from the Supabase dashboard instead of copying from outdated examples.

**Second challenge:** Storage RLS policies. Making the bucket public is not sufficient — public INSERT requires an explicit RLS policy separate from the bucket access setting. This wasn't obvious from the documentation.

**Working with Kiro's spec-driven development** was genuinely different from how I normally build. The process of iterating on requirements before writing any code felt slow at first — I wanted to just start building. But going back and forth with Kiro on the spec forced me to think through decisions I would have made mid-build and gotten wrong. The design document phase in particular was valuable: Kiro surfaced TypeScript interface structures and error handling patterns I hadn't planned, and walking through them before implementation meant I understood *why* the code was structured the way it was, not just that it worked.

The steering files were a learning moment too. I'd never thought about giving an AI assistant persistent context across a project before. Once the three steering files were in place, the quality of Kiro's output noticeably improved — it stopped making suggestions that conflicted with the stack or the design philosophy because it already knew both.

The biggest Kiro learning curve was understanding the difference between vibe mode and spec mode. Vibe mode is fast but you lose the thread. Spec mode feels slower upfront but the payoff is that you end up with a codebase you actually understand, not just one that runs. For a project involving cryptography and database security, that distinction mattered.

**What I'd do differently:** Deploy to Vercel on day one. Testing only locally meant some environment-specific issues appeared late. Production parity from the start would have saved time. I'd also write the steering files before the first spec prompt rather than after — the earlier Kiro has that context, the better the requirements document comes out.

**Skills gained:** Kiro spec-driven workflow, Supabase RLS policies, Web Crypto API, jsPDF, Next.js App Router server actions, and a much clearer mental model of how cryptographic hashing works in practice.

---

## Future Enhancements

- **Blockchain anchoring** — Anchor fingerprints to Ethereum or Polygon for trustless verification without relying on EXTATE's database
- **Multi-language support** — Arabic, Spanish, French, and Swahili for primary target communities
- **Offline PDF certificate** — Works without internet access for low-connectivity environments
- **QR code verification** — QR code on the certificate linking directly to the verify page
- **Private storage** — Signed URL access instead of public bucket for production deployments
- **Batch registration** — Register multiple documents in a single session

---

## License

Built for educational and humanitarian purposes. Free to use, adapt, and deploy for non-commercial community benefit.
