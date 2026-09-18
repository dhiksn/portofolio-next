"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const lineVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const wordVariants: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
  },
};

export function SplitReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={lineVariants}
      transition={{ delayChildren: delay }}
      className={`inline ${className}`}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom mr-[0.28em]">
          <motion.span variants={wordVariants} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <Reveal className="flex items-center gap-3 mb-4">
      <span className="font-mono text-xs text-dim">{n}</span>
      <span className="w-8 h-px bg-border2" />
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-dim">
        {label}
      </span>
    </Reveal>
  );
}
