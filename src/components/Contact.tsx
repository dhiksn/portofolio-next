"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, MapPin, Send } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Reveal, SectionTag, SplitReveal } from "@/components/Reveal";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 3500);
  };

  const inputCls =
    "w-full bg-transparent border-b border-border py-3 text-sm text-white placeholder:text-dim focus:outline-none focus:border-white transition-colors";

  return (
    <section id="kontak" className="section py-24 sm:py-32">
      <div className="container-x">
        <SectionTag n="04" label="Kontak" />

        <Reveal>
          <h2 className="big-heading font-semibold max-w-3xl">
            Mari<span className="text-white/35"> berdiskusi.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <a
            href={`mailto:${profile.email}`}
            data-cursor-hover
            className="group inline-flex items-center gap-3 text-xl sm:text-2xl text-white/80 hover:text-white transition-colors border-b border-border2 hover:border-white pb-1"
          >
            {profile.email}
            <ArrowUpRight
              size={22}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </a>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6">
              {[
                {
                  icon: WhatsAppIcon,
                  label: "WhatsApp",
                  value: profile.whatsapp,
                  href: profile.whatsappLink,
                },
              ].map((it) => (
                <a
                  key={it.label}
                  href={it.href}
                  target="_blank"
                  data-cursor-hover
                  className="group flex items-center justify-between border-b border-border pb-4"
                >
                  <div className="flex items-center gap-3">
                    <it.icon size={16} />
                    <span className="text-sm text-muted">{it.label}</span>
                  </div>
                  <span className="text-sm text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {it.value} <ArrowUpRight size={14} />
                  </span>
                </a>
              ))}

              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-dim" />
                  <span className="text-sm text-muted">Lokasi</span>
                </div>
                <span className="text-sm text-white">{profile.location}</span>
              </div>

              <div className="flex items-center gap-6 mt-4">
                {[
                  { label: "GitHub", href: profile.github },
                  { label: "LinkedIn", href: profile.linkedin },
                  { label: "Instagram", href: profile.instagram },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    data-cursor-hover
                    className="font-mono text-xs text-dim hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form onSubmit={submit} className="flex flex-col gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama"
                  className={inputCls}
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className={inputCls}
                />
              </div>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Subjek"
                className={inputCls}
              />
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Pesan Anda..."
                className={`${inputCls} resize-none`}
              />
              <motion.button
                whileHover={{ x: 4 }}
                type="submit"
                data-cursor-hover
                className="mt-2 inline-flex items-center gap-2 self-start bg-white text-black text-sm font-medium rounded-full px-6 py-3.5 hover:bg-white/90 transition-colors"
              >
                {status === "sent" ? (
                  <>
                    <CheckCircle2 size={16} /> Terkirim
                  </>
                ) : (
                  <>
                    Kirim Pesan <Send size={15} />
                  </>
                )}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
