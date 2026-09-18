import { skills } from "@/data/portfolio";

export default function Skills() {
  const doubled = [...skills, ...skills];
  const reversed = [...skills].reverse();
  const doubledRev = [...reversed, ...reversed];

  return (
    <section className="py-14 sm:py-20 border-y border-border overflow-hidden bg-bg2/40 flex flex-col gap-3 sm:gap-4">
      <div className="marquee-wrap overflow-hidden">
        <div className="marquee-track">
          {doubled.map((s, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-2xl sm:text-4xl font-semibold tracking-tight text-transparent px-4 sm:px-6 whitespace-nowrap [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]">
                {s}
              </span>
              <span className="text-dim text-lg">&#10022;</span>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee-wrap overflow-hidden">
        <div className="marquee-track" style={{ animationDirection: "reverse" }}>
          {doubledRev.map((s, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-2xl sm:text-4xl font-semibold tracking-tight text-white/85 px-4 sm:px-6 whitespace-nowrap">
                {s}
              </span>
              <span className="text-dim text-lg">&#10022;</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
