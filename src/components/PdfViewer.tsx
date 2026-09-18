"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(900);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateWidth = () => {
      const viewportWidth = window.innerWidth;

      if (viewportWidth < 640) {
        setWidth(viewportWidth - 32);
      } else if (viewportWidth < 1024) {
        setWidth(viewportWidth - 80);
      } else {
        setWidth(Math.min(viewportWidth - 120, 900));
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* PDF SCROLL AREA */}
      <div
        className="
          absolute inset-0
          overflow-y-auto
          overflow-x-auto
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div className="flex flex-col items-center gap-5 px-4 py-8">
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
            loading={
              <div className="flex h-[500px] items-center justify-center text-sm text-white/50">
                Memuat PDF...
              </div>
            }
            error={
              <div className="flex h-[500px] items-center justify-center text-sm text-red-400">
                Gagal memuat PDF.
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, index) => (
              <div
                key={`page-${index + 1}`}
                className="shrink-0 bg-white shadow-2xl"
              >
                <Page
                  pageNumber={index + 1}
                  width={width}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* ZOOM CONTROL */}
      <div className="absolute bottom-5 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/80 px-2 py-1.5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              setScale((value) => Math.max(0.5, value - 0.1));
            }}
            disabled={scale <= 0.5}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            −
          </button>

          <button
            type="button"
            onClick={() => {
              setScale(1);
            }}
            className="h-9 min-w-14 rounded-xl px-2 text-xs text-white/80 transition hover:bg-white/10"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            type="button"
            onClick={() => {
              setScale((value) => Math.min(2.5, value + 0.1));
            }}
            disabled={scale >= 2.5}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}