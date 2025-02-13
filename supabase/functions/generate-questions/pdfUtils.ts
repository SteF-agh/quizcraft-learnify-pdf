
import * as pdfjs from 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/legacy/build/pdf.js';

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  console.log('Starting PDF text extraction');
  
  try {
    // Configure PDF.js for server environment
    const pdfjsLib = pdfjs;
    pdfjsLib.disableWorker = true; // Disable worker to run in edge function
    
    console.log('PDF.js configured for server environment');

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully');
    
    // Get the first page
    const page = await pdf.getPage(1);
    console.log('First page loaded');

    // Extract text content
    const textContent = await page.getTextContent();
    console.log('Text content extracted');

    // Combine text items
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ');

    console.log('Text extraction complete, length:', pageText.length);
    return pageText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`PDF processing error: ${error.message}`);
  }
};
