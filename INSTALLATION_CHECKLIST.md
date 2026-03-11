# EXTATE Installation Checklist

Use this checklist to verify that your EXTATE project is properly set up.

## Prerequisites Checklist

- [ ] Node.js 18.x or higher installed
  - Run: `node --version`
  - Expected: v18.x.x or higher

- [ ] npm package manager installed
  - Run: `npm --version`
  - Expected: 9.x.x or higher

- [ ] Supabase account created
  - Visit: https://supabase.com

## Installation Steps

### Step 1: Install Dependencies
- [ ] Run `npm install` in project directory
- [ ] Verify no error messages appear
- [ ] Check that `node_modules/` directory is created

### Step 2: Environment Configuration
- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set with your project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set with your anon key
- [ ] No placeholder values remain (no "your-supabase-project-url")

### Step 3: Supabase Database Setup
- [ ] Supabase project created and active
- [ ] SQL query executed to create `documents` table
- [ ] Table has all required columns:
  - [ ] id (UUID, primary key)
  - [ ] owner_name (TEXT)
  - [ ] property_address (TEXT)
  - [ ] document_type (TEXT)
  - [ ] document_date (TEXT)
  - [ ] fingerprint (TEXT)
  - [ ] file_url (TEXT)
  - [ ] created_at (TIMESTAMPTZ)
- [ ] Index created on `fingerprint` column

### Step 4: Supabase Storage Setup
- [ ] Storage bucket named `documents` created
- [ ] Bucket set to **public** access
- [ ] Storage policies configured:
  - [ ] Public upload policy created
  - [ ] Public download policy created
- [ ] Test file upload successful
- [ ] Public URL accessible without authentication
- [ ] File size limit configured (10MB)
- [ ] MIME type validation working (PDF, JPEG, PNG only)

### Step 5: Development Server
- [ ] Run `npm run dev` successfully
- [ ] Server starts without errors
- [ ] Server running on http://localhost:3000
- [ ] No TypeScript compilation errors

### Step 6: Browser Verification
- [ ] Open http://localhost:3000 in browser
- [ ] Landing page loads successfully
- [ ] No console errors in browser DevTools (F12)
- [ ] Page displays "EXTATE" heading

## File Structure Verification

Verify these files exist:

### Configuration Files
- [ ] `package.json` - Dependencies and scripts
- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `next.config.js` - Next.js configuration
- [ ] `tailwind.config.ts` - Tailwind CSS configuration
- [ ] `postcss.config.js` - PostCSS configuration
- [ ] `.eslintrc.json` - ESLint configuration
- [ ] `.gitignore` - Git ignore rules

### Environment Files
- [ ] `.env.local` - Environment variables (with your credentials)
- [ ] `.env.example` - Environment template

### Application Files
- [ ] `app/layout.tsx` - Root layout
- [ ] `app/page.tsx` - Landing page
- [ ] `app/globals.css` - Global styles
- [ ] `app/upload/page.tsx` - Upload page
- [ ] `app/certificate/[id]/page.tsx` - Certificate page
- [ ] `app/verify/[id]/page.tsx` - Verification page

### Library Files
- [ ] `lib/supabase.ts` - Supabase client

### Documentation Files
- [ ] `README.md` - Project documentation
- [ ] `SETUP.md` - Setup instructions
- [ ] `PROJECT_STRUCTURE.md` - Structure documentation
- [ ] `INSTALLATION_CHECKLIST.md` - This file

## Dependency Verification

Verify these packages are installed (check `node_modules/`):

### Core Dependencies
- [ ] `next` (v14.x)
- [ ] `react` (v18.x)
- [ ] `react-dom` (v18.x)
- [ ] `@supabase/supabase-js` (v2.x)
- [ ] `jspdf` (v2.x)

### Dev Dependencies
- [ ] `typescript` (v5.x)
- [ ] `@types/node`
- [ ] `@types/react`
- [ ] `@types/react-dom`
- [ ] `tailwindcss` (v3.x)
- [ ] `autoprefixer`
- [ ] `postcss`
- [ ] `eslint`
- [ ] `eslint-config-next`

## Troubleshooting

If any checklist item fails, refer to these resources:

### Node.js Not Installed
- Download from: https://nodejs.org/
- Install LTS version (18.x or higher)
- Restart terminal after installation

### npm install Fails
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again
- Check internet connection
- Try `npm cache clean --force`

### Environment Variables Not Working
- Ensure file is named `.env.local` (not `.env`)
- Restart development server after changes
- Verify variables start with `NEXT_PUBLIC_`
- Check for typos in variable names

### Supabase Connection Errors
- Verify credentials in Supabase dashboard
- Check project is active (not paused)
- Ensure URL includes `https://`
- Verify anon key is correct (not service role key)

### TypeScript Errors
- Run `npm install` to ensure types are installed
- Check `tsconfig.json` exists
- Restart VS Code or IDE
- Run `npx tsc --noEmit` to check for errors

### Port 3000 Already in Use
- Stop other processes using port 3000
- Or run on different port: `npm run dev -- -p 3001`

## Success Criteria

Your installation is complete when:

✅ All checklist items are checked
✅ Development server runs without errors
✅ Landing page loads in browser
✅ No console errors in browser DevTools
✅ Supabase connection is configured
✅ All dependencies are installed

## Next Steps

Once installation is verified:

1. Review the design document: `.kiro/specs/extate-document-protection/design.md`
2. Review the requirements: `.kiro/specs/extate-document-protection/requirements.md`
3. Check the task list: `.kiro/specs/extate-document-protection/tasks.md`
4. Begin implementing Task 2: Landing Page Display

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **jsPDF Docs**: https://github.com/parallax/jsPDF

---

**Installation Date**: _____________

**Verified By**: _____________

**Notes**: _____________________________________________
