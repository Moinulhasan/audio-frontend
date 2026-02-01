"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Users, Lightbulb, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] selection:bg-blue-100 dark:selection:bg-blue-900/30 font-sans transition-colors duration-500 pt-24 pb-20 px-6">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        About <span className="text-blue-600">EcoNotes</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We are on a mission to revolutionize how people capture, organize, and utilize spoken information.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: Lightbulb, title: "Innovation", text: "Pushing the boundaries of AI transcription technology to deliver unmatched accuracy." },
                        { icon: Zap, title: "Efficiency", text: "Saving you hours of manual work by instantly converting speech to structured notes." },
                        { icon: Users, title: "Accessibility", text: "Breaking language barriers with support for multiple languages including Bengali." },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-[#121214] p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl shadow-blue-900/5 flex flex-col items-center text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-6">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 md:p-14 text-white text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-fullblur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <h2 className="text-3xl font-bold mb-6 relative z-10">Join Our Journey</h2>
                    <p className="text-blue-100 max-w-xl mx-auto mb-8 relative z-10">
                        Experience the future of note-taking today. Sign up freely and start transforming your audio into assets.
                    </p>
                    <Link href="/signup">
                        <button className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                            Get Started Free
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
