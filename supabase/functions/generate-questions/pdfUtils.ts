import * as pdfjs from 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/build/pdf.js';

export const initializePdfWorker = () => {
  const workerSrc = 'https://cdn.skypack.dev/pdfjs-dist@2.12.313/build/pdf.worker.js';
  if (!globalThis.pdfjsWorker) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }
};

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  console.log('PDF array buffer size:', arrayBuffer.byteLength);
  
  try {
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }

    console.log('Successfully extracted text from PDF, length:', fullText.length);
    
    if (fullText.length < 100) {
      throw new Error('Extracted text is too short, possible PDF parsing error');
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`PDF processing error: ${error.message}`);
  }
};