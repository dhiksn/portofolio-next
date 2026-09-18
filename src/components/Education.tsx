"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";
import { education } from "@/data/portfolio";
import { Reveal, SectionTag } from "@/components/Reveal";

export default function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [dotOffsets, setDotOffsets] = useState<number[]>([]);
  const [trackHeight, setTrackHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const containerTop = ref.current.getBoundingClientRect().top;
    const offsets = dotRefs.current.map((el) =>
      el ? el.getBoundingClientRect().top - containerTop + el.offsetHeight / 2 : 0
    );
    setDotOffsets(offsets);
    setTrackHeight(ref.current.offsetHeight);
  }, []);

  // Bikin step: garis berhenti PERSIS di posisi tiap dot, bukan smooth linear
  const inputRange = education.map((_, i) => i / (education.length - 1 || 1));
  const outputRange = dotOffsets.length
    ? dotOffsets
    : education.map(() => 0);

  const lineHeightPx = useTransform(scrollYProgress, inputRange, outputRange);

  return (
    <section id="pendidikan" className="section py-24 sm:py-32">
      <div className="container-x">
        <SectionTag n="02" label="Pendidikan" />
        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-16">
            Perjalanan Belajar
          </h2>
        </Reveal>

        <div ref={ref} className="relative pl-10 sm:pl-14">
          <div className="absolute left-[7px] top-[8px] bottom-[8px] w-px bg-border" />
          <motion.div
            style={{ height: lineHeightPx }}
            className="absolute left-[7px] top-[8px] w-px bg-white origin-top"
          />

          <div className="flex flex-col gap-14">
            {education.map((edu, i) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="relative"
              >
                <span
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className={`absolute -left-[41px] sm:-left-[57px] top-1 w-4 h-4 rounded-full border-2 ${
                    edu.present ? "bg-white border-white" : "bg-bg3 border-white/30"
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="w-16 h-16 rounded-xl bg-bg3 border border-border flex items-center justify-center overflow-hidden shrink-0">
                    <div className={`flex items-center justify-center ${edu.whiteBg ? "bg-white rounded-lg p-1" : ""}`}>
                      <img
                        src={edu.logo}
                        alt={edu.school}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl text-white font-medium leading-snug">
                      {edu.school}
                    </p>
                    <p className="text-sm text-muted mt-1">{edu.role}</p>
                  </div>
                  <span className="font-mono text-sm text-dim whitespace-nowrap">
                    {edu.start} <span className="mx-1">—</span>{" "}
                    <span className={edu.present ? "text-white" : ""}>{edu.end}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}