"use client";

import { motion } from "framer-motion";

export function Logo() {
    return (
        <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            whileHover="hover"
            initial="initial"
        >
            <div className="relative w-10 h-10">
                {/* Background Glow */}
                <motion.div
                    className="absolute inset-0 bg-echo-accent rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                    initial={{ scale: 0.8 }}
                    variants={{
                        hover: { scale: 1.1, rotate: 180 },
                        initial: { scale: 1, rotate: 0 }
                    }}
                    transition={{ duration: 0.4 }}
                />

                {/* Logo Container */}
                <div className="relative w-full h-full bg-gradient-to-br from-echo-accent to-purple-600 rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg">
                    {/* Animated Bars */}
                    <div className="flex items-center gap-[2px] h-5">
                        {[12, 20, 16, 24, 14].map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-white rounded-full"
                                initial={{ height: 4 }}
                                animate={{ height: h }}
                                variants={{
                                    hover: {
                                        height: [8, 20, 8],
                                        transition: {
                                            repeat: Infinity,
                                            duration: 0.8,
                                            delay: i * 0.1,
                                            repeatType: "reverse"
                                        }
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <motion.span
                    className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none"
                    variants={{
                        hover: { x: 2 }
                    }}
                >
                    EcoNotes
                </motion.span>
                <motion.span
                    className="text-[10px] text-gray-400 font-medium tracking-widest uppercase"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    variants={{
                        hover: { color: "#60A5FA", x: 2 }
                    }}
                >
                    AI Transcriber
                </motion.span>
            </div>
        </motion.div>
    );
}
