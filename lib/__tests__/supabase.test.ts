/**
 * Unit tests for Supabase client initialization
 * Validates Requirements 4.1, 4.2
 */

describe('Supabase Client Initialization', () => {
  // Store original environment variables
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    // Set valid environment variables for each test
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  afterEach(() => {
    // Restore original environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
  });

  it('should initialize successfully with valid environment variables', async () => {
    // Dynamic import to get fresh module with current env vars
    const { supabase } = await import('../supabase');
    
    // Verify the client is defined
    expect(supabase).toBeDefined();
    
    // Verify the client has expected Supabase client methods
    expect(supabase).toHaveProperty('from');
    expect(supabase).toHaveProperty('storage');
    expect(typeof supabase.from).toBe('function');
  });

  it('should have storage property for file operations', async () => {
    const { supabase } = await import('../supabase');
    
    expect(supabase.storage).toBeDefined();
    expect(typeof supabase.storage.from).toBe('function');
  });

  it('should have from method for database operations', async () => {
    const { supabase } = await import('../supabase');
    
    expect(typeof supabase.from).toBe('function');
    
    // Verify we can call from() to get a table reference
    const tableRef = supabase.from('documents');
    expect(tableRef).toBeDefined();
  });
});
