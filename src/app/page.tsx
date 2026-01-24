"use client";

import axios from "axios";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, FileAudio, Globe, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [transcription, setTranscription] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("echoscript_lang") as "en" | "bn";
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "bn" : "en";
    setLanguage(newLang);
    localStorage.setItem("echoscript_lang", newLang);
  };

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
    setStatus("idle");
    setTranscription("");
    setErrorMessage("");
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setStatus("error");
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleTranscribe = async () => {
    if (!file) return;

    setStatus("uploading");
    setStatusMessage("Uploading audio...");
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("language", language);

    try {
      // Rotate messages simulation
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
        "http://127.0.0.1:8000/api/transcribe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      clearInterval(msgInterval);
      setTranscription(response.data.text);
      setStatus("success");
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.message ||
            "Failed to transcribe audio. Please try again.",
        );
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    // Could add brief toast here
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([transcription], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradient Spotlights */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-echo-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-echo-accent to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            EchoScript
          </span>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
        >
          <Globe className="w-4 h-4" />
          {language === "en" ? "English" : "বাংলা"}
        </button>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl z-10"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {/* IDLE / FILE SELECTION STATE */}
            {(status === "idle" || status === "error") && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={cn(
                    "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group",
                    dragActive
                      ? "border-echo-accent bg-echo-accent/5 scale-[1.02]"
                      : "border-white/20 hover:border-white/40 hover:bg-white/5",
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
                      <div className="w-16 h-16 rounded-full bg-echo-accent/20 flex items-center justify-center text-echo-accent">
                        <FileAudio className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white break-all max-w-md">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Ready to transcribe
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">
                          Drag & drop audio here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <button
                  disabled={!file}
                  onClick={handleTranscribe}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-echo-accent to-blue-600 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Upload & Transcribe
                </button>
              </motion.div>
            )}

            {/* LOADING STATE */}
            {(status === "uploading" || status === "processing") && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                {/* CSS Waveform Animation */}
                <div className="flex items-center gap-1 h-12 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-echo-accent rounded-full animate-waveform"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                <h3 className="text-2xl font-light text-white mb-2">
                  {statusMessage}
                </h3>
                <p className="text-gray-400 text-sm">
                  This typically takes a few seconds...
                </p>
              </motion.div>
            )}

            {/* SUCCESS STATE */}
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Transcription Complete</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={downloadTxt}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      title="Download .txt"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-6 border border-white/5 min-h-[300px] max-h-[500px] overflow-y-auto text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {transcription}
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setStatus("idle");
                    setTranscription("");
                  }}
                  className="mt-6 self-start text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Transcribe another file
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} EchoScript. Powered by OpenAI
          Whisper.
        </p>
      </footer>
    </div>
  );
}
