"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@echonotestudio.com";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            await apiFetch("/contact", {
                method: "POST",
                body: JSON.stringify(data),
            });
            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] selection:bg-blue-100 dark:selection:bg-blue-900/30 font-sans transition-colors duration-500 pt-24 pb-20 px-6">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left Column - Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Get in <span className="text-blue-600">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
                            Have questions, suggestions, or just want to say hello? We'd love to hear from you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 bg-white dark:bg-[#121214] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                                <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">For general inquiries and support</p>
                                    <a href={`mailto:${supportEmail}`} className="text-blue-600 font-medium hover:underline">{supportEmail}</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-white dark:bg-[#121214] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                                <div className="p-3 bg-purple-600/10 rounded-xl text-purple-600">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Live Chat</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Available Mon-Fri, 9am - 5pm</p>
                                    <span className="text-gray-400 text-sm italic">Coming soon...</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-[#121214] p-8 md:p-10 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl shadow-black/5"
                    >
                        {status === "success" ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-500 dark:text-gray-400">We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-8 text-blue-600 font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={4}
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                {status === "error" && (
                                    <p className="text-red-500 text-sm font-medium">Something went wrong. Please try again.</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-600 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                                >
                                    {status === "submitting" ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
