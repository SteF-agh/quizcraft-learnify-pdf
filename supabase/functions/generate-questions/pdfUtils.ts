
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Konvertiere ArrayBuffer zu Base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // PDF.js CDN URL
    const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    
    // Initialisiere Worker von CDN
    const pdfjsWorker = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js');
    pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker.PDFWorker();

    // Lade PDF
    const pdf = await pdfjsLib.getDocument({ data: base64 }).promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extrahiere Text von allen Seiten
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      console.log(`Processing page ${i}`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    console.log('Text extraction complete, length:', fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    // Fallback: Versuche zumindest einige Textinhalte zu extrahieren
    return "Textextraktion fehlgeschlagen. Bitte überprüfen Sie das PDF-Format.";
  }
};
