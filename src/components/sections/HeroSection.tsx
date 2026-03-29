import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
} from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [copied, setCopied] = useState(false);

  // ? Deteksi arah scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setDirection((prev) => {
      const diff = latest - (scrollY.getPrevious() || 0);
      if (diff > 0) return "down";
      if (diff < 0) return "up";
      return prev;
    });
  });

  // ? Gerakan horizontal (jalan) dari kanan ke kiri
  // Kita mulai dari kanan (off-screen) ke kiri (off-screen)
  const x = useTransform(scrollYProgress, [0, 1], ["20vw", "-120vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // ? flip gambar pas scroll ke atas
  const flip = direction === "up" ? -1 : 1;

  // ? Animasi ngangguk (naik-turun kecil)
  const y = useMotionValue(0);

  useEffect(() => {
    let frame: number;
    const animate = (t: number) => {
      const amplitude = 3; // ? tinggi ngangguk
      const speed = 0.005; // ? kecepatan ngangguk
      y.set(Math.sin(t * speed) * amplitude);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [y]);

  const smoothY = useSpring(y, { stiffness: 80, damping: 10 });

  return (
    <section 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center text-center px-6 h-[100dvh] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/img/bg-turtle-pink.png')] bg-cover bg-bg-primary/40 bg-blend-multiply before:absolute before:inset-0 before:bg-gradient-to-b before:from-bg-primary/20 before:via-bg-primary before:to-bg-primary after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),_transparent_60%)]" />

      <div className="absolute top-1/4 -left-32 w-[32rem] h-[32rem] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col items-center max-w-5xl">
        <div className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-blue-300 text-sm font-semibold tracking-wide flex items-center gap-2">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            GamanJS v2.0 is now live
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-10 font-plus-jakarta">
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            A Lean Framework
          </span>{" "}
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">for Enterprise Scalability.</span>
        </h1>

        <p className="text-base md:text-lg max-w-2xl text-slate-400 leading-relaxed mb-12 font-medium font-inter">
          "Complexity doesn't have to be heavy.{" "}
          <br className="hidden md:block" />
          Built on Bun, designed for Logic, optimized for Scale."
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <a
            href="/docs"
            className="px-10 py-4 rounded-2xl bg-white text-bg-primary font-bold shadow-2xl shadow-white/10 hover:bg-slate-200 transition-all active:scale-95"
          >
            Get Started
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText("bun create gaman@latest");
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all font-mono text-sm text-slate-300 backdrop-blur-md"
          >
            <span className="text-blue-400">$</span>
            <span>bun create gaman@latest</span>
            <div className="relative">
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-blue-400 transition-colors"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent">
        <motion.img
          src="/img/new/3.png"
          alt="GamanJS Turtle"
          style={{
            x,
            y: smoothY,
            opacity,
            scaleX: flip, // ? flip arah
          }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
          }}
          className="absolute bottom-[8px] right-0 w-16 h-auto select-none pointer-events-none"
        />
      </div>
    </section>
  );
}
