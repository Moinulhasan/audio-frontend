import { motion } from "framer-motion";
import { Book, Mic, Sliders, Sparkles } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            number: 1,
            icon: <Mic className="w-8 h-8 text-emerald-400" />,
            title: "Record or Upload",
            description: "Click the mic button to record voice or upload an audio file.",
            color: "bg-emerald-500",
            glow: "shadow-emerald-500/20"
        },
        {
            number: 2,
            icon: <Sliders className="w-8 h-8 text-indigo-400" />,
            title: "Select AI Mode",
            description: "Choose from Minutes, Code, Blog, or Study Guide modes.",
            color: "bg-indigo-500",
            glow: "shadow-indigo-500/20"
        },
        {
            number: 3,
            icon: <Sparkles className="w-8 h-8 text-rose-400" />,
            title: "Get Insights",
            description: "Instant structured output ready to copy or share.",
            color: "bg-rose-500",
            glow: "shadow-rose-500/20"
        }
    ];

    return (
        <section className="w-full max-w-5xl mx-auto py-12 px-4 relative z-10 text-left">
            <div className="flex items-center gap-3 mb-10">
                <Book className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    How to use EcoNotes
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pt-6"
                    >
                        {/* Step Number Circle */}
                        <div className={`absolute top-0 left-6 w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white font-bold z-20 shadow-lg ${step.glow}`}>
                            {step.number}
                        </div>

                        {/* Card Content */}
                        <div className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-3xl p-8 h-full flex flex-col gap-4 group hover:border-black/10 dark:hover:border-white/10 shadow-sm dark:shadow-none transition-all duration-300">
                            <div className="mb-2">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed tracking-tight">
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
