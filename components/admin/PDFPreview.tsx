import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";

export default function PdfPreview({ fileUrl }: { fileUrl: string }) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fileUrl) {
      fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => setPdfBlobUrl(URL.createObjectURL(blob)))
        .catch(error => console.error("Error loading PDF:", error));
    }
  }, [fileUrl]);

  return (
    <div className="border p-2">
      {pdfBlobUrl ? (
        <Document file={pdfBlobUrl} className="w-full h-48">
          <Page pageNumber={1} width={200} />
        </Document>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}
