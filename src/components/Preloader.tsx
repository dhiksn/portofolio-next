"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="fixed inset-0 z-[300] bg-bg flex items-center justify-center"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              className="block font-mono text-sm tracking-[0.3em] text-white/70 uppercase"
            >
              [ dhiksn ]
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
