"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileWarning,
} from "lucide-react";

import PdfViewer from "./PdfViewerDynamic";

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

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/#portofolio");
    }
  };

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="shrink-0 h-16 sm:h-[72px] border-b border-border flex items-center justify-between gap-3 px-4 sm:px-6 bg-bg2/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={goBack}
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
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium border border-border text-muted rounded-full px-3.5 py-2 hover:text-white hover:border-white/40 transition-colors"
          >
            <ExternalLink size={13} />
            Tab Baru
          </a>

          <a
            href={downloadFile}
            download
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-3.5 py-2 hover:bg-white/90 transition-colors"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </header>

      {/* PDF */}
      <main className="relative flex-1 min-h-0 bg-[#1a1a1a]">
        {isMobile ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
            <FileWarning size={36} className="text-dim" />

            <div className="space-y-1.5">
              <p className="text-white text-sm font-medium">
                Preview PDF terbatas di HP
              </p>

              <p className="text-muted text-xs max-w-xs">
                Buka di tab baru atau download filenya supaya tampilan
                lebih rapi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-border text-muted rounded-full px-4 py-2 hover:text-white hover:border-white/40 transition-colors"
              >
                <ExternalLink size={13} />
                Buka
              </a>

              <a
                href={downloadFile}
                download
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors"
              >
                <Download size={13} />
                Download
              </a>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <PdfViewer file={file} />
          </div>
        )}
      </main>
    </div>
  );
}