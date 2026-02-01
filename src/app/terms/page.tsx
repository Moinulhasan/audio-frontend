"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Scale, FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
                        Terms <span className="text-blue-600">& Conditions</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: Scale, title: "Fair Usage", text: "Respect the platform and other users' rights while using our services." },
                        { icon: FileText, title: "Content Ownership", text: "You retain full ownership of the audio and text you process here." },
                        { icon: AlertCircle, title: "Liability", text: "We provide the service 'as-is' without specific warranties." },
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing or using EcoNotes, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of Service</h2>
                        <p className="mb-4">
                            You agree to use our service only for lawful purposes. You must not use our service to process content that is illegal, harmful, threatening, abusive, harassment, defamatory, or otherwise objectionable.
                        </p>
                        <p>
                            We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any user who violates these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Intellectual Property</h2>
                        <p>
                            The service and its original content (excluding content provided by you) features and functionality are and will remain the exclusive property of EcoNotes and its licensors. You contribute your content to the platform for processing, but you retain all ownership rights to your original files and the resulting transcriptions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Limitation of Liability</h2>
                        <p>
                            In no event shall EcoNotes, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at <a href="mailto:legal@econotes.com" className="text-blue-600 hover:underline">legal@econotes.com</a>.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
