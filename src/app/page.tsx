"use client";

import { AdUnit } from "@/components/AdUnit";
import { HowItWorks } from "@/components/HowItWorks";
import { Logo } from "@/components/Logo";
import { ModelShowcase } from "@/components/ModelShowcase";
import axios from "axios";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  CheckSquare,
  Copy,
  Download,
  FileAudio,
  FileBadge,
  FileText,
  Globe,
  Mic,
  Moon,
  RotateCcw,
  Square,
  Sun,
  Upload,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const OUTPUT_MODES = [
  { id: "normal", label: "Verbatim", icon: FileText },
  { id: "minutes", label: "Meeting Minutes", icon: Users },
  { id: "task", label: "Task", icon: CheckSquare },
  { id: "note", label: "Note", icon: BookOpen },
  { id: "summaries", label: "Summary", icon: FileBadge },
] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [transcriptionType, setTranscriptionType] = useState<
    "normal" | "minutes" | "task" | "note" | "summaries"
  >("normal");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Core State
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [transcription, setTranscription] = useState("");
  const [responseType, setResponseType] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("echoscript_lang") as "en" | "bn";
    if (savedLang) setLanguage(savedLang);

    const savedTheme =
      (localStorage.getItem("echoscript_theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);

    // Check session
    const savedSession = localStorage.getItem("user_session");
    const token = localStorage.getItem("auth_token");
    if (savedSession && token) {
      setIsLoggedIn(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // --- Helpers ---
  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("echoscript_theme", newTheme);
  };
  const toggleLanguage = () => {
    if (!mounted) return;
    const newLang = language === "en" ? "bn" : "en";
    setLanguage(newLang);
    localStorage.setItem("echoscript_lang", newLang);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setStatus("error");
    setTimeout(() => {
      setErrorMessage("");
      setStatus("idle");
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- File Upload Logic ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (!f.type.startsWith("audio/") && !f.type.startsWith("video/")) {
      showError("Please upload a valid audio or video file.");
      return;
    }
    setFile(f);
    setRecordedAudio(null); // Clear recording if file uploaded
    setStatus("idle");
    setTranscription("");
    setErrorMessage("");
  };

  // --- Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Mute output to prevent feedback

      audioContextRef.current = audioContext;
      mediaStreamRef.current = stream;
      scriptProcessorRef.current = processor;
      audioChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        // Create a copy of the data
        audioChunksRef.current.push(new Float32Array(channelData));
      };

      source.connect(processor);
      processor.connect(gainNode);
      gainNode.connect(audioContext.destination);

      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic Error:", err);
      showError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (scriptProcessorRef.current && audioContextRef.current && isRecording) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current.onaudioprocess = null;

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioChunksRef.current.length > 0) {
        const wavBlob = encodeWAV(
          audioChunksRef.current,
          audioContextRef.current.sampleRate,
        );
        setRecordedAudio(wavBlob);
        setFile(null);
      }

      audioContextRef.current.close();
      setIsRecording(false);

      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setRecordingTime(0);
    setStatus("idle");
  };

  // --- Transcribe Logic ---
  const handleTranscribe = async () => {
    const activeFile =
      file ||
      (recordedAudio
        ? new File([recordedAudio], "recording.wav", { type: "audio/wav" })
        : null);

    if (!activeFile) return;

    setStatus("uploading");
    setStatusMessage("Uploading audio...");
    const formData = new FormData();
    formData.append("audio", activeFile);
    formData.append("language", language);
    // Map internal type to API expected values
    // Assuming backend handles: plain, minutes, tasks, summary
    // If backend only knows 'plain', we might need to adjust or if it's AI generated, the prompt there handles it.
    // For now passing "type" which is standard in this plan.
    formData.append(
      "type",
      transcriptionType === "normal" ? "plain" : transcriptionType,
    );

    try {
      const msgInterval = setInterval(() => {
        setStatusMessage((prev) =>
          prev === "Uploading audio..."
            ? "Running Whisper..."
            : prev === "Running Whisper..."
              ? "Finalizing text..."
              : "Uploading audio...",
        );
      }, 2000);

      const response = await axios.post(
        "https://audioapi.moinul4u.com/api/transcribe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      clearInterval(msgInterval);

      const resData = response.data;
      if (
        resData?.error ||
        (typeof resData === "string" &&
          resData.includes("The audio field must be a file")) ||
        (resData?.message &&
          typeof resData.message === "string" &&
          resData.message.includes("The audio field must be a file"))
      ) {
        throw new Error(resData?.error || resData?.message || resData);
      }

      // Handle the new format { data: "...", type: "..." } or old { text: "..." }
      let transcriptionText = resData.data || resData.text;
      const transcriptionType = resData.type || "normal";

      if (!transcriptionText) {
        throw new Error("No transcription received from server.");
      }

      // Handle "special characters" and cleaning
      if (typeof transcriptionText === "string") {
        // Replace double-escaped newlines if present
        transcriptionText = transcriptionText.replace(/\\n/g, "\n");
        // Trim and remove wrapping quotes if LLM added them
        transcriptionText = transcriptionText.trim().replace(/^"(.*)"$/, "$1");
      }

      setTranscription(transcriptionText);
      setResponseType(transcriptionType);
      setStatus("success");
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to transcribe audio.",
        );
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const blob = new Blob([transcription], { type: "text/plain" });
    element.href = URL.createObjectURL(blob);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background Gradient Spotlights */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-echo-accent/10 dark:bg-echo-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <Logo />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            title={
              mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-bold text-gray-600 dark:text-gray-300 tracking-tight"
          >
            <Globe className="w-4 h-4" />
            {mounted && language === "bn" ? "বাংলা" : "English"}
          </button>

          <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1 hidden sm:block"></div>

          {mounted && isLoggedIn ? (
            <Link href="/profile">
              <button className="p-2 w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-all active:scale-[0.98]">
                <User className="w-5 h-5" />
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-[0.98] tracking-tight">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-col w-full relative z-10">
        {/* HERO SECTION - No Sidebar Ads */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 w-full max-w-4xl mx-auto px-4">
          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/60 mb-4 tracking-tight">
              Transcribe <span className="text-blue-600 dark:text-blue-500">Instantly</span>
            </h1>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400 max-w-lg mx-auto tracking-tight">
              Convert your audio to text with professional accuracy in seconds.
            </p>
          </motion.div>

          {/* Transcription Interface */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full z-10 flex flex-col items-center"
          >
            {/* Tab Switcher */}
            {status === "idle" && !transcription && (
              <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 mb-8 relative shadow-sm">
                <motion.div
                  layoutId="activeTab"
                  className="absolute bg-white dark:bg-white/10 rounded-full inset-1 shadow-md dark:shadow-none"
                  style={{
                    width: "50%",
                    left: activeTab === "upload" ? "4px" : "50%",
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
                <button
                  onClick={() => {
                    setActiveTab("upload");
                    setErrorMessage("");
                  }}
                  className={cn(
                    "px-10 py-2.5 rounded-full text-sm font-semibold relative z-10 transition-colors uppercase tracking-widest",
                    activeTab === "upload"
                      ? "text-echo-accent dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  Upload
                </button>
                <button
                  onClick={() => {
                    setActiveTab("record");
                    setErrorMessage("");
                  }}
                  className={cn(
                    "px-10 py-2.5 rounded-full text-sm font-semibold relative z-10 transition-colors uppercase tracking-widest",
                    activeTab === "record"
                      ? "text-echo-accent dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  Record
                </button>
              </div>
            )}

            <div className="glass-panel w-full rounded-[2.5rem] p-6 md:p-10 overflow-hidden relative min-h-[350px] flex flex-col justify-center mb-12 shadow-2xl shadow-black/5 dark:shadow-blue-900/10 border-black/5 dark:border-white/10">
              <AnimatePresence mode="wait">
                {/* ERROR DISPLAY */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-0 w-full px-8 z-20"
                  >
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm text-center">
                      {errorMessage}
                    </div>
                  </motion.div>
                )}

                {/* IDLE STATE - UPLOAD */}
                {status === "idle" &&
                  activeTab === "upload" &&
                  !transcription && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col items-center text-center w-full"
                    >
                      <div
                        className={cn(
                          "w-full h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group mb-6 relative overflow-hidden",
                          dragActive
                            ? "border-echo-accent bg-echo-accent/5 scale-[1.01] shadow-inner"
                            : "border-black/10 dark:border-white/20 bg-gradient-to-br from-black/[0.01] to-black/[0.03] dark:from-white/[0.01] dark:to-white/[0.03] hover:border-echo-accent/40 hover:bg-white/[0.05] dark:hover:bg-white/[0.05] shadow-sm",
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="audio/*,video/*"
                          onChange={handleChange}
                        />

                        {file ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <FileAudio className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight break-all max-w-md">
                                {file.name}
                              </p>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 tracking-tight">
                                Ready to transcribe
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                              <Upload className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                                Drag & drop audio here
                              </p>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 tracking-tight">
                                or click to browse files
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex flex-col gap-6 w-full">
                        {/* Output Mode Selection - Single horizontal line */}
                        <div className="bg-black/5 dark:bg-black/40 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none">
                          <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide">
                            {OUTPUT_MODES.map((mode) => (
                              <button
                                key={mode.id}
                                onClick={() =>
                                  setTranscriptionType(mode.id as any)
                                }
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden group min-w-fit",
                                  transcriptionType === mode.id
                                    ? "bg-blue-600/10 border-blue-600/40 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                                    : "bg-white dark:bg-white/[0.03] border-black/10 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/10",
                                )}
                              >
                                <mode.icon
                                  className={cn(
                                    "w-3.5 h-3.5 transition-colors",
                                    transcriptionType === mode.id
                                      ? "text-blue-500"
                                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300",
                                  )}
                                />
                                <span className="font-bold text-[10px] tracking-tight whitespace-nowrap uppercase">
                                  {mode.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Button Container - Full width row */}
                        <div className="flex flex-col items-center gap-4 w-full">
                          <button
                            disabled={!file}
                            onClick={handleTranscribe}
                            className="w-full max-w-sm px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group border border-white/10"
                          >
                            <span className="text-[15px] tracking-tight">
                              Upload & Transcribe
                            </span>
                            <Upload className="w-4 h-4 opacity-80 group-hover:translate-y-[-2px] transition-transform" />
                          </button>

                          {file && (
                            <button
                              onClick={() => setFile(null)}
                              className="text-[10px] font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors uppercase tracking-[0.2em]"
                            >
                              Reset file
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                {/* IDLE STATE - RECORD */}
                {status === "idle" &&
                  activeTab === "record" &&
                  !transcription && (
                    <motion.div
                      key="record"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col items-center text-center w-full"
                    >
                      {/* Visualizer / Timer Display */}
                      <div className="w-full h-64 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden mb-8">
                        {isRecording ? (
                          <>
                            <div className="flex items-center gap-1 h-16 mb-4">
                              {[...Array(12)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-2 bg-red-500 rounded-full animate-waveform"
                                  style={{
                                    animationDelay: `${i * 0.05}s`,
                                    height: `${[40, 70, 30, 80, 50, 90, 40, 60, 30, 70, 40, 60][i]}%`,
                                  }}
                                />
                              ))}
                            </div>
                            <div className="text-4xl font-mono text-red-500 animate-pulse">
                              {formatTime(recordingTime)}
                            </div>
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                              <span className="text-xs text-red-500 font-bold uppercase tracking-widest">
                                Rec
                              </span>
                            </div>
                          </>
                        ) : recordedAudio ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-echo-accent/20 flex items-center justify-center text-echo-accent">
                              <FileAudio className="w-10 h-10" />
                            </div>
                            <div className="text-2xl font-mono text-gray-900 dark:text-white">
                              {formatTime(recordingTime)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Audio Recorded
                            </p>
                          </div>
                        ) : (
                          <div className="text-gray-400 dark:text-gray-500 text-lg font-bold tracking-tight">
                            Click the microphone to start recording
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div
                        className={cn(
                          "flex items-center gap-4",
                          recordedAudio ? "flex-col" : "flex-row",
                        )}
                      >
                        {!isRecording && !recordedAudio && (
                          <button
                            onClick={startRecording}
                            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                          >
                            <Mic className="w-8 h-8" />
                          </button>
                        )}

                        {isRecording && (
                          <button
                            onClick={stopRecording}
                            className="w-16 h-16 rounded-full bg-gray-200 hover:bg-white shadow-xl shadow-white/10 flex items-center justify-center text-black transition-all hover:scale-110 active:scale-95"
                          >
                            <Square className="w-6 h-6 fill-current" />
                          </button>
                        )}

                        {recordedAudio && (
                          <div className="mt-8 flex flex-col gap-6 w-full">
                            {/* Output Mode Selection - Single horizontal line */}
                            <div className="bg-black/5 dark:bg-black/40 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none">
                              <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide">
                                {OUTPUT_MODES.map((mode) => (
                                  <button
                                    key={mode.id}
                                    onClick={() =>
                                      setTranscriptionType(mode.id as any)
                                    }
                                    className={cn(
                                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden group min-w-fit",
                                      transcriptionType === mode.id
                                        ? "bg-blue-600/10 border-blue-600/40 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                                        : "bg-white dark:bg-white/[0.03] border-black/10 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/10",
                                    )}
                                  >
                                    <mode.icon
                                      className={cn(
                                        "w-3.5 h-3.5 transition-colors",
                                        transcriptionType === mode.id
                                          ? "text-blue-500"
                                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300",
                                      )}
                                    />
                                    <span className="font-bold text-[10px] tracking-tight whitespace-nowrap uppercase">
                                      {mode.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Action Button Container - Full width row */}
                            <div className="flex flex-col items-center gap-4 w-full">
                              <button
                                disabled={!recordedAudio}
                                onClick={handleTranscribe}
                                className="w-full max-w-sm px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group border border-white/10"
                              >
                                <span className="text-[15px] tracking-tight">
                                  Process & Transcribe
                                </span>
                                <Mic className="w-4 h-4 opacity-80 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={resetRecording}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest"
                                title="Retake"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Reset
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                {/* LOADING STATE - SHARED */}
                {(status === "uploading" || status === "processing") && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="flex items-center gap-1 h-12 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-echo-accent rounded-full animate-waveform"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>

                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2">
                      {statusMessage}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      This typically takes a few seconds...
                    </p>
                  </motion.div>
                )}

                {/* SUCCESS STATE - SHARED */}
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col h-full w-full"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Check className="w-5 h-5" />
                          <span className="font-semibold">
                            Transcription Complete
                          </span>
                        </div>
                        {responseType && (
                          <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                            {responseType}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={copyToClipboard}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          title="Copy to Clipboard"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={downloadTxt}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          title="Download .txt"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-black/20 rounded-xl p-6 md:p-8 border border-black/10 dark:border-white/5 min-h-[300px] max-h-[600px] overflow-y-auto shadow-inner">
                      <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {transcription}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setFile(null);
                        setRecordedAudio(null);
                        setStatus("idle");
                        setTranscription("");
                        setRecordingTime(0);
                      }}
                      className="mt-6 self-start text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      ← Transcribe another{" "}
                      {activeTab === "record" ? "recording" : "file"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.main>
        </section>

        {/* CONTENT SECTION - How It Works & Ads */}
        <section className="container mx-auto px-4 pb-12 relative z-10 border-t border-black/5 dark:border-white/5 pt-12">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            {/* <AdUnit className="w-full" label="Sponsored" /> */}

            {/* How It Works Section */}
            <HowItWorks />

            {/* AI Models Showcase Section */}
            <ModelShowcase />

            {/* <AdUnit className="w-full" label="Sponsored" /> */}
          </div>
        </section>
      </div>

      <footer className="mt-8 mb-4 text-center text-gray-500 text-sm relative z-10">
        <p>&copy; {mounted ? new Date().getFullYear() : "2026"} EcoNotes. All rights reserved.</p>
      </footer>
    </div>
  );
}

const encodeWAV = (samples: Float32Array[], sampleRate: number) => {
  const bufferLength = samples.reduce((acc, chunk) => acc + chunk.length, 0);
  const dataLength = bufferLength * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (const chunk of samples) {
    for (let i = 0; i < chunk.length; i++) {
      const s = Math.max(-1, Math.min(1, chunk[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: "audio/wav" });
};
