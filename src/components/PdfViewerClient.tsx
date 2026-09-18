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
  X,
} from "lucide-react";

import * as pdfjsLib from "pdfjs-dist";

interface PdfViewerClientProps {
  file: string;
  title: string;
  downloadFile?: string;
}

interface PageData {
  page: number;
  element: HTMLDivElement;
}

export default function PdfViewerClient({
  file,
  title,
  downloadFile,
}: PdfViewerClientProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [pdf, setPdf] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState<
    { page: number; text: string }[]
  >([]);

  const [searchIndex, setSearchIndex] = useState(-1);

  const pagesRef = useRef<PageData[]>([]);
  const renderedScaleRef = useRef(1);

  /*
   * PDF.js worker
   */
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "/pdf.worker.min.mjs";
  }, []);

  /*
   * Load PDF
   */
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError("");

        const loadingTask = pdfjsLib.getDocument({
          url: file,
        });

        const document = await loadingTask.promise;

        if (cancelled) return;

        setPdf(document);
        setTotalPages(document.numPages);
        setLoading(false);
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Gagal memuat dokumen PDF.");
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [file]);

  /*
   * Render pages
   */
  useEffect(() => {
    if (!pdf || !scrollRef.current) return;

    let cancelled = false;

    async function renderPages() {
      const container = scrollRef.current;

      if (!container) return;

      container.innerHTML = "";
      pagesRef.current = [];

      const baseScale = 1.4;
      const scale = baseScale * (zoom / 100);

      renderedScaleRef.current = scale;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        if (cancelled) return;

        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale,
        });

        const wrapper = document.createElement("div");

        wrapper.className =
          "pdf-page relative shrink-0 bg-white shadow-2xl";

        wrapper.dataset.page = String(pageNumber);

        wrapper.style.margin = "0 auto 16px";

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        if (!context) continue;

        const devicePixelRatio = window.devicePixelRatio || 1;

        const renderViewport = page.getViewport({
          scale: scale * devicePixelRatio,
        });

        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;

        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        wrapper.style.width = `${viewport.width}px`;
        wrapper.style.height = `${viewport.height}px`;

        wrapper.appendChild(canvas);
        container.appendChild(wrapper);

        pagesRef.current.push({
          page: pageNumber,
          element: wrapper,
        });

        await page.render({
          canvasContext: context,
          viewport: renderViewport,
        }).promise;
      }
    }

    renderPages();

    return () => {
      cancelled = true;
    };
  }, [pdf, zoom]);

  /*
   * Detect current page
   */
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const middle =
        container.scrollTop + container.clientHeight / 2;

      let closestPage = 1;
      let closestDistance = Infinity;

      pagesRef.current.forEach((item) => {
        const element = item.element;

        const center =
          element.offsetTop + element.offsetHeight / 2;

        const distance = Math.abs(center - middle);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = item.page;
        }
      });

      setCurrentPage(closestPage);
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [pdf]);

  /*
   * Scroll to page
   */
  function goToPage(pageNumber: number) {
    if (!scrollRef.current) return;

    const page = Math.max(
      1,
      Math.min(totalPages, pageNumber)
    );

    const target = pagesRef.current.find(
      (item) => item.page === page
    );

    if (!target) return;

    target.element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setCurrentPage(page);
  }

  /*
   * Zoom
   */
  function updateZoom(value: number) {
    const newZoom = Math.max(
      25,
      Math.min(300, value)
    );

    setZoom(newZoom);

    setTimeout(() => {
      goToPage(currentPage);
    }, 100);
  }

  function zoomIn() {
    updateZoom(
      Math.round(zoom / 10) * 10 + 10
    );
  }

  function zoomOut() {
    updateZoom(
      Math.round(zoom / 10) * 10 - 10
    );
  }

  /*
   * Fullscreen
   */
  async function toggleFullscreen() {
    if (!viewerRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error(err);
    }
  }

  /*
   * Search
   */
  async function searchPdf(query: string) {
    if (!pdf || !query.trim()) {
      setSearchResults([]);
      setSearchIndex(-1);
      return;
    }

    const results: {
      page: number;
      text: string;
    }[] = [];

    const normalizedQuery =
      query.toLowerCase();

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);

      const textContent =
        await page.getTextContent();

      const text = textContent.items
        .map((item: any) => item.str)
        .join(" ");

      if (
        text
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        results.push({
          page: pageNumber,
          text,
        });
      }
    }

    setSearchResults(results);

    if (results.length > 0) {
      setSearchIndex(0);
      goToPage(results[0].page);
    } else {
      setSearchIndex(-1);
    }
  }

  function nextSearch() {
    if (searchResults.length === 0) return;

    const next =
      (searchIndex + 1) %
      searchResults.length;

    setSearchIndex(next);
    goToPage(searchResults[next].page);
  }

  function previousSearch() {
    if (searchResults.length === 0) return;

    const previous =
      (searchIndex - 1 + searchResults.length) %
      searchResults.length;

    setSearchIndex(previous);
    goToPage(searchResults[previous].page);
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#1a1a1a] text-white/60">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />

          <p className="text-sm">
            Memuat dokumen...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-center">
          <p className="mb-4 text-sm text-white/60">
            {error}
          </p>

          <a
            href="/portofolio"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            ← Kembali
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#1a1a1a]"
    >
      {/* PDF VIEWER */}

      <div
        ref={scrollRef}
        className="
          flex-1
          overflow-auto
          px-4
          py-6
          [scrollbar-color:rgba(255,255,255,0.14)_transparent]
          [scrollbar-width:thin]
        "
      />

      {/* SEARCH PANEL */}

      {searchOpen && (
        <div
          className="
            absolute
            right-4
            top-20
            z-[100]
            w-[360px]
            overflow-hidden
            rounded-xl
            border border-white/[0.12]
            bg-[#111]/95
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2 border-b border-white/[0.1] p-3">
            <Search
              size={16}
              className="text-white/40"
            />

            <input
              autoFocus
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                searchPdf(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  nextSearch();
                }

                if (e.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
              placeholder="Cari teks dalam dokumen..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-white/30
              "
            />

            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchText("");
                setSearchResults([]);
              }}
              className="text-white/40 transition hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3">
            <span className="text-xs text-white/40">
              {searchResults.length > 0
                ? `${searchIndex + 1} / ${searchResults.length}`
                : searchText
                  ? "Tidak ditemukan"
                  : ""}
            </span>

            <div className="flex gap-1">
              <button
                onClick={previousSearch}
                disabled={!searchResults.length}
                className="rounded-lg bg-white/5 p-2 text-white/60 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={nextSearch}
                disabled={!searchResults.length}
                className="rounded-lg bg-white/5 p-2 text-white/60 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTROL BAR */}

      <div
        className="
          absolute
          top-5
          left-1/2
          z-50
          flex
          -translate-x-1/2
          items-center
          gap-1
          rounded-full
          border
          border-white/[0.12]
          bg-black/80
          px-2
          py-1.5
          shadow-[0_8px_32px_rgba(0,0,0,0.7)]
          backdrop-blur-xl
        "
      >
        {/* PREVIOUS */}

        <button
          onClick={() =>
            goToPage(currentPage - 1)
          }
          disabled={currentPage <= 1}
          title="Halaman sebelumnya"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12]
            hover:text-white
            disabled:pointer-events-none
            disabled:opacity-30
          "
        >
          <ChevronLeft size={16} />
        </button>

        {/* PAGE */}

        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const value =
              parseInt(e.target.value) || 1;

            goToPage(value);
          }}
          className="
            h-9
            w-12
            rounded-md
            border border-white/[0.1]
            bg-white/[0.06]
            text-center
            text-xs
            text-white
            outline-none
            focus:border-white/[0.3]
          "
        />

        <span className="px-1 text-xs text-white/40">
          / {totalPages}
        </span>

        {/* NEXT */}

        <button
          onClick={() =>
            goToPage(currentPage + 1)
          }
          disabled={
            currentPage >= totalPages
          }
          title="Halaman berikutnya"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12]
            hover:text-white
            disabled:pointer-events-none
            disabled:opacity-30
          "
        >
          <ChevronRight size={16} />
        </button>

        {/* DIVIDER */}

        <div className="mx-1 h-5 w-px bg-white/[0.12]" />

        {/* ZOOM OUT */}

        <button
          onClick={zoomOut}
          disabled={zoom <= 25}
          title="Zoom out"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12]
            hover:text-white
            disabled:pointer-events-none
            disabled:opacity-30
          "
        >
          <ZoomOut size={15} />
        </button>

        {/* ZOOM */}

        <input
          type="number"
          min={25}
          max={300}
          value={zoom}
          onChange={(e) =>
            updateZoom(
              parseInt(e.target.value) || 100
            )
          }
          className="
            h-9
            w-14
            rounded-md
            border border-white/[0.1]
            bg-white/[0.06]
            text-center
            text-xs
            text-white
            outline-none
            focus:border-white/[0.3]
          "
        />

        <span className="text-xs text-white/40">
          %
        </span>

        {/* ZOOM IN */}

        <button
          onClick={zoomIn}
          disabled={zoom >= 300}
          title="Zoom in"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12]
            hover:text-white
            disabled:pointer-events-none
            disabled:opacity-30
          "
        >
          <ZoomIn size={15} />
        </button>

        {/* DIVIDER */}

        <div className="mx-1 h-5 w-px bg-white/[0.12]" />

        {/* SEARCH */}

        <button
          onClick={() => setSearchOpen(true)}
          title="Cari"
          className={`
            flex h-9 w-9 items-center justify-center
            rounded-full
            border
            transition
            ${
              searchOpen
                ? "border-white/[0.35] bg-white/[0.14] text-white"
                : "border-white/[0.08] bg-white/[0.06] text-white/60 hover:bg-white/[0.12] hover:text-white"
            }
          `}
        >
          <Search size={15} />
        </button>

        {/* DOWNLOAD */}

        <a
          href={downloadFile || file}
          download
          title="Download"
          className="
            flex h-9 items-center gap-1.5
            rounded-full
            border border-white/[0.18]
            bg-white/[0.1]
            px-3
            text-xs
            font-medium
            text-white/80
            transition
            hover:bg-white/[0.18]
            hover:text-white
          "
        >
          <Download size={14} />

          <span className="hidden sm:inline">
            Download
          </span>
        </a>

        {/* FULLSCREEN */}

        <button
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-white/[0.08]
            bg-white/[0.06]
            text-white/60
            transition
            hover:bg-white/[0.12]
            hover:text-white
          "
        >
          <Maximize size={14} />
        </button>
      </div>
    </div>
  );
}