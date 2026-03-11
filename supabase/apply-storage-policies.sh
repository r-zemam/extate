#!/bin/bash

# ============================================================================
# EXTATE Document Protection Platform
# Storage Policies Application Script
# ============================================================================
#
# This script helps you apply storage policies to your Supabase project.
#
# Prerequisites:
# - Supabase project created
# - Storage bucket 'documents' created via dashboard
# - Bucket set to public access
#
# Usage:
#   bash supabase/apply-storage-policies.sh
#
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
    echo -e "${BLUE}============================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Main script
clear
print_header "EXTATE Storage Policies Setup"

echo ""
print_info "This script will guide you through applying storage policies to your Supabase project."
echo ""

# Check if storage-policies.sql exists
if [ ! -f "supabase/storage-policies.sql" ]; then
    print_error "storage-policies.sql not found in supabase/ directory"
    exit 1
fi

print_success "Found storage-policies.sql"
echo ""

# Instructions
print_header "Prerequisites Checklist"
echo ""
echo "Before proceeding, ensure you have:"
echo "  1. Created a Supabase project"
echo "  2. Created a storage bucket named 'documents'"
echo "  3. Set the bucket to PUBLIC access"
echo "  4. Have access to the Supabase SQL Editor"
echo ""

read -p "Have you completed all prerequisites? (y/n): " prerequisites
if [[ ! $prerequisites =~ ^[Yy]$ ]]; then
    echo ""
    print_warning "Please complete the prerequisites first."
    print_info "See supabase/TASK_2.2_INSTRUCTIONS.md for detailed instructions."
    exit 0
fi

echo ""
print_header "Application Methods"
echo ""
echo "You can apply the storage policies using one of these methods:"
echo ""
echo "  1. Supabase Dashboard (Recommended)"
echo "  2. Supabase CLI"
echo "  3. Manual SQL execution"
echo ""

read -p "Which method would you like to use? (1/2/3): " method

case $method in
    1)
        echo ""
        print_header "Method 1: Supabase Dashboard"
        echo ""
        print_info "Follow these steps:"
        echo ""
        echo "  1. Open your Supabase project dashboard"
        echo "  2. Navigate to SQL Editor (left sidebar)"
        echo "  3. Click 'New Query'"
        echo "  4. Copy the contents of supabase/storage-policies.sql"
        echo "  5. Paste into the SQL Editor"
        echo "  6. Click 'Run' to execute"
        echo ""
        
        read -p "Press Enter to open the SQL file in your default editor..."
        
        # Try to open the file in the default editor
        if command -v open &> /dev/null; then
            open supabase/storage-policies.sql
        elif command -v xdg-open &> /dev/null; then
            xdg-open supabase/storage-policies.sql
        else
            print_warning "Could not open file automatically. Please open supabase/storage-policies.sql manually."
        fi
        
        echo ""
        print_info "The SQL file should now be open in your editor."
        print_info "Copy its contents and paste into the Supabase SQL Editor."
        echo ""
        
        read -p "Press Enter when you have applied the policies..."
        ;;
        
    2)
        echo ""
        print_header "Method 2: Supabase CLI"
        echo ""
        
        # Check if Supabase CLI is installed
        if ! command -v supabase &> /dev/null; then
            print_error "Supabase CLI is not installed"
            echo ""
            print_info "Install it with:"
            echo "  npm install -g supabase"
            echo "  or"
            echo "  brew install supabase/tap/supabase"
            echo ""
            exit 1
        fi
        
        print_success "Supabase CLI is installed"
        echo ""
        
        print_info "Linking to your Supabase project..."
        echo ""
        
        read -p "Enter your Supabase project reference ID: " project_ref
        
        if [ -z "$project_ref" ]; then
            print_error "Project reference ID is required"
            exit 1
        fi
        
        echo ""
        print_info "Linking to project: $project_ref"
        
        supabase link --project-ref "$project_ref" || {
            print_error "Failed to link to Supabase project"
            exit 1
        }
        
        print_success "Linked to Supabase project"
        echo ""
        
        print_info "Applying storage policies..."
        
        # Execute the SQL file
        supabase db execute --file supabase/storage-policies.sql || {
            print_error "Failed to apply storage policies"
            exit 1
        }
        
        print_success "Storage policies applied successfully!"
        ;;
        
    3)
        echo ""
        print_header "Method 3: Manual SQL Execution"
        echo ""
        print_info "To apply the policies manually:"
        echo ""
        echo "  1. Open supabase/storage-policies.sql"
        echo "  2. Copy the SQL commands"
        echo "  3. Execute them in your PostgreSQL client"
        echo ""
        
        read -p "Press Enter to display the SQL file path..."
        echo ""
        print_info "SQL file location: $(pwd)/supabase/storage-policies.sql"
        echo ""
        
        read -p "Press Enter when you have applied the policies..."
        ;;
        
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

echo ""
print_header "Verification"
echo ""
print_info "To verify the policies were applied correctly:"
echo ""
echo "Run this query in your Supabase SQL Editor:"
echo ""
echo "  SELECT policyname, cmd"
echo "  FROM pg_policies"
echo "  WHERE tablename = 'objects' AND schemaname = 'storage'"
echo "  ORDER BY policyname;"
echo ""
echo "You should see policies for INSERT, SELECT, UPDATE, and DELETE operations."
echo ""

read -p "Would you like to see the verification query? (y/n): " show_verify
if [[ $show_verify =~ ^[Yy]$ ]]; then
    echo ""
    cat << 'EOF'
-- Verification Query
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%documents%'
ORDER BY policyname;
EOF
    echo ""
fi

echo ""
print_header "Testing the Storage Bucket"
echo ""
print_info "To test the storage bucket:"
echo ""
echo "  1. Go to Storage in your Supabase dashboard"
echo "  2. Click on the 'documents' bucket"
echo "  3. Upload a test file (PDF or image)"
echo "  4. Click on the uploaded file"
echo "  5. Copy the public URL"
echo "  6. Open the URL in a new browser tab"
echo "  7. The file should be accessible without authentication"
echo ""

read -p "Have you tested the storage bucket? (y/n): " tested
if [[ $tested =~ ^[Yy]$ ]]; then
    print_success "Great! Your storage bucket is ready to use."
else
    print_warning "Please test the storage bucket before proceeding."
fi

echo ""
print_header "Setup Complete!"
echo ""
print_success "Storage policies have been applied to your Supabase project."
echo ""
print_info "Next steps:"
echo "  1. Verify the policies in the Supabase dashboard"
echo "  2. Test file upload and public URL access"
echo "  3. Update your application code to use the storage bucket"
echo "  4. Proceed with Task 3: Implement core cryptographic utilities"
echo ""
print_info "For detailed information, see:"
echo "  - supabase/TASK_2.2_INSTRUCTIONS.md"
echo "  - supabase/storage-policies.sql"
echo ""

print_success "All done! 🎉"
echo ""
