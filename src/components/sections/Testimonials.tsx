import { motion } from "framer-motion";
import { FaDiscord, FaGithub, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { SiBun } from "react-icons/si";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Senior Backend Engineer",
    content: "Looks like Laravel for Bun. Functional, modular, and incredibly fast. GamanJS is a game changer for backend development!",
    Icon: FaGithub,
    color: "text-white",
    source: "GitHub"
  },
  {
    name: "Budi Santoso",
    role: "Fullstack Developer",
    content: "Actually impressed by the performance. The functional-first approach makes it feel like OOP but without the overhead. Super lean and modular.",
    Icon: FaDiscord,
    color: "text-indigo-400",
    source: "Discord"
  },
  {
    name: "Sarah Chen",
    role: "Software Architect",
    content: "Finally a framework that doesn't get in the way. It's so fast and the type safety is just perfect. Gaman Dekinai! >//<",
    Icon: FaWhatsapp,
    color: "text-green-500",
    source: "WhatsApp"
  },
  {
    name: "Michael Smith",
    role: "CTO at TechFlow",
    content: "The modular design is top tier. Scaling feels predictable now. Great work on the v2 architecture! It's solid as a rock.",
    Icon: FaFacebook,
    color: "text-blue-600",
    source: "Facebook"
  },
  {
    name: "David Wilson",
    role: "DevOps Engineer",
    content: "Best thing that happened to my Bun stack. The transition from Express was seamless and the performance gains are real. No more bloat.",
    Icon: SiBun,
    color: "text-pink-400",
    source: "Bun"
  },
  {
    name: "Lena Parks",
    role: "Backend Lead",
    content: "I've tried many frameworks, but GamanJS feels different. The composition patterns are a breath of fresh air. Super clean codebases.",
    Icon: FaGithub,
    color: "text-white",
    source: "GitHub"
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 italic tracking-tight uppercase leading-tight">LOVED BY<br/>DEVELOPERS</h2>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                    See what our community has to say about the future of backend development with GamanJS.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all duration-500 backdrop-blur-sm"
                    >
                        <div className="absolute top-8 right-8">
                            <t.Icon className={`w-5 h-5 ${t.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white font-bold text-base">
                                {t.name[0]}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-tight leading-none">{t.name}</h4>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-2">{t.role}</p>
                            </div>
                        </div>

                        <p className="text-slate-400 leading-relaxed italic text-base relative">
                            <span className="text-blue-500/20 text-3xl absolute -top-4 -left-2 select-none font-serif">"</span>
                            {t.content}
                        </p>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Via {t.source}</span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, j) => (
                                    <svg key={j} xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-yellow-500/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
}
