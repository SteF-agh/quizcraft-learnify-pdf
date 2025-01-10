import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to see what values we're actually getting
console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'URL is set' : 'URL is missing',
  key: supabaseAnonKey ? 'Key is set' : 'Key is missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? '[HIDDEN]' : undefined
  });
  throw new Error('Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize storage bucket if it doesn't exist
const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const pdfsBucketExists = buckets?.some(bucket => bucket.name === 'pdfs');
    
    if (!pdfsBucketExists) {
      console.log('Creating pdfs bucket...');
      const { data, error } = await supabase.storage.createBucket('pdfs', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket created successfully:', data);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

initializeStorage();