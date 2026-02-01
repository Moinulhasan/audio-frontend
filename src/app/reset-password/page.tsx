"use client";

import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/api";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid or missing reset token.");
        }
    }, [token, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const data = await apiFetch("/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });
            setSuccessMsg("Password reset successfully! Redirecting to login...");
            setTimeout(() => router.push("/login"), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to reset password. The link might be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px] bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-500/5"
        >
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Reset Password
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                    Enter your new secure password below.
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
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="password"
                        required
                        placeholder="New password"
                        className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="password"
                        required
                        placeholder="Confirm new password"
                        className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !!successMsg || !token}
                    className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Update Password
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-blue-600" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
