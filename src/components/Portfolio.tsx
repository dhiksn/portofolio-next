"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Download,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { projects, certificates, Project } from "@/data/portfolio";
import { SectionTag } from "@/components/Reveal";

type Certificate = (typeof certificates)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="group relative w-[78vw] sm:w-[340px] lg:w-[380px] shrink-0">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-bg3 border border-border">
        <img
          src={project.image}
          alt={project.title}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.demotype === "download" ? (
            <>
              {project.pdfFile && (
                <Link
                  href={`/pdf/${project.slug}`}
                  data-cursor-hover
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/90 text-black rounded-full px-4 py-2 hover:bg-white transition-colors whitespace-nowrap"
                >
                  <FileText size={13} /> Lihat PDF
                </Link>
              )}
              {project.downloadFile && (
                <a
                  href={project.downloadFile}
                  download
                  data-cursor-hover
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
                >
                  <Download size={13} /> Download
                </a>
              )}
            </>
          ) : (
            <>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  data-cursor-hover
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/90 text-black rounded-full px-4 py-2 hover:bg-white transition-colors whitespace-nowrap"
                >
                  <Github size={13} /> Code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  data-cursor-hover
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors whitespace-nowrap"
                >
                  <ExternalLink size={13} /> Demo
                </a>
              )}
            </>
          )}
        </div>

        <span className="absolute top-3 left-3 font-mono text-[11px] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
          {project.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed mt-1.5 max-w-sm line-clamp-2">
          {project.description}
        </p>
        {project.tech && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] text-dim border border-border rounded-full px-2.5 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CertificateCard({
  certificate,
  index,
  onOpen,
}: {
  certificate: Certificate;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      data-cursor-hover
      className="group relative w-[62vw] sm:w-[280px] lg:w-[300px] shrink-0 text-left"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-bg3 border border-border">
        <img
          src={certificate.image}
          alt={certificate.title}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        <span className="absolute top-3 left-3 font-mono text-[11px] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm sm:text-base font-medium tracking-tight text-white leading-snug line-clamp-2">
          {certificate.title}
        </p>
      </div>
    </button>
  );
}

function PortfolioHorizontalScroll({
  tab,
  setTab,
  openCert,
}: {
  tab: "proyek" | "sertifikat";
  setTab: (t: "proyek" | "sertifikat") => void;
  openCert: (idx: number) => void;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [distance, setDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [leftPad, setLeftPad] = useState(24);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const vw = window.innerWidth;
      // ukur posisi kiri teks heading beneran, biar card pertama
      // selalu sejajar persis sama "Proyek & Sertifikat" di atasnya,
      // ga perlu tebak angka padding per breakpoint
      const headingLeft = headingRef.current?.getBoundingClientRect().left;
      if (typeof headingLeft === "number") setLeftPad(headingLeft);
      // tanpa offset sama sekali: card pertama langsung nempel di
      // padding kiri track dari awal, semua sisa scroll dipakai buat geser
      setStartX(0);
      setDistance(trackRef.current.scrollWidth - vw);
      setViewportHeight(window.innerHeight);
    };
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
    // re-measure tiap kali tab berganti, karena konten track (proyek vs sertifikat) beda lebar
  }, [tab]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [startX, -distance]);
  const pinHeight =
    distance > 0 && viewportHeight > 0
      ? distance + startX + viewportHeight
      : "300vh";

  return (
    <div ref={targetRef} className="relative" style={{ height: pinHeight }}>
      <div className="sticky top-0 h-screen flex flex-col justify-start items-start overflow-hidden pt-20 sm:pt-24">
        {/* Heading + tab ikut nempel selama horizontal scroll berlangsung */}
        <div className="container-x w-full shrink-0 mb-10 sm:mb-14">
          <SectionTag n="03" label="Portofolio" />
          <div className="flex items-end gap-10 flex-wrap mt-4">
            <h2 ref={headingRef} className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Proyek &amp; Sertifikat
            </h2>
            <div className="flex items-center gap-8 border-b border-border">
              {(["proyek", "sertifikat"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  data-cursor-hover
                  className={`relative pb-3 text-sm capitalize transition-colors ${
                    tab === t ? "text-white" : "text-muted hover:text-white"
                  }`}
                >
                  {t}
                  {tab === t && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute left-0 right-0 -bottom-px h-[2px] bg-white"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x, paddingLeft: leftPad, willChange: "transform" }}
          className="flex gap-6 sm:gap-8 pr-6 sm:pr-10 shrink-0 items-start"
        >
          {tab === "proyek" ? (
            <>
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}

              {/* End card */}
              <div className="shrink-0 w-[320px]">
                <div className="h-[44vw] sm:h-[191px] lg:h-[214px] flex flex-col items-center justify-center gap-5">
                  <p className="text-muted text-sm">Want to see more?</p>
                  <a
                    href="https://github.com/dhiksn"
                    target="_blank"
                    data-cursor-hover
                    className="group flex items-center gap-0 rounded-full border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center w-11 h-11 border-r border-white/20 group-hover:border-white/40 transition-colors shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                    <span className="relative px-9 font-mono text-xs font-bold tracking-widest uppercase whitespace-nowrap self-stretch flex items-center overflow-hidden before:absolute before:inset-0 before:bg-white before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 group-hover:before:translate-y-0 group-hover:text-black transition-colors duration-300">
                      <span className="relative z-10">Lihat di GitHub</span>
                    </span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            certificates.map((c, i) => (
              <CertificateCard
                key={c.id}
                certificate={c}
                index={i}
                onOpen={() => openCert(i)}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [tab, setTab] = useState<"proyek" | "sertifikat">("proyek");
  const [certIndex, setCertIndex] = useState<number | null>(null);

  const openCert = (idx: number) => setCertIndex(idx);
  const closeCert = () => setCertIndex(null);
  const navigateCert = (dir: number) => {
    if (certIndex === null) return;
    const next = (certIndex + dir + certificates.length) % certificates.length;
    setCertIndex(next);
  };

  return (
    <section id="portofolio" className="section">
      <PortfolioHorizontalScroll tab={tab} setTab={setTab} openCert={openCert} />

      <AnimatePresence>
        {certIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCert}
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          >
            <button
              onClick={closeCert}
              data-cursor-hover
              className="absolute top-5 right-5 text-white/70 hover:text-white"
            >
              <X size={26} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateCert(-1);
              }}
              data-cursor-hover
              className="absolute left-3 sm:left-8 text-white/60 hover:text-white p-2"
            >
              <ChevronLeft size={28} />
            </button>
            <motion.img
              key={certIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              src={certificates[certIndex].image}
              alt={certificates[certIndex].title}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateCert(1);
              }}
              data-cursor-hover
              className="absolute right-3 sm:right-8 text-white/60 hover:text-white p-2"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}