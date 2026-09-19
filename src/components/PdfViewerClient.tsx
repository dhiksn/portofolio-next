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
  viewport: any;
  highlightLayer: HTMLDivElement;
}

interface SearchMatch {
  page: number;
  before: string;
  match: string;
  after: string;
  left: number;
  top: number;
  width: number;
  height: number;
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

  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);

  const [searchIndex, setSearchIndex] = useState(-1);

  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageItemsCacheRef = useRef<Map<number, any[]>>(new Map());

  const pagesRef = useRef<PageData[]>([]);
  const renderedScaleRef = useRef(1);

  const searchTextRef = useRef("");
  const searchPdfRef = useRef<any>(null);
  searchTextRef.current = searchText;
  searchPdfRef.current = searchPdf;

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

        console.info(
          `[PdfViewer] Dokumen dimuat, total halaman: ${document.numPages}`
        );

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

      // Bersihkan render sebelumnya
      container.innerHTML = "";
      pagesRef.current = [];

      const baseScale = 1.4;
      const scale = baseScale * (zoom / 100);

      renderedScaleRef.current = scale;

      /*
      * Container halaman PDF
      *
      * Jangan pakai flex di sini.
      * Block layout lebih stabil untuk scroll vertikal
      * ketika ukuran halaman berubah karena zoom.
      */
      const pagesContainer = document.createElement("div");

      pagesContainer.style.width = "100%";
      pagesContainer.style.height = "max-content";
      pagesContainer.style.minHeight = "100%";
      pagesContainer.style.display = "block";
      pagesContainer.style.boxSizing = "border-box";
      pagesContainer.style.paddingBottom = "40px";

      container.appendChild(pagesContainer);

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        if (cancelled) return;

        try {
          const page = await pdf.getPage(pageNumber);

          const viewport = page.getViewport({
            scale,
          });

          const wrapper = document.createElement("div");

          wrapper.className =
            "pdf-page relative bg-white shadow-2xl";

          wrapper.dataset.page = String(pageNumber);

          /*
          * Ukuran halaman
          */
          wrapper.style.width = `${viewport.width}px`;
          wrapper.style.height = `${viewport.height}px`;

          /*
          * Center halaman
          */
          wrapper.style.marginLeft = "auto";
          wrapper.style.marginRight = "auto";
          wrapper.style.marginBottom = "16px";

          /*
          * Jangan biarkan flex ikut campur.
          */
          wrapper.style.display = "block";

          const canvas = document.createElement("canvas");

          const context = canvas.getContext("2d");

          if (!context) continue;

          const devicePixelRatio =
            window.devicePixelRatio || 1;

          const renderViewport = page.getViewport({
            scale: scale * devicePixelRatio,
          });

          canvas.width = Math.floor(renderViewport.width);
          canvas.height = Math.floor(renderViewport.height);

          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          canvas.style.display = "block";

          wrapper.appendChild(canvas);

          const highlightLayer = document.createElement("div");
          highlightLayer.className =
            "pdf-search-highlight-layer";
          highlightLayer.style.position = "absolute";
          highlightLayer.style.inset = "0";
          highlightLayer.style.overflow = "hidden";
          highlightLayer.style.pointerEvents = "none";
          wrapper.appendChild(highlightLayer);

          pagesContainer.appendChild(wrapper);

          pagesRef.current.push({
            page: pageNumber,
            element: wrapper,
            viewport,
            highlightLayer,
          });

          await page.render({
            canvasContext: context,
            viewport: renderViewport,
          }).promise;
        } catch (err) {
          // Jangan biarkan 1 halaman gagal menghentikan
          // seluruh proses render, sehingga sisa dokumen
          // tetap bisa muncul (dan tetap bisa discroll).
          console.error(
            `[PdfViewer] Gagal render halaman ${pageNumber}:`,
            err
          );
        }
      }

      if (!cancelled) {
        console.info(
          `[PdfViewer] Render selesai: ${pagesRef.current.length}/${pdf.numPages} halaman berhasil`
        );

        // Kalau lagi ada pencarian aktif (misal abis ganti zoom),
        // hitung ulang posisi highlight-nya karena skala berubah.
        if (searchTextRef.current.trim()) {
          searchPdfRef.current?.(searchTextRef.current);
        }
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
      const containerRect =
        container.getBoundingClientRect();

      const middle =
        containerRect.top +
        container.clientHeight / 2;

      let closestPage = 1;
      let closestDistance = Infinity;

      pagesRef.current.forEach((item) => {
        const rect =
          item.element.getBoundingClientRect();

        const pageMiddle =
          rect.top + rect.height / 2;

        const distance = Math.abs(
          pageMiddle - middle
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = item.page;
        }
      });

      setCurrentPage(closestPage);
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [pdf]);

  /*
  * Scroll to page
  */
  function goToPage(pageNumber: number) {
    const container = scrollRef.current;

    if (!container) return;

    const page = Math.max(
      1,
      Math.min(totalPages, pageNumber)
    );

    const target = pagesRef.current.find(
      (item) => item.page === page
    );

    if (!target) return;

    const containerRect =
      container.getBoundingClientRect();

    const targetRect =
      target.element.getBoundingClientRect();

    const offset =
      targetRect.top -
      containerRect.top +
      container.scrollTop -
      24;

    container.scrollTo({
      top: Math.max(0, offset),
      behavior: "smooth",
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
  }

  function zoomIn() {
    updateZoom(zoom + 10);
  }

  function zoomOut() {
    updateZoom(zoom - 10);
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
  useEffect(() => {
    pageItemsCacheRef.current.clear();
    setSearchResults([]);
    setSearchIndex(-1);
  }, [pdf]);

  async function getPageItems(pageNumber: number): Promise<any[]> {
    const cached = pageItemsCacheRef.current.get(pageNumber);
    if (cached) return cached;

    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    pageItemsCacheRef.current.set(pageNumber, textContent.items);
    return textContent.items;
  }

  function clearHighlights() {
    pagesRef.current.forEach((p) => {
      if (p.highlightLayer) p.highlightLayer.innerHTML = "";
    });
  }

  function drawHighlights(results: SearchMatch[], activeIndex: number) {
    clearHighlights();

    results.forEach((m, i) => {
      const pageInfo = pagesRef.current.find(
        (p) => p.page === m.page
      );
      if (!pageInfo?.highlightLayer) return;

      const box = document.createElement("div");
      box.style.position = "absolute";
      box.style.left = `${m.left}px`;
      box.style.top = `${m.top}px`;
      box.style.width = `${m.width}px`;
      box.style.height = `${m.height}px`;
      box.style.borderRadius = "2px";
      box.style.background =
        i === activeIndex
          ? "rgba(255, 140, 0, 0.65)"
          : "rgba(255, 220, 0, 0.45)";

      pageInfo.highlightLayer.appendChild(box);
    });
  }

  // Gambar ulang / bersihkan highlight tiap kali hasil atau posisi aktif berubah
  useEffect(() => {
    drawHighlights(searchResults, searchIndex);
  }, [searchResults, searchIndex]);

  async function searchPdf(query: string) {
    if (!pdf || !query.trim()) {
      setSearchResults([]);
      setSearchIndex(-1);
      return;
    }

    const results: SearchMatch[] = [];

    const normalizedQuery = query.trim().toLowerCase();
    const CONTEXT = 42;

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const items = await getPageItems(pageNumber);
      const pageInfo = pagesRef.current.find(
        (p) => p.page === pageNumber
      );
      const viewport = pageInfo?.viewport;

      for (const item of items) {
        const text: string = item.str || "";
        if (!text) continue;

        const lowerText = text.toLowerCase();

        let idx = 0;
        while (
          (idx = lowerText.indexOf(normalizedQuery, idx)) !== -1
        ) {
          let left = 0;
          let top = 0;
          let width = 4;
          let height = 12;

          // Konversi posisi teks (koordinat PDF) ke posisi
          // pixel CSS di atas canvas halaman yang di-render.
          if (viewport) {
            const tx = item.transform;
            const point = viewport.convertToViewportPoint(
              tx[4],
              tx[5]
            );

            const glyphHeight =
              Math.abs(tx[3]) *
              Math.abs(viewport.transform[3]);

            const totalWidth =
              (item.width || 0) *
              Math.abs(viewport.transform[0]);

            const charWidth =
              totalWidth / (text.length || 1);

            left = point[0] + idx * charWidth;
            top = point[1] - glyphHeight;
            width = Math.max(
              charWidth * normalizedQuery.length,
              4
            );
            height = glyphHeight + 2;
          }

          results.push({
            page: pageNumber,
            before: text.slice(
              Math.max(0, idx - CONTEXT),
              idx
            ),
            match: text.slice(
              idx,
              idx + normalizedQuery.length
            ),
            after: text.slice(
              idx + normalizedQuery.length,
              idx + normalizedQuery.length + CONTEXT
            ),
            left,
            top,
            width,
            height,
          });

          idx += normalizedQuery.length;
        }
      }
    }

    setSearchResults(results);

    if (results.length > 0) {
      setSearchIndex(0);
      scrollToMatch(results[0]);
    } else {
      setSearchIndex(-1);
    }
  }

  function handleSearchInputChange(value: string) {
    setSearchText(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      searchPdf(value);
    }, 250);
  }

  /*
   * Scroll ke posisi match yang tepat (bukan cuma ke atas halaman)
   */
  function scrollToMatch(match: SearchMatch) {
    const container = scrollRef.current;
    if (!container) return;

    const target = pagesRef.current.find(
      (item) => item.page === match.page
    );
    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.element.getBoundingClientRect();

    const offset =
      targetRect.top -
      containerRect.top +
      container.scrollTop +
      match.top -
      120;

    container.scrollTo({
      top: Math.max(0, offset),
      behavior: "smooth",
    });

    setCurrentPage(match.page);
  }

  function nextSearch() {
    if (searchResults.length === 0) return;

    const next =
      (searchIndex + 1) %
      searchResults.length;

    setSearchIndex(next);
    scrollToMatch(searchResults[next]);
  }

  function previousSearch() {
    if (searchResults.length === 0) return;

    const previous =
      (searchIndex - 1 + searchResults.length) %
      searchResults.length;

    setSearchIndex(previous);
    scrollToMatch(searchResults[previous]);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchText("");
    setSearchResults([]);
    setSearchIndex(-1);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
  }

  useEffect(() => {
    if (!searchOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

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
      {/* NAVBAR */}
      <nav className="relative z-[100] flex h-16 shrink-0 items-center border-b border-white/[0.08] bg-[#111]/90 px-4 shadow-lg backdrop-blur-xl">
        
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => window.history.back()}
            title="Kembali"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full
              border border-white/[0.08]
              bg-white/[0.05]
              text-white/60
              transition
              hover:bg-white/[0.1]
              hover:text-white
            "
          >
            <ChevronLeft size={17} />
          </button>

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-white">
              {title}
            </p>

            <p className="text-[11px] text-white/35">
              PDF Document
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          
          {/* PREVIOUS */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Halaman sebelumnya"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              border border-white/[0.08]
              bg-white/[0.05]
              text-white/60
              transition
              hover:bg-white/[0.1]
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
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Halaman berikutnya"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              border border-white/[0.08]
              bg-white/[0.05]
              text-white/60
              transition
              hover:bg-white/[0.1]
              hover:text-white
              disabled:pointer-events-none
              disabled:opacity-30
            "
          >
            <ChevronRight size={16} />
          </button>

          <div className="mx-2 h-5 w-px bg-white/[0.1]" />

          {/* ZOOM OUT */}
          <button
            onClick={zoomOut}
            disabled={zoom <= 25}
            title="Zoom out"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              border border-white/[0.08]
              bg-white/[0.05]
              text-white/60
              transition
              hover:bg-white/[0.1]
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
              bg-white/[0.05]
              text-white/60
              transition
              hover:bg-white/[0.1]
              hover:text-white
              disabled:pointer-events-none
              disabled:opacity-30
            "
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-1">
          
          {/* SEARCH */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchOpen((open) => !open);
            }}
            title="Cari"
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-full
              border
              transition
              ${
                searchOpen
                  ? "border-white/[0.35] bg-white/[0.14] text-white"
                  : "border-white/[0.08] bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
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
              border border-white/[0.12]
              bg-white/[0.06]
              px-3
              text-xs
              font-medium
              text-white/70
              transition
              hover:bg-white/[0.12]
              hover:text-white
            "
          >
            <Download size={14} />

            <span className="hidden md:inline">
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
              bg-white/[0.05]
              text-white/60
              transition
              hover:bg-white/[0.1]
              hover:text-white
            "
          >
            <Maximize size={14} />
          </button>
        </div>
      </nav>

      {/* PDF VIEWER */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="
          relative
          min-h-0
          flex-1
          w-full
          overflow-y-auto
          overflow-x-hidden
          px-4
          py-6
        "
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}
      />

      {/* SEARCH PANEL */}
      {searchOpen && (
        <div
          ref={searchPanelRef}
          className="
            absolute
            right-4
            top-20
            z-[200]
            w-[380px]
            overflow-hidden
            rounded-xl
            border border-white/[0.12]
            bg-[#111]
            shadow-2xl
          "
        >
          {/* HEAD */}
          <div className="flex items-center gap-2.5 border-b border-white/[0.1] px-4 pt-4 pb-3">
            <Search
              size={16}
              className="shrink-0 text-white/40"
            />

            <input
              autoFocus
              value={searchText}
              onChange={(e) =>
                handleSearchInputChange(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (e.shiftKey) {
                    previousSearch();
                  } else {
                    nextSearch();
                  }
                }

                if (e.key === "Escape") {
                  closeSearch();
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

            <span className="min-w-[48px] shrink-0 text-right text-[11px] text-white/40">
              {searchResults.length > 0
                ? `${searchIndex + 1} / ${searchResults.length}`
                : searchText.trim()
                  ? "Tidak ditemukan"
                  : ""}
            </span>

            <button
              onClick={closeSearch}
              title="Tutup (Esc)"
              className="
                flex h-[26px] w-[26px] shrink-0
                items-center justify-center
                rounded-md
                border border-white/[0.12]
                bg-white/[0.07]
                text-white/60
                transition
                hover:bg-white/[0.14] hover:text-white
              "
            >
              <X size={14} />
            </button>
          </div>

          {/* RESULTS LIST */}
          <div
            data-lenis-prevent
            className="max-h-[320px] overflow-y-auto py-2"
          >
            {searchText.trim() && searchResults.length === 0 && (
              <div className="px-4 py-8 text-center text-[13px] text-white/40">
                Tidak ditemukan
              </div>
            )}

            {searchResults.map((result, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchIndex(i);
                  scrollToMatch(result);
                }}
                className={`
                  flex w-full items-start gap-3 px-4 py-[10px] text-left transition
                  ${
                    i === searchIndex
                      ? "bg-white/[0.1]"
                      : "hover:bg-white/[0.06]"
                  }
                `}
              >
                <span
                  className="
                    mt-[1px] shrink-0 whitespace-nowrap
                    rounded border border-white/[0.1]
                    bg-white/[0.07]
                    px-[7px] py-[2px]
                    text-[11px] font-bold tracking-wide
                    text-white/40
                  "
                >
                  Hal. {result.page}
                </span>

                <span className="line-clamp-2 text-[13px] leading-relaxed text-white/60">
                  {result.before}
                  <mark className="rounded-sm bg-yellow-400/35 px-[1px] text-white">
                    {result.match}
                  </mark>
                  {result.after}
                </span>
              </button>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.1] px-4 py-[9px]">
            <div className="flex gap-1">
              <button
                onClick={previousSearch}
                disabled={!searchResults.length}
                title="Sebelumnya"
                className="rounded-lg bg-white/5 p-2 text-white/60 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={nextSearch}
                disabled={!searchResults.length}
                title="Berikutnya"
                className="rounded-lg bg-white/5 p-2 text-white/60 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <span className="text-[11px] whitespace-nowrap text-white/40">
              Enter ↓&nbsp;&nbsp;Shift+Enter ↑&nbsp;&nbsp;Esc tutup
            </span>
          </div>
        </div>
      )}
    </div>
  );
}