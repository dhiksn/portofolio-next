"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/data/portfolio";

const links = [
  { id: "beranda", label: "Home", n: "00" },
  { id: "tentang", label: "About", n: "01" },
  { id: "pendidikan", label: "Education", n: "02" },
  { id: "portofolio", label: "Projects", n: "03" },
  { id: "kontak", label: "Contact", n: "04" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("beranda");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      open ? 350 : 0
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[110] transition-all duration-300 ${
          !open && scrolled
            ? "bg-bg/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between h-16 sm:h-20">
          <button
            onClick={() => scrollTo("beranda")}
            className={`font-mono text-sm tracking-tight text-white z-[110] transition-opacity duration-300 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            data-cursor-hover
          >
            <span className="text-dim">[</span>dhiksn<span className="text-dim">]</span>
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-[120] flex items-center gap-2 text-white"
            data-cursor-hover
          >
            <span className="hidden sm:inline font-mono text-xs tracking-widest uppercase text-muted">
              {open ? "Close" : "Menu"}
            </span>
            <span className="w-9 h-9 rounded-full border border-border2 flex items-center justify-center">
              {open ? <X size={16} /> : <Menu size={16} />}
            </span>
          </button>
        </div>
      </nav>

      {/* side scroll dots */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[70] flex-col gap-4">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => scrollTo(l.id)}
            data-cursor-hover
            className="group flex items-center gap-3 justify-end"
            aria-label={l.label}
          >
            <span
              className={`text-[10px] font-mono uppercase tracking-widest transition-all ${
                active === l.id
                  ? "opacity-100 text-white translate-x-0"
                  : "opacity-0 translate-x-2 text-dim group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {l.label}
            </span>
            <span
              className={`rounded-full transition-all ${
                active === l.id
                  ? "w-2.5 h-2.5 bg-white"
                  : "w-1.5 h-1.5 bg-border2 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-bg2"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <div className="h-full flex flex-col justify-center container-x">
              <ul className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                  >
                    <button
                      onClick={() => scrollTo(l.id)}
                      data-cursor-hover
                      className="group flex items-baseline gap-5 py-3 sm:py-4"
                    >
                      <span className="font-mono text-xs text-dim">{l.n}</span>
                      <span
                        className={`text-4xl sm:text-6xl font-semibold tracking-tight transition-colors ${
                          active === l.id ? "text-white" : "text-white/30"
                        } group-hover:text-white`}
                      >
                        {l.label}
                      </span>
                      <ArrowUpRight
                        size={22}
                        className="text-dim opacity-0 group-hover:opacity-100 group-hover:text-white transition-opacity"
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-muted"
              >
                <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                  {profile.email}
                </a>
                <a href={profile.github} target="_blank" className="hover:text-white transition-colors">
                  GitHub
                </a>
                <a href={profile.linkedin} target="_blank" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href={profile.instagram} target="_blank" className="hover:text-white transition-colors">
                  Instagram
                </a>
                <a
                  href={profile.cv}
                  download="Andhika_Rafi_CV.pdf"
                  className="hover:text-white transition-colors"
                >
                  Download CV
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
