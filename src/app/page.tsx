"use client";

import axios from "axios";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  FileAudio,
  Globe,
  Mic,
  RotateCcw,
  Square,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [language, setLanguage] = useState<"en" | "bn">("en");

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

  // Core State
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [transcription, setTranscription] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("echoscript_lang") as "en" | "bn";
    // eslint-disable-next-line
    if (saved) setLanguage(saved);
  }, []);

  // --- Helpers ---
  const toggleLanguage = () => {
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
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
        const wavBlob = encodeWAV(audioChunksRef.current, audioContextRef.current.sampleRate);
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
    formData.append("type", "plain");
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
      console.log(response.data);

      const resData = response.data;
      if (resData?.error ||
        (typeof resData === "string" && resData.includes("The audio field must be a file")) ||
        (resData?.message && typeof resData.message === "string" && resData.message.includes("The audio field must be a file"))) {
        throw new Error(resData?.error || resData?.message || resData);
      }

      if (!response.data.text) {
        throw new Error("No transcription received from server.");
      }

      setTranscription(response.data.text);
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
            EcoNotes
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
        className="w-full max-w-3xl z-10 flex flex-col items-center"
      >
        {/* Tab Switcher */}
        {status === "idle" && !transcription && (
          <div className="flex p-1 bg-white/5 rounded-full border border-white/10 mb-6 relative">
            <motion.div
              layoutId="activeTab"
              className="absolute bg-white/10 rounded-full inset-1"
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
                "px-8 py-2 rounded-full text-sm font-medium relative z-10 transition-colors",
                activeTab === "upload"
                  ? "text-white"
                  : "text-gray-400 hover:text-white",
              )}
            >
              Upload File
            </button>
            <button
              onClick={() => {
                setActiveTab("record");
                setErrorMessage("");
              }}
              className={cn(
                "px-8 py-2 rounded-full text-sm font-medium relative z-10 transition-colors",
                activeTab === "record"
                  ? "text-white"
                  : "text-gray-400 hover:text-white",
              )}
            >
              Record Audio
            </button>
          </div>
        )}

        <div className="glass-panel w-full rounded-3xl p-8 md:p-12 overflow-hidden relative min-h-[400px] flex flex-col justify-center">
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
            {status === "idle" && activeTab === "upload" && !transcription && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col items-center text-center w-full"
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

                <div className="mt-8">
                  <button
                    disabled={!file}
                    onClick={handleTranscribe}
                    className="px-8 py-3 bg-gradient-to-r from-echo-accent to-blue-600 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Upload & Transcribe
                  </button>
                  {file && (
                    <button
                      onClick={() => setFile(null)}
                      className="ml-4 text-sm text-gray-500 hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* IDLE STATE - RECORD */}
            {status === "idle" && activeTab === "record" && !transcription && (
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
                      <div className="text-2xl font-mono text-white">
                        {formatTime(recordingTime)}
                      </div>
                      <p className="text-sm text-gray-400">Audio Recorded</p>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-lg font-light">
                      Click the microphone to start recording
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
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
                    <>
                      <button
                        disabled={!recordedAudio}
                        onClick={handleTranscribe}
                        className="px-8 py-3 bg-gradient-to-r from-echo-accent to-blue-600 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Transcribe Recording
                      </button>
                      <button
                        onClick={resetRecording}
                        className="p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Retake"
                      >
                        <RotateCcw className="w-6 h-6" />
                      </button>
                    </>
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

                <h3 className="text-2xl font-light text-white mb-2">
                  {statusMessage}
                </h3>
                <p className="text-gray-400 text-sm">
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
                    setRecordedAudio(null);
                    setStatus("idle");
                    setTranscription("");
                    setRecordingTime(0);
                  }}
                  className="mt-6 self-start text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Transcribe another{" "}
                  {activeTab === "record" ? "recording" : "file"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} EcoNotes. Powered by OpenAI
          Whisper.
        </p>
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
