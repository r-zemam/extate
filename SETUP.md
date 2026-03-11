# EXTATE Setup Guide

This guide will walk you through setting up the EXTATE Document Protection platform.

## Step 1: Install Node.js

If you don't have Node.js installed, download and install it from:
- **Official Website**: https://nodejs.org/ (download LTS version)
- **Recommended Version**: Node.js 18.x or higher

To verify installation, run:
```bash
node --version
npm --version
```

## Step 2: Install Project Dependencies

Navigate to the project directory and run:
```bash
npm install
```

This will install all required dependencies:
- Next.js 14 (React framework with App Router)
- React 18 (UI library)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Supabase client (database and storage)
- jsPDF (PDF generation)

## Step 3: Create Supabase Project

1. Go to https://supabase.com and sign up for a free account
2. Create a new project
3. Wait for the project to be provisioned (takes 1-2 minutes)
4. Note down your project URL and anon key from the API settings

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 5: Set Up Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_date TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster verification lookups
CREATE INDEX idx_documents_fingerprint ON documents(fingerprint);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON documents
  FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON documents
  FOR INSERT WITH CHECK (true);
```

5. Click "Run" to execute the SQL

## Step 6: Set Up Storage

Create a storage bucket for document uploads.

**Quick Setup:**

1. In your Supabase dashboard, click on "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Enter bucket name: `documents`
4. Set "Public bucket" to **ON** (important!)
5. Click "Create bucket"

**Configure Storage Policies:**

Run the helper script:
```bash
bash supabase/apply-storage-policies.sh
```

Or manually apply policies via SQL Editor (see `supabase/storage-policies.sql`).

**For detailed instructions, see:**
- `supabase/TASK_2.2_INSTRUCTIONS.md` - Complete setup guide
- `supabase/STORAGE.md` - Storage configuration documentation
- `supabase/storage-policies.sql` - SQL policies reference

## Step 7: Run the Development Server

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the EXTATE landing page!

## Step 8: Verify Setup

To verify everything is working:

1. Check that the landing page loads without errors
2. Open browser console (F12) and check for any error messages
3. Verify that environment variables are loaded (no "undefined" errors)

## Troubleshooting

### "Module not found" errors
Run `npm install` again to ensure all dependencies are installed.

### Supabase connection errors
- Verify your `.env.local` file has the correct credentials
- Make sure the environment variables start with `NEXT_PUBLIC_`
- Restart the development server after changing environment variables

### Port 3000 already in use
Run the server on a different port:
```bash
npm run dev -- -p 3001
```

### TypeScript errors
Make sure TypeScript is installed:
```bash
npm install --save-dev typescript @types/node @types/react @types/react-dom
```

## Next Steps

Once setup is complete, you can proceed with implementing the features:
1. Landing page with service explanation
2. Document upload form
3. Certificate generation and display
4. Document verification interface

Refer to the design document in `.kiro/specs/extate-document-protection/design.md` for detailed implementation guidance.

## Support

For issues or questions:
- Check the README.md for general information
- Review the design document for architecture details
- Check Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
