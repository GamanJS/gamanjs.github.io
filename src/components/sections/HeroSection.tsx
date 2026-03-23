import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
} from "framer-motion";

export default function HeroSection() {
  const { scrollYProgress, scrollY } = useScroll();
  const [direction, setDirection] = useState<"up" | "down">("down");

  // ? Deteksi arah scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setDirection((prev) => {
      const diff = latest - scrollY.getPrevious()!;
      if (diff > 0) return "down";
      if (diff < 0) return "up";
      return prev;
    });
  });

  // ? Gerakan horizontal (jalan)
  const x = useTransform(scrollYProgress, [0, 0.3], ["10vw", "-100vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

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
    <section className="relative flex flex-col items-center justify-center text-center px-6 h-[100dvh] overflow-hidden">

      <div className="absolute inset-0 bg-[url('/img/bg-turtle-pink.png')] bg-cover bg-bg-primary/50 bg-blend-multiply before:absolute before:inset-0 before:bg-gradient-to-t before:from-bg-primary before:via-bg-primary/60 before:to-transparent after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1),_transparent_70%)]" />

      <div className="absolute -top-20 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute -top-20 right-0 w-[28rem] h-[28rem] bg-indigo-600/20 rounded-full blur-[180px] animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Heavy-Duty
          </span>{" "}
          Enterprise Performance
        </h1>

        <p className="text-lg md:text-xl md:max-w-3xl text-text-primary leading-relaxed mb-10">
          GamanJS is a lean framework engineered for heavy-duty enterprise workloads. Built on the Bun runtime, it delivers unparalleled speed, uncompromised stability, and a clean architecture that scales with your business.
        </p>

        <a
          href="/docs"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 hover:scale-105 transition-all"
        >
          Get Started
        </a>
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
