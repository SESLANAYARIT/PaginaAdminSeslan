import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";

interface PdfViewerProps {
  fileUrl: string;
  classname?: string;
  initialScale?: number; // zoom relativo
}

export default function PdfViewer({
  fileUrl,
  classname,
  initialScale = 1,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(initialScale);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }, []);

  if (!isClient) return <p>Cargando visor...</p>;

  return (
    <div
      ref={containerRef}
      className={`${classname ?? "w-full border rounded-lg shadow p-2"} flex flex-col items-center overflow-auto`}
    >
      {/* Controles de Zoom */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setScale((s) => Math.max(s - 0.1, 0.1))}
          className="px-2 py-1 border rounded"
        >
          -
        </button>
        <span className="px-2 py-1">{Math.round(scale * 100)}%</span>
        <button
          type="button"
          onClick={() => setScale((s) => s + 0.1)}
          className="px-2 py-1 border rounded"
        >
          +
        </button>
      </div>

      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p>Cargando PDF...</p>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerRef.current?.clientWidth} // ancho del contenedor
            scale={scale}
            className="my-2 object-contain"
          />
        ))}
      </Document>
    </div>
  );
}
