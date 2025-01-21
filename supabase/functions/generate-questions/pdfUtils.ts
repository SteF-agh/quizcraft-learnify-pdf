import * as pdfjs from 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/build/pdf.js';

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  console.log('Starting PDF text extraction, buffer size:', arrayBuffer.byteLength);
  
  try {
    const workerSrc = 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/build/pdf.worker.js';
    if (!globalThis.pdfjsWorker) {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    }

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    // Only process first 5 pages to avoid timeout
    const pagesToProcess = Math.min(pdf.numPages, 5);
    
    for (let i = 1; i <= pagesToProcess; i++) {
      console.log(`Processing page ${i} of ${pagesToProcess}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ');
      fullText += pageText + '\n\n';
    }

    console.log('Text extraction complete, total length:', fullText.length);
    
    // Limit text length to avoid token limits
    const maxLength = 2000;
    const truncatedText = fullText.slice(0, maxLength);
    
    if (truncatedText.length < 100) {
      throw new Error('Extracted text is too short, possible PDF parsing error');
    }

    return truncatedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`PDF processing error: ${error.message}`);
  }
};