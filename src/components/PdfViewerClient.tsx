"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, FileWarning } from "lucide-react";

interface PdfViewerClientProps {
  file: string;
  title: string;
  downloadFile: string;
}

export default function PdfViewerClient({ file, title, downloadFile }: PdfViewerClientProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if mobile device
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
    <div className="min-h-screen bg-bg flex flex-col">
      {/* header */}
      <header className="shrink-0 h-16 sm:h-[72px] border-b border-border flex items-center justify-between gap-3 px-4 sm:px-6 bg-bg2/80 backdrop-blur-sm">
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
          <a
            href={file}
            target="_blank"
            data-cursor-hover
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium border border-border text-muted rounded-full px-3.5 py-2 hover:text-white hover:border-white/40 transition-colors whitespace-nowrap"
          >
            <ExternalLink size={13} /> Tab Baru
          </a>
          <a
            href={downloadFile}
            download
            data-cursor-hover
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-3.5 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            <Download size={13} /> Download
          </a>
        </div>
      </header>

      {/* body */}
      <div className="flex-1 w-full bg-bg relative">
        {isMobile ? (
          // Mobile fallback tetap dipertahankan
          <div className="h-full flex flex-col items-center justify-center gap-5 px-6 text-center pt-20">
            <FileWarning size={36} className="text-dim" />
            <div className="space-y-1.5">
              <p className="text-white text-sm font-medium">
                Preview PDF terbatas di HP
              </p>
              <p className="text-muted text-xs max-w-xs">
                Buka di tab baru atau download filenya supaya tampilan lebih rapi.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={file}
                target="_blank"
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-border text-muted rounded-full px-4 py-2 hover:text-white hover:border-white/40 transition-colors"
              >
                <ExternalLink size={13} /> Buka
              </a>
              <a
                href={downloadFile}
                download
                data-cursor-hover
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors"
              >
                <Download size={13} /> Download
              </a>
            </div>
          </div>
        ) : (
          // Desktop - PERHATIKAN PENGGUNAAN TANDA BACKTICK ( ` ) DI SRC
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe
              src={`https://google.com{encodeURIComponent(file)}&embedded=true`}
              className="w-full h-full border-0"
              title={title}
            />
          </div>
        )}

      </div>
    </div>
  );
}