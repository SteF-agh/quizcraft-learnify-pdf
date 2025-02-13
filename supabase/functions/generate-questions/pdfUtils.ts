
export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Konvertiere ArrayBuffer zu Base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Nutze PDF.js CDN direkt
    const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm');
    
    // Konfiguriere worker
    const worker = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

    // Lade PDF
    const loadingTask = pdfjsLib.getDocument({data: base64});
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extrahiere Text von allen Seiten
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};
