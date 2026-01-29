import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Terminal, PenTool } from "lucide-react";
import Image from "next/image";

const MODELS = [
    {
        title: "Meetings",
        description: "Turn hour-long calls into concise executive summaries and action items.",
        icon: Briefcase,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", // Using high quality Unsplash as default but UI ready for assets
        color: "bg-emerald-500"
    },
    {
        title: "Education",
        description: "Convert lectures into study guides, quiz questions, and flashcards.",
        icon: GraduationCap,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
        color: "bg-cyan-500"
    },
    {
        title: "Development",
        description: "Speak your logic. EcoNotes extracts code snippets and documentation.",
        icon: Terminal,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
        color: "bg-indigo-500"
    },
    {
        title: "Creativity",
        description: "Draft blog posts, newsletters, and social content from voice notes.",
        icon: PenTool,
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
        color: "bg-rose-500"
    }
];

export function ModelShowcase() {
    return (
        <section className="w-full max-w-7xl mx-auto py-24 px-4 relative z-10">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
                >
                    One Engine. <span className="text-gray-400 dark:text-gray-500">Infinite Possibilities.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400 text-lg font-medium tracking-tight"
                >
                    Tailored AI models for every workflow.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MODELS.map((model, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex flex-col bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden hover:border-black/10 dark:hover:border-white/10 shadow-sm dark:shadow-none transition-all duration-500"
                    >
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={model.image}
                                alt={model.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-40 dark:opacity-60 group-hover:opacity-100"
                            />
                            {/* Badge Overlay */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                                <div className={`${model.color} p-1.5 rounded-lg text-white shadow-lg`}>
                                    <model.icon className="w-4 h-4" />
                                </div>
                                <span className="text-gray-900 dark:text-white font-bold text-sm">{model.title}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col gap-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed tracking-tight min-h-[60px]">
                                {model.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
