'use server';

import { supabase } from './supabase';

/**
 * Server action to upload a document and register it in the system
 * 
 * @param formData - FormData containing file and metadata
 * @param fingerprint - SHA-256 hash of the file (computed client-side)
 * @returns Object with document ID on success
 * @throws Error with user-friendly message on failure
 */
export async function uploadDocument(
  formData: FormData,
  fingerprint: string
): Promise<{ id: string }> {
  try {
    // Extract form fields
    const file = formData.get('file') as File;
    const ownerName = formData.get('ownerName') as string;
    const propertyAddress = formData.get('propertyAddress') as string;
    const documentType = formData.get('documentType') as string;
    const documentDate = formData.get('documentDate') as string;

    if (!file || !ownerName || !propertyAddress || !documentType || !documentDate) {
      throw new Error('Missing required form fields.');
    }

    // Generate unique filename with UUID
    const fileExtension = file.name.split('.').pop() || 'pdf';
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload file. Please try again.');
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    // Insert document record into database
    const { data: insertData, error: insertError } = await supabase
      .from('documents')
      .insert({
        owner_name: ownerName,
        property_address: propertyAddress,
        document_type: documentType,
        document_date: documentDate,
        fingerprint: fingerprint,
        file_url: fileUrl,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Attempt to clean up uploaded file
      await supabase.storage.from('documents').remove([fileName]);
      throw new Error('Failed to register document. Please try again.');
    }

    if (!insertData || !insertData.id) {
      throw new Error('Failed to retrieve document ID.');
    }

    return { id: insertData.id };
  } catch (error) {
    console.error('Upload error:', error);
    
    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Server action to retrieve a document record
 * 
 * @param id - Document ID (UUID)
 * @returns Document record with all fields
 * @throws Error if document not found
 */
export async function getDocument(id: string) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database fetch error:', error);
      throw new Error('Document not found.');
    }

    if (!data) {
      throw new Error('Document not found.');
    }

    return data;
  } catch (error) {
    console.error('Get document error:', error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    
    throw new Error('Failed to retrieve document.');
  }
}
