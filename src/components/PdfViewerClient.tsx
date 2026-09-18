"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
} from "lucide-react";

interface PdfViewerClientProps {
  file: string;
  title: string;
}

export default function PdfViewerClient({
  file,
  title,
}: PdfViewerClientProps) {
  const [zoom, setZoom] = useState(100);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setZoom(100);
  };

  const fullscreen = () => {
    const element = document.getElementById("pdf-viewer");

    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen();
    }
  };

  return (
    <div
      id="pdf-viewer"
      className="relative h-full w-full overflow-hidden bg-black"
    >
      {/* PDF */}
      <div className="h-full w-full overflow-auto">
        <div
          className="min-h-full origin-top-left"
          style={{
            width: `${zoom}%`,
            minWidth: "100%",
          }}
        >
          <iframe
            src={`${file}#toolbar=0&navpanes=0&scrollbar=1`}
            className="h-full min-h-screen w-full border-0"
            title={title}
          />
        </div>
      </div>

      {/* Custom Controls */}
      <div className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-black/70 p-1.5 shadow-2xl backdrop-blur-xl">
        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          disabled={zoom <= 50}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          title="Zoom Out"
        >
          <ZoomOut size={19} />
        </button>

        {/* Zoom Percentage */}
        <button
          onClick={resetZoom}
          className="min-w-[55px] rounded-xl px-2 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          title="Reset Zoom"
        >
          {zoom}%
        </button>

        {/* Zoom In */}
        <button
          onClick={zoomIn}
          disabled={zoom >= 200}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          title="Zoom In"
        >
          <ZoomIn size={19} />
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-white/10" />

        {/* Reset */}
        <button
          onClick={resetZoom}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
          title="Reset Zoom"
        >
          <RotateCcw size={18} />
        </button>

        {/* Fullscreen */}
        <button
          onClick={fullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
          title="Fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}