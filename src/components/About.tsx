"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { about, profile } from "@/data/portfolio";
import { Reveal, SectionTag } from "@/components/Reveal";

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1100;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setVal(Math.round(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val}</span>;
}

export default function About() {
  return (
    <section id="tentang" className="section py-24 sm:py-32">
      <div className="container-x">
        <SectionTag n="01" label="Tentang" />

        {/* Heading */}
        <Reveal className="mt-4 mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
            Siswa TJKT —{" "}
            <span className="text-white/40">fokus di keamanan &amp; jaringan.</span>
          </h2>
        </Reveal>

        {/* Content */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
          {/* Foto */}
          <Reveal>
            <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border border-border">
              <motion.div
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                style={{ originY: 0 }}
                className="absolute inset-0 bg-bg z-10"
              />
              <img
                src={profile.photo}
                alt={profile.firstName}
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>

          {/* Teks + counter */}
          <div>
            <Reveal>
              <p className="text-lg sm:text-xl text-white/85 leading-relaxed">
                {about.intro}
              </p>
            </Reveal>

            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)} className="mt-4">
                <p className="text-muted leading-relaxed">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2} className="mt-10 grid grid-cols-2 gap-4 max-w-xs">
              {about.counters.map((c) => (
                <div
                  key={c.label}
                  className="border border-border rounded-xl p-5 bg-bg2 hover:border-white/20 transition-colors"
                >
                  <strong className="block text-4xl font-semibold text-white tabular-nums">
                    <Counter target={c.value} />+
                  </strong>
                  <span className="text-sm text-muted">{c.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
