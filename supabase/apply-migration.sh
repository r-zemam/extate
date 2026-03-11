#!/bin/bash

# Script to apply database migrations to Supabase
# This script helps users quickly set up the database schema

echo "EXTATE Database Migration Script"
echo "================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials first."
    echo "See .env.example for reference."
    exit 1
fi

echo "This script will guide you through applying the database migration."
echo ""
echo "You have two options:"
echo ""
echo "1. Manual (Recommended): Copy the SQL and run it in Supabase Dashboard"
echo "2. Supabase CLI: Use the Supabase CLI to apply migrations"
echo ""

read -p "Choose option (1 or 2): " option

if [ "$option" = "1" ]; then
    echo ""
    echo "Manual Migration Steps:"
    echo "----------------------"
    echo "1. Go to your Supabase project dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy the contents of: supabase/migrations/001_create_documents_table.sql"
    echo "4. Paste into the SQL Editor"
    echo "5. Click 'Run' to execute"
    echo ""
    echo "The SQL file is located at:"
    echo "$(pwd)/supabase/migrations/001_create_documents_table.sql"
    echo ""
    
    # Offer to display the SQL
    read -p "Would you like to display the SQL now? (y/n): " show_sql
    if [ "$show_sql" = "y" ]; then
        echo ""
        echo "=== SQL Migration Content ==="
        cat supabase/migrations/001_create_documents_table.sql
        echo ""
        echo "=== End of SQL ==="
        echo ""
    fi
    
elif [ "$option" = "2" ]; then
    echo ""
    echo "Using Supabase CLI..."
    echo ""
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo "Error: Supabase CLI is not installed!"
        echo ""
        echo "Install it with:"
        echo "  npm install -g supabase"
        echo ""
        echo "Or use Option 1 (Manual) instead."
        exit 1
    fi
    
    echo "Make sure you have linked your project first:"
    echo "  supabase link --project-ref your-project-ref"
    echo ""
    
    read -p "Have you linked your project? (y/n): " linked
    if [ "$linked" != "y" ]; then
        echo "Please link your project first, then run this script again."
        exit 1
    fi
    
    echo ""
    echo "Applying migration..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Migration applied successfully!"
    else
        echo ""
        echo "✗ Migration failed. Please check the error above."
        exit 1
    fi
    
else
    echo "Invalid option. Please run the script again and choose 1 or 2."
    exit 1
fi

echo ""
echo "Next steps:"
echo "----------"
echo "1. Verify the table was created in your Supabase dashboard"
echo "2. Set up the 'documents' storage bucket (see README.md)"
echo "3. Run 'npm run dev' to start the development server"
echo ""
