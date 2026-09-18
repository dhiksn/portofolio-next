"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { profile } from "@/data/portfolio";
import { SplitReveal } from "@/components/Reveal";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse position relative to center of hero, normalized -1 to 1
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(nx * 2); // -1..1
      mouseY.set(ny * 2);
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  // Parallax depth layers - deeper factor = moves more
  const blobX = useTransform(springX, [-1, 1], [-40, 40]);
  const blobY = useTransform(springY, [-1, 1], [-30, 30]);

  const gridX = useTransform(springX, [-1, 1], [-15, 15]);
  const gridY = useTransform(springY, [-1, 1], [-15, 15]);

  const dot1X = useTransform(springX, [-1, 1], [60, -60]);
  const dot1Y = useTransform(springY, [-1, 1], [40, -40]);

  const dot2X = useTransform(springX, [-1, 1], [-80, 80]);
  const dot2Y = useTransform(springY, [-1, 1], [50, -50]);

  const dot3X = useTransform(springX, [-1, 1], [30, -30]);
  const dot3Y = useTransform(springY, [-1, 1], [-70, 70]);

  const contentX = useTransform(springX, [-1, 1], [-8, 8]);
  const contentY = useTransform(springY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const t = setInterval(() => {
      setRoleIndex((i) => (i + 1) % profile.roles.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="beranda"
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-24 -mt-5"
    >
      <div className="absolute inset-0 noise-bg" />

      <motion.div
        style={{ x: gridX, y: gridY }}
        className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]"
      />

      <motion.div
        style={{ x: blobX, y: blobY }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-white/[0.04] rounded-full blob"
      />

      <motion.span
        style={{ x: dot1X, y: dot1Y }}
        className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-white/20 pointer-events-none"
      />
      <motion.span
        style={{ x: dot2X, y: dot2Y }}
        className="absolute top-[65%] left-[80%] w-1.5 h-1.5 rounded-full bg-white/15 pointer-events-none"
      />
      <motion.span
        style={{ x: dot3X, y: dot3Y }}
        className="absolute top-[40%] left-[70%] w-3 h-3 rounded-full border border-white/20 pointer-events-none"
      />

      <motion.div
        style={{ y, opacity, x: contentX }}
        className="container-x relative z-10 sm:pl-40"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-dim">
            Open to opportunities
          </span>
        </div>

        <h1 className="big-heading font-semibold">
          <div className="overflow-hidden">
            <SplitReveal text={profile.firstName} />
          </div>
          <div className="overflow-hidden">
            <SplitReveal text={profile.lastName} className="text-white/35 font-light" delay={0.08} />
          </div>
        </h1>

        <div className="mt-8 grid sm:grid-cols-[180px_1fr] gap-x-10 gap-y-6 items-center max-w-3xl">
          <div className="h-8 overflow-hidden">
            <p key={roleIndex} className="font-mono text-base text-white/75 animate-fadeUp whitespace-nowrap">
              {profile.roles[roleIndex]}
            </p>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-muted leading-relaxed max-w-md"
          >
            {profile.desc}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <button
            onClick={() => scrollTo("portofolio")}
            data-cursor-hover
            className="group relative inline-flex items-center gap-2 overflow-hidden bg-white text-black text-sm font-medium rounded-full px-6 py-3"
          >
            <span className="relative z-10">Lihat Karya</span>
          </button>
          <button
            onClick={() => scrollTo("kontak")}
            data-cursor-hover
            className="text-sm font-medium border border-border2 rounded-full px-6 py-3 text-white hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            Hubungi Saya
          </button>

          <div className="flex items-center gap-4 ml-1">
            {[
              { href: profile.github, icon: Github },
              { href: profile.linkedin, icon: Linkedin },
              { href: profile.instagram, icon: Instagram },
            ].map(({ href, icon: Icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                data-cursor-hover
                className="text-dim hover:text-white transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}