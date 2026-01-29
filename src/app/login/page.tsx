"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // --- DEMO API CALL ---
        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock validation
            if (!email || !password) {
                throw new Error("Please fill in all fields");
            }

            // Mock Response Data (Matches user request for profile/history)
            const mockResponse = {
                user: {
                    id: "1",
                    name: "Moinul Hasan",
                    email: email,
                    avatar: null,
                    verified: true,
                    plan: "Pro Member",
                },
                stats: {
                    transcriptionsCount: 24,
                    minutesSaved: 148,
                    currentPlan: "Pro",
                },
                history: [
                    { id: "h1", title: "Weekly Sync Audio", date: "2 hours ago", size: "4.2 MB", type: "Meeting Minutes" },
                    { id: "h2", title: "Project Briefing", date: "Yesterday", size: "12.8 MB", type: "Summary" },
                    { id: "h3", title: "React Native Lecture", date: "2 days ago", size: "45.0 MB", type: "Study Guide" },
                ],
                token: "demo_jwt_token_b2c5ea70",
            };

            // Handle Session
            localStorage.setItem("user_session", JSON.stringify(mockResponse));
            localStorage.setItem("auth_token", mockResponse.token);

            // Redirect to Profile
            router.push("/profile");
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Try again.");
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
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                        Continue your journey with EcoNotes
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
                <div className="flex flex-col gap-3 mb-8">
                    <button className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all duration-300 tracking-tight">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                    <button className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-[#1877F2] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all duration-300 tracking-tight shadow-lg shadow-blue-500/20">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Sign in with Facebook
                    </button>
                </div>

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
                        <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-tight">
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
        </div>
    );
}
