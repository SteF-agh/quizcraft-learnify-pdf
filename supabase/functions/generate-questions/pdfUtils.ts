
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Konvertiere ArrayBuffer zu Base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // PDF.js CDN URL für minimale Version
    const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.mjs');
    
    // Lade PDF direkt ohne Worker
    const pdf = await pdfjsLib.getDocument({ data: base64 }).promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Beschränke auf maximal 5 Seiten
    const maxPages = Math.min(pdf.numPages, 5);
    
    // Extrahiere Text sequentiell
    for (let i = 1; i <= maxPages; i++) {
      console.log(`Processing page ${i}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    console.log('Text extraction complete, length:', fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`PDF Verarbeitung fehlgeschlagen: ${error.message}`);
  }
};
