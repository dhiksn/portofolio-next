"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  Maximize,
} from "lucide-react";

interface PdfViewerClientProps {
  file: string;
  title: string;
  downloadFile?: string;
}

export default function PdfViewerClient({
  file,
  title,
  downloadFile,
}: PdfViewerClientProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);

  /*
   * Karena iframe tidak memberikan informasi jumlah halaman
   * ke parent secara reliable, total halaman tidak bisa kita
   * baca seperti PDF.js.
   *
   * Untuk sementara tampilkan —.
   */
  const totalPages = "—";

  const changeZoom = (value: number) => {
    const newZoom = Math.max(25, Math.min(300, value));
    setZoom(newZoom);
  };

  const zoomIn = () => {
    changeZoom(Math.round(zoom / 10) * 10 + 10);
  };

  const zoomOut = () => {
    changeZoom(Math.round(zoom / 10) * 10 - 10);
  };

  const handlePage = (value: number) => {
    if (value < 1) {
      setPage(1);
      return;
    }

    setPage(value);
  };

  const fullscreen = async () => {
    if (!viewerRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerRef.current.requestFullscreen();
      }
    } catch {
      // Browser menolak fullscreen
    }
  };

  const downloadUrl = downloadFile || file;

  return (
    <div
      ref={viewerRef}
      className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#1a1a1a]"
    >
      {/* PDF */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <iframe
          src={`${file}#toolbar=0&navpanes=0&scrollbar=1`}
          className="block h-full w-full border-0"
          title={title}
        />
      </div>

      {/* CONTROL BAR */}
      <div
        className="
          absolute bottom-5 left-1/2 z-50
          flex -translate-x-1/2 items-center gap-1.5
          rounded-full
          border border-white/[0.12]
          bg-black/80
          px-2 py-1.5
          shadow-[0_8px_32px_rgba(0,0,0,0.55)]
          backdrop-blur-xl
        "
      >
        {/* PREVIOUS */}
        <button
          type="button"
          onClick={() => handlePage(page - 1)}
          disabled={page <= 1}
          title="Halaman sebelumnya"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12] hover:text-white
            disabled:pointer-events-none disabled:opacity-30
          "
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>

        {/* PAGE INPUT */}
        <input
          type="number"
          min={1}
          value={page}
          onChange={(e) =>
            handlePage(parseInt(e.target.value) || 1)
          }
          className="
            h-8 w-11
            rounded-md
            border border-white/[0.1]
            bg-white/[0.06]
            text-center text-xs
            text-white
            outline-none
            transition
            focus:border-white/[0.3]
            focus:bg-white/[0.1]
          "
          title="Nomor halaman"
        />

        {/* TOTAL */}
        <span className="px-0.5 text-xs text-white/35">
          / {totalPages}
        </span>

        {/* NEXT */}
        <button
          type="button"
          onClick={() => handlePage(page + 1)}
          title="Halaman berikutnya"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12] hover:text-white
          "
        >
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>

        {/* DIVIDER */}
        <div className="mx-1 h-5 w-px bg-white/[0.12]" />

        {/* ZOOM OUT */}
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= 25}
          title="Zoom out"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12] hover:text-white
            disabled:pointer-events-none disabled:opacity-30
          "
        >
          <ZoomOut size={14} strokeWidth={2.5} />
        </button>

        {/* ZOOM INPUT */}
        <div className="flex items-center">
          <input
            type="number"
            min={25}
            max={300}
            value={zoom}
            onChange={(e) =>
              changeZoom(parseInt(e.target.value) || 100)
            }
            className="
              h-8 w-12
              rounded-md
              border border-white/[0.1]
              bg-white/[0.06]
              text-center text-xs
              text-white
              outline-none
              transition
              focus:border-white/[0.3]
              focus:bg-white/[0.1]
            "
            title="Zoom"
          />

          <span className="ml-1 text-xs text-white/35">
            %
          </span>
        </div>

        {/* ZOOM IN */}
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= 300}
          title="Zoom in"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12] hover:text-white
            disabled:pointer-events-none disabled:opacity-30
          "
        >
          <ZoomIn size={14} strokeWidth={2.5} />
        </button>

        {/* DIVIDER */}
        <div className="mx-1 h-5 w-px bg-white/[0.12]" />

        {/* SEARCH */}
        <button
          type="button"
          title="Cari teks"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12] hover:text-white
          "
        >
          <Search size={14} strokeWidth={2} />
        </button>

        {/* DOWNLOAD */}
        <a
          href={downloadUrl}
          download
          title="Download"
          className="
            flex h-8 items-center gap-1.5
            rounded-full
            border border-white/[0.14]
            bg-white/[0.1]
            px-3
            text-xs font-medium
            text-white/80
            transition
            hover:bg-white/[0.18]
            hover:text-white
          "
        >
          <Download size={14} strokeWidth={2} />
          <span className="hidden sm:inline">
            Download
          </span>
        </a>

        {/* FULLSCREEN */}
        <button
          type="button"
          onClick={fullscreen}
          title="Fullscreen"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12] hover:text-white
          "
        >
          <Maximize size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}