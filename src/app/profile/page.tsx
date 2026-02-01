"use client";

import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  History,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Send,
  Settings,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Feedback States
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/me");
        setSession(data);
        localStorage.setItem("user_session", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch profile", err);
        // apiFetch handles 401 redirect
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFeedback = async () => {
      try {
        const data = await apiFetch("/feedback");
        setFeedbackMessages(data);
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      }
    };

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfile();
    fetchFeedback();

    // Poll for new feedback messages every 10 seconds
    const interval = setInterval(fetchFeedback, 10000);

    const savedTheme =
      (localStorage.getItem("echoscript_theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);

    return () => clearInterval(interval);
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

  const handleSignOut = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch (e) {
      console.error("Sign out error", e);
    } finally {
      localStorage.removeItem("user_session");
      localStorage.removeItem("auth_token");
      router.push("/login");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPassError("New passwords do not match.");
      return;
    }
    setIsUpdatingPass(true);
    setPassError("");
    setPassSuccess("");

    try {
      await apiFetch("/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwords.current,
          password: passwords.new,
          password_confirmation: passwords.confirm
        })
      });
      setPassSuccess("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setTimeout(() => setIsSecurityModalOpen(false), 2000);
    } catch (err: any) {
      setPassError(err.message || "Failed to update password.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSendingFeedback(true);
    try {
      const data = await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify({ message: newMessage })
      });
      setFeedbackMessages([...feedbackMessages, data]);
      setNewMessage("");
    } catch (err: any) {
      console.error("Failed to send feedback", err);
    } finally {
      setIsSendingFeedback(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] flex items-center justify-center">
        <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const {
    user,
    subscription,
    transcribe_history,
    used_token_count,
    token_limit,
  } = session;

  const statsData = [
    {
      label: "Transcriptions",
      value: transcribe_history.length,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      suffix: subscription?.plan_name === "Starter" ? "/ 4" : "",
    },
    {
      label: "Tokens Used",
      value: used_token_count,
      icon: Clock,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      suffix: `/ ${token_limit}`,
    },
    {
      label: "Subscription",
      value: subscription?.status || "InActive",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] selection:bg-blue-100 dark:selection:bg-blue-900/30">
      {/* Header omitted for brevity in targetContent match but keep it same */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
              title={
                !isLoading && theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {!isLoading && theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
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
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#121214] flex items-center justify-center text-gray-900 dark:text-white overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10" />
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-bold dark:text-white tracking-tight">
                  {user.name}
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    {subscription?.plan_name || "Starter Plan"}
                  </span>
                  {user.email_verified_at && (
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
                  { label: "Transcription History", icon: History, onClick: () => { } },
                  {
                    label: "Billing & Subscription",
                    icon: CreditCard,
                    onClick: () => { },
                  },
                  { label: "Security Settings", icon: Shield, onClick: () => setIsSecurityModalOpen(true) },
                  { label: "Support & Feedback", icon: MessageSquare, onClick: () => setIsFeedbackOpen(true) },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[15px] font-bold dark:text-white tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {statsData.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white dark:bg-[#121214] border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl shadow-blue-500/5"
                >
                  <div
                    className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h4 className="text-2xl font-bold dark:text-white tracking-tight mb-1">
                      {stat.value}
                    </h4>
                    {stat.suffix && (
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    {stat.label}
                  </p>
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
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold dark:text-white tracking-tight">
                    Recent Activity
                  </h3>
                  {subscription?.plan_name === "Starter" && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                      Last 4 files only
                    </span>
                  )}
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest">
                  View All
                </button>
              </div>

              {transcribe_history.length > 0 ? (
                <div className="space-y-4">
                  {transcribe_history.map((doc: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 text-xs font-bold">
                          {doc.language.toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold dark:text-white tracking-tight">
                            Transcription #{doc.id}
                          </h5>
                          <p className="text-xs font-medium text-gray-500 tracking-tight">
                            {new Date(doc.created_at).toLocaleDateString()}{" "}
                            &bull; {doc.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {doc.type}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-blue-600/10 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                    No activity found yet.
                  </p>
                  <Link href="/">
                    <p className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest cursor-pointer">
                      Start Transcribing
                    </p>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Transcription Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold">
                      {selectedDoc.language.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold dark:text-white tracking-tight">
                        Transcription Details
                      </h3>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        {selectedDoc.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/5 dark:bg-black/20 rounded-3xl p-6 border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Content
                      </h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedDoc.processed_data || selectedDoc.raw_text,
                          );
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        {isCopied ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clipboard className="w-3.5 h-3.5" />
                        )}
                        {isCopied ? "COPIED" : "COPY"}
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-hide text-[15px] leading-relaxed dark:text-gray-300 prose dark:prose-invert prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/5">
                      {selectedDoc.processed_data ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {selectedDoc.processed_data}
                        </ReactMarkdown>
                      ) : (
                        <p>{selectedDoc.raw_text}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-600/5 border border-blue-600/10 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium dark:text-gray-300">
                        Processed on{" "}
                        {new Date(selectedDoc.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-400">
                      ID: #{selectedDoc.id}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security (Change Password) Modal */}
      <AnimatePresence>
        {isSecurityModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold dark:text-white tracking-tight">Security Settings</h3>
                    <p className="text-sm font-medium text-gray-500 tracking-tight">Update your password security</p>
                  </div>
                  <button
                    onClick={() => setIsSecurityModalOpen(false)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {passSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-tight text-center flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {passSuccess}
                  </motion.div>
                )}

                {passError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-tight text-center flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-red-400" />
                    {passError}
                  </motion.div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 font-medium text-sm dark:text-white dark:placeholder:text-gray-600 tracking-tight"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPass || !!passSuccess}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 tracking-tight disabled:opacity-50"
                  >
                    {isUpdatingPass ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "Update Password"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Feedback (Support) Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col h-[600px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#121214] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white tracking-tight">Support & Feedback</h3>
                    <p className="text-xs font-medium text-gray-500 tracking-tight">One-to-one with our assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFeedbackOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-hide bg-gray-50/50 dark:bg-black/20">
                {feedbackMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/5 flex items-center justify-center text-blue-600 mb-4 opacity-50">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold dark:text-white mb-2">How can we help?</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send us your feedback or questions and our assistant will get back to you personally.</p>
                  </div>
                ) : (
                  feedbackMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.is_from_admin ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium tracking-tight ${msg.is_from_admin
                        ? "bg-white dark:bg-[#1c1c1f] text-gray-800 dark:text-gray-200 border border-black/5 dark:border-white/5 shadow-sm"
                        : "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                        }`}>
                        {msg.message}
                        <div className={`text-[10px] mt-1.5 opacity-50 font-bold ${msg.is_from_admin ? "text-gray-400" : "text-white/70"}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Input */}
              <div className="p-6 bg-white dark:bg-[#121214] border-t border-black/5 dark:border-white/5">
                <form onSubmit={handleSendFeedback} className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full pl-6 pr-14 py-3.5 bg-black/5 dark:bg-white/[0.03] border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 text-sm dark:text-white font-medium tracking-tight"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSendingFeedback}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
