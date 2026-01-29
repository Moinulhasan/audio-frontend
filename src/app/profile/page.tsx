"use client";

import { motion } from "framer-motion";
import {
    User,
    Mail,
    Settings,
    LogOut,
    History,
    Shield,
    ChevronRight,
    Clock,
    FileText,
    CreditCard,
    Loader2,
    Sun,
    Moon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function ProfilePage() {
    const [session, setSession] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const router = useRouter();

    useEffect(() => {
        const savedSession = localStorage.getItem("user_session");
        const token = localStorage.getItem("auth_token");

        if (!savedSession || !token) {
            router.push("/login");
            return;
        }

        setSession(JSON.parse(savedSession));

        const savedTheme = (localStorage.getItem("echoscript_theme") as "light" | "dark") || "dark";
        setTheme(savedTheme);

        setIsLoading(false);
    }, [router]);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("echoscript_theme", newTheme);
    };

    const handleSignOut = () => {
        localStorage.removeItem("user_session");
        localStorage.removeItem("auth_token");
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const { user, stats, history } = session;

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] selection:bg-blue-100 dark:selection:bg-blue-900/30">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
                            title={!isLoading && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {!isLoading && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm transition-all hover:bg-red-500/20 active:scale-[0.98] tracking-tight"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 overflow-hidden relative"
                        >
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 mb-4 shadow-lg shadow-blue-500/20">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-[#121214] flex items-center justify-center text-gray-900 dark:text-white">
                                        <User className="w-10 h-10" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold dark:text-white tracking-tight">{user.name}</h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight flex items-center gap-2 mt-1">
                                    <Mail className="w-3.5 h-3.5" />
                                    {user.email}
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                        {user.plan}
                                    </span>
                                    {user.verified && (
                                        <span className="px-3 py-1 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
                        </motion.div>

                        {/* Menu Links */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-4 shadow-xl shadow-blue-500/5"
                        >
                            <div className="flex flex-col gap-1">
                                {[
                                    { label: "Transcription History", icon: History, href: "#" },
                                    { label: "My Files", icon: FileText, href: "#" },
                                    { label: "Billing & Subscription", icon: CreditCard, href: "#" },
                                    { label: "Security Settings", icon: Shield, href: "#" },
                                ].map((item, i) => (
                                    <Link key={i} href={item.href} className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[15px] font-bold dark:text-white tracking-tight">{item.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content Info */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: "Transcriptions", value: stats.transcriptionsCount, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { label: "Minutes Saved", value: stats.minutesSaved, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                                { label: "Current Plan", value: stats.currentPlan, icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl shadow-blue-500/5"
                                >
                                    <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-3xl font-bold dark:text-white tracking-tight mb-1">{stat.value}</h4>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold dark:text-white tracking-tight">Recent Activity</h3>
                                <button className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest">View All</button>
                            </div>

                            {history.length > 0 ? (
                                <div className="space-y-4">
                                    {history.map((doc: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold dark:text-white tracking-tight">{doc.title}</h5>
                                                    <p className="text-xs font-medium text-gray-500 tracking-tight">{doc.date} &bull; {doc.size}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                {doc.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                                        <History className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">No activity found yet.</p>
                                    <Link href="/">
                                        <button className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest">
                                            Start Transcribing
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
