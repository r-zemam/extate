# Storage Bucket Quick Start Guide

This is a condensed guide for setting up the Supabase storage bucket. For detailed instructions, see `TASK_2.2_INSTRUCTIONS.md`.

## Prerequisites

- ✅ Supabase project created
- ✅ Supabase credentials in `.env.local`
- ✅ Database table created (Task 2.1)

## Step 1: Create Bucket (2 minutes)

1. Open Supabase dashboard → **Storage**
2. Click **"New bucket"**
3. Settings:
   - Name: `documents`
   - Public: **ON** ✅
4. Click **"Create bucket"**

## Step 2: Apply Policies (1 minute)

### Option A: Use Helper Script (Easiest)

```bash
bash supabase/apply-storage-policies.sh
```

### Option B: Manual (SQL Editor)

1. Go to **SQL Editor**
2. Copy contents of `supabase/storage-policies.sql`
3. Paste and click **"Run"**

## Step 3: Verify (30 seconds)

1. Go to **Storage** → `documents` bucket
2. Upload a test file
3. Click the file → Copy public URL
4. Open URL in new tab → File should be accessible ✅

## Done! 🎉

Your storage bucket is ready. The application can now:
- Upload documents (PDF, JPEG, PNG)
- Store files up to 10MB
- Generate public URLs for certificates

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bucket already exists | Skip Step 1, proceed to Step 2 |
| Upload fails | Check bucket is set to **public** |
| URL not accessible | Verify download policy is applied |
| File too large | Ensure file is under 10MB |

## Next Steps

- ✅ Storage bucket configured
- 📝 Proceed to Task 3: Implement cryptographic utilities
- 📖 See `STORAGE.md` for detailed documentation

## Quick Links

- **Detailed Instructions**: `TASK_2.2_INSTRUCTIONS.md`
- **Storage Documentation**: `STORAGE.md`
- **SQL Policies**: `storage-policies.sql`
- **Helper Script**: `apply-storage-policies.sh`
