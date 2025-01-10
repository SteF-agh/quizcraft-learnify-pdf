import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to see what values we're actually getting
console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'URL is set' : 'URL is missing',
  key: supabaseAnonKey ? 'Key is set' : 'Key is missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? '[HIDDEN]' : undefined
  });
  
  toast({
    title: "Supabase Connection Error",
    description: "Please connect your Supabase project in the Lovable interface.",
    variant: "destructive",
  });
}

// Create the Supabase client even if env vars are missing
// This prevents the app from crashing, though Supabase features won't work
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Initialize storage bucket if it doesn't exist
const initializeStorage = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Skipping storage initialization due to missing credentials');
    return;
  }

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
        toast({
          title: "Storage Setup Error",
          description: "Could not initialize storage bucket. Some features may be limited.",
          variant: "destructive",
        });
      } else {
        console.log('Bucket created successfully:', data);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    toast({
      title: "Storage Setup Error",
      description: "Could not initialize storage bucket. Some features may be limited.",
      variant: "destructive",
    });
  }
};

initializeStorage();