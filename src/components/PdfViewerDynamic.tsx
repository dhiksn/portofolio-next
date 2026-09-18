"use client";

import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
      <p className="text-sm text-white/50">
        Memuat PDF...
      </p>
    </div>
  ),
});

export default PdfViewer;