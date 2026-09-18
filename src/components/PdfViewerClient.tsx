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
    </div>
  );
}