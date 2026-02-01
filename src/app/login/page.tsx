"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { SocialLogin } from "@/components/SocialLogin";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const verified = searchParams.get("verified");
        const statusError = searchParams.get("error");

        if (verified === "true") {
            setSuccessMsg("Email verified successfully! You can now log in.");
        } else if (verified === "already") {
            setSuccessMsg("Email is already verified. Please log in.");
        } else if (verified === "false") {
            setError(statusError === "invalid_hash" ? "Invalid or expired verification link." : "Verification failed.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            // Handle Session
            localStorage.setItem("auth_token", data.access_token);

            // Fetch user profile immediately after login to populate session
            const profileData = await apiFetch("/me");
            localStorage.setItem("user_session", JSON.stringify(profileData));

            // Redirect to Profile
            router.push("/profile");
        } catch (err: any) {
            if (err.status === 403) {
                setError("Your email is not verified. Please check your inbox.");
            } else {
                setError(err.message || "Invalid credentials. Try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSuccess = async (data: any) => {
        localStorage.setItem("auth_token", data.access_token);
        try {
            const profileData = await apiFetch("/me");
            localStorage.setItem("user_session", JSON.stringify(profileData));
            router.push("/profile");
        } catch (err) {
            console.error("Failed to fetch profile after social login", err);
            router.push("/profile");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px] bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-500/5"
        >
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                    Continue your journey with EcoNotes
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

            {/* Social Logins */}
            <SocialLogin
                onSuccess={handleSocialSuccess}
                onError={setError}
                isLoading={isLoading}
                setLoading={setIsLoading}
            />

            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/5 dark:border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                    <span className="bg-white dark:bg-[#121214] px-4">Or continue with</span>
                </div>
            </div>

            {/* Email Form */}
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="email"
                        required
                        placeholder="Email address"
                        className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="password"
                        required
                        placeholder="Password"
                        className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between px-1 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-blue-600 focus:ring-blue-500/20 bg-transparent" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors uppercase tracking-tight">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-tight">
                        Forgot?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center mt-10 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
                    Sign up for free
                </Link>
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <Suspense fallback={
                <div className="flex items-center justify-center w-full max-w-[420px] h-[500px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            }>
                <LoginContent />
            </Suspense>
        </div>
    );
}
