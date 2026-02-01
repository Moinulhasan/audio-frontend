"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, User, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";
import { SocialLogin } from "@/components/SocialLogin";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await apiFetch('/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "Registration failed. Please check your details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSuccess = async (data: any) => {
        // for signup, it might be same as login since social login creates account if not exists
        localStorage.setItem("auth_token", data.access_token);
        try {
            const profileData = await apiFetch("/me");
            localStorage.setItem("user_session", JSON.stringify(profileData));
            router.push("/profile");
        } catch (err) {
            console.error("Failed to fetch profile after social signup", err);
            router.push("/profile");
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
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        Join EcoNotes
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                        Experience the future of transcription
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-tight text-center"
                    >
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
                        <span className="bg-white dark:bg-[#121214] px-4">Or use your email</span>
                    </div>
                </div>

                {/* Signup Form */}
                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Check your email</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            We&apos;ve sent a verification link to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                            Please click the link to verify your account.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest text-xs"
                        >
                            Go to login
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                required
                                placeholder="Full name"
                                className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                                placeholder="Create password"
                                className="w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="px-1 mb-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-white/10 text-blue-600 focus:ring-blue-500/20 bg-transparent" />
                                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors tracking-tight">
                                    I agree to the <Link href="#" className="font-bold text-blue-600">Terms of Service</Link> and <Link href="#" className="font-bold text-blue-600">Privacy Policy</Link>
                                </span>
                            </label>
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
                                    Create Account
                                    <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <p className="text-center mt-10 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
