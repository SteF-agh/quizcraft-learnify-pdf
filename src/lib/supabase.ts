import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? '[HIDDEN]' : undefined
  });
  throw new Error('Missing Supabase environment variables');
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