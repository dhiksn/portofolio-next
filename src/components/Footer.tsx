"use client";

import { Github, Linkedin, Instagram } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";

export default function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="container-x">
        <Reveal>
          <button
            onClick={() =>
              document.getElementById("beranda")?.scrollIntoView({ behavior: "smooth" })
            }
            data-cursor-hover
            className="text-5xl sm:text-7xl font-semibold tracking-tight text-white/10 hover:text-white/25 transition-colors mb-10 block"
          >
            dhiksn.
          </button>
        </Reveal>
      </div>
      <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <div className="font-mono text-lg text-white">
            AR<span className="text-dim">.</span>
          </div>
          <p className="text-sm text-muted text-center sm:text-left">
            {profile.firstName} {profile.lastName} | System Administrator & IT Support.
          </p>
          <div className="flex items-center gap-4">
            <a href={profile.github} target="_blank" data-cursor-hover className="text-dim hover:text-white transition-colors" aria-label="GitHub">
              <Github size={17} />
            </a>
            <a href={profile.linkedin} target="_blank" data-cursor-hover className="text-dim hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
            <a href={profile.instagram} target="_blank" data-cursor-hover className="text-dim hover:text-white transition-colors" aria-label="Instagram">
              <Instagram size={17} />
            </a>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-sm text-muted">© 2026 {profile.firstName} {profile.lastName}. All rights reserved.</p>
          <p className="text-xs text-dim mt-1">{profile.location}</p>
        </div>
      </div>
    </footer>
  );
}
