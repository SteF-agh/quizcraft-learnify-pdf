
import * as pdfjs from 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/legacy/build/pdf.js';
import 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/legacy/build/pdf.worker.entry.js';

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  console.log('Starting PDF text extraction');
  
  try {
    // Configure PDF.js for server environment
    const pdfjsLib = pdfjs;
    if (typeof window === 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/legacy/build/pdf.worker.entry.js';
    }
    
    console.log('PDF.js configured for server environment');

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully');
    
    // Get all pages
    const numPages = pdf.numPages;
    console.log(`PDF has ${numPages} pages`);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      console.log(`Processing page ${i}`);
      
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ');
      
      fullText += pageText + ' ';
    }

    console.log('Text extraction complete, length:', fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`PDF processing error: ${error.message}`);
  }
};
