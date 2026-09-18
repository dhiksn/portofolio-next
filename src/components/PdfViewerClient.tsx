"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileWarning,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerClientProps {
  file: string;
  title: string;
  downloadFile: string;
}

export default function PdfViewerClient({
  file,
  title,
  downloadFile,
}: PdfViewerClientProps) {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [scale, setScale] = useState<number>(1);

  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setContainerWidth(width - 32);
      } else if (width < 1024) {
        setContainerWidth(width - 80);
      } else {
        setContainerWidth(Math.min(width - 120, 900));
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/#portofolio");
    }
  };

  const onDocumentLoadSuccess = ({
    numPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = () => {
    setLoading(false);
    setError(true);
  };

  const previousPage = () => {
    setPageNumber((page) => Math.max(page - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((page) => Math.min(page + 1, numPages));
  };

  const zoomIn = () => {
    setScale((value) => Math.min(value + 0.15, 2.5));
  };

  const zoomOut = () => {
    setScale((value) => Math.max(value - 0.15, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* HEADER */}
      <header className="shrink-0 h-16 sm:h-[72px] border-b border-border flex items-center justify-between gap-3 px-4 sm:px-6 bg-bg2/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={goBack}
            data-cursor-hover
            className="shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-white hover:border-white/40 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft size={16} />
          </button>

          <h1 className="text-sm sm:text-base font-medium text-white truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop: Buka tab baru */}
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium border border-border text-muted rounded-full px-3.5 py-2 hover:text-white hover:border-white/40 transition-colors whitespace-nowrap"
          >
            <ExternalLink size={13} />
            Tab Baru
          </a>

          {/* Download */}
          <a
            href={downloadFile}
            download
            data-cursor-hover
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-3.5 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </header>

      {/* PDF AREA */}
      <div className="relative flex-1 min-h-0 bg-[#1a1a1a] overflow-hidden">
        {isMobile ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
            <FileWarning size={36} className="text-dim" />

            <div className="space-y-1.5">
              <p className="text-white text-sm font-medium">
                Preview PDF terbatas di HP
              </p>

              <p className="text-muted text-xs max-w-xs">
                Buka di tab baru atau download filenya supaya tampilan lebih
                rapi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-border text-muted rounded-full px-4 py-2 hover:text-white hover:border-white/40 transition-colors"
              >
                <ExternalLink size={13} />
                Buka
              </a>

              <a
                href={downloadFile}
                download
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors"
              >
                <Download size={13} />
                Download
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* PDF DOCUMENT */}
            <div className="absolute inset-0 overflow-auto">
              <div className="min-h-full w-full flex justify-center py-8 px-4">
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center min-h-[500px]">
                      <div className="text-sm text-muted">
                        Memuat PDF...
                      </div>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
                      <FileWarning
                        size={32}
                        className="text-muted"
                      />

                      <p className="text-sm text-muted">
                        Gagal memuat PDF.
                      </p>
                    </div>
                  }
                >
                  <div className="bg-white shadow-2xl">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      width={containerWidth}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      loading={
                        <div
                          className="bg-white"
                          style={{
                            width: containerWidth,
                            height: 500,
                          }}
                        />
                      }
                    />
                  </div>
                </Document>
              </div>
            </div>

            {/* CONTROLS */}
            {!error && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40">
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
                  {/* Previous */}
                  <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {/* Page */}
                  <div className="min-w-[75px] text-center text-xs text-white/80">
                    {pageNumber} / {numPages || "..."}
                  </div>

                  {/* Next */}
                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight size={17} />
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-1" />

                  {/* Zoom Out */}
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
                    aria-label="Perkecil"
                  >
                    <ZoomOut size={16} />
                  </button>

                  {/* Zoom */}
                  <button
                    onClick={resetZoom}
                    className="w-12 h-9 flex items-center justify-center rounded-xl text-xs text-white/80 hover:bg-white/10 transition"
                    title="Reset zoom"
                  >
                    {Math.round(scale * 100)}%
                  </button>

                  {/* Zoom In */}
                  <button
                    onClick={zoomIn}
                    disabled={scale >= 2.5}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
                    aria-label="Perbesar"
                  >
                    <ZoomIn size={16} />
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-1" />

                  {/* Reset */}
                  <button
                    onClick={resetZoom}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}