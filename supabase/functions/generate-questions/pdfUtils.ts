
import * as pdfjs from 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/build/pdf.js';

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  console.log('Starting PDF text extraction');
  
  try {
    // Initialize PDF.js worker directly
    const pdfjsWorker = await import('https://cdn.skypack.dev/pdfjs-dist@2.12.313/build/pdf.worker.js');
    if (typeof globalThis.window === 'undefined') {
      // @ts-ignore
      globalThis.window = {};
    }
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully');
    
    // Only process first page to avoid timeouts
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ');

    console.log('Text extraction complete');
    return pageText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`PDF processing error: ${error.message}`);
  }
};
