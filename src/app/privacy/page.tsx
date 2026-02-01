"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
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
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Privacy <span className="text-blue-600">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: Shield, title: "Data Protection", text: "We use industry-standard encryption to protect your personal information." },
                        { icon: Lock, title: "Secure Storage", text: "Your audio files and transcriptions are stored securely and privately." },
                        { icon: Eye, title: "Transparency", text: "We are clear about what data we collect and how we use it." },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-[#121214] p-6 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-start"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-4">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#121214] p-8 md:p-12 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-sm space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information you provide directly to us, such as when you create an account, upload audio files, or contact us for support. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li>Account information (name, email address)</li>
                            <li>Audio files and their transcriptions</li>
                            <li>Usage data and interaction with our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">
                            We use the collected information for various purposes, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li>To provide, maintain, and improve our services</li>
                            <li>To process your audio files and generate transcriptions</li>
                            <li>To communicate with you about updates, security alerts, and support</li>
                            <li>To monitor and analyze trends and usage</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Your audio data is processed via secure channels and stored with encryption.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@econotes.com" className="text-blue-600 hover:underline">privacy@econotes.com</a>.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
