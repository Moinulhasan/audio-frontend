"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Cpu, FileText, Mic, Upload, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function ProcessSimulation() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto mb-20 relative h-[300px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-echo-accent/20 to-purple-600/20 blur-[60px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <div className="relative w-full h-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    />
                </div>

                {/* Content Switcher */}
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-xl mb-2 z-10 relative">
                                    <Upload className="w-10 h-10" />
                                </div>
                                {/* Floating particles */}
                                <motion.div
                                    className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full blur-md"
                                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Audio</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or record instantly</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="w-full flex items-center justify-center gap-1 h-20">
                                {[...Array(7)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                                        animate={{ height: [20, 60, 20] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Processing</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing speech patterns...</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-24 bg-white rounded-xl p-3 shadow-2xl relative overflow-hidden">
                                <motion.div
                                    className="w-full h-2 bg-gray-200 rounded-full mb-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: "80%" }}
                                    transition={{ delay: 0.2 }}
                                />
                                <motion.div
                                    className="w-full h-2 bg-gray-200 rounded-full mb-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.3 }}
                                />
                                <motion.div
                                    className="w-full h-2 bg-gray-200 rounded-full mb-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: "90%" }}
                                    transition={{ delay: 0.4 }}
                                />
                                <motion.div
                                    className="w-full h-2 bg-gray-200 rounded-full mb-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: "60%" }}
                                    transition={{ delay: 0.5 }}
                                />
                                <div className="absolute bottom-2 right-2 text-green-500">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready!</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Transcription complete</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Steps Indicators */}
                <div className="absolute bottom-6 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? 'bg-gray-900 dark:bg-white w-6' : 'bg-black/20 dark:bg-white/20'}`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}

export function HowItWorks() {
    const steps = [
        {
            icon: <div className="flex gap-2"><Upload className="w-6 h-6" /><Mic className="w-6 h-6" /></div>,
            title: "1. Upload or Record",
            description: "Simply drag & drop your audio/video file or record your voice directly in the browser.",
            color: "from-blue-400 to-cyan-300"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "2. AI Processing",
            description: "Our advanced AI analyzes your audio with high precision, filtering noise and enhancing clarity.",
            color: "from-purple-400 to-pink-300"
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "3. Instant Transcription",
            description: "Get accurate text output in seconds. Copy, download, or edit your transcription immediately.",
            color: "from-amber-400 to-orange-300"
        }
    ];

    return (
        <section className="w-full max-w-6xl mx-auto py-20 px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 mb-6">
                    Effortless Transcription
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                    Experience the power of effortless audio-to-text conversion.
                    EcoNotes uses state-of-the-art AI to transform your speech into organized notes.
                </p>

                <ProcessSimulation />

            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300 h-full shadow-lg shadow-black/5 dark:shadow-none">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
