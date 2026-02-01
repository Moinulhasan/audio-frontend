"use client";

import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const data = await apiFetch("/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            setSuccessMsg(data.message || "Reset link sent successfully! Please check your email.");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-500/5"
            >
                <div className="mb-10">
                    <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest mb-6">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                        No worries, we&apos;ll send you reset instructions.
                    </p>
                </div>

                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-tight text-center flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {successMsg}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-tight text-center flex items-center justify-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !!successMsg}
                        className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Send Reset Link
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
