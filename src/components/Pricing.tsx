"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  FileAudio,
  FileBadge,
  Globe,
  Headphones,
  Lock,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Perfect for students and casual users.",
    features: [
      { text: "1000 Tokens / Month", icon: Zap },
      { text: "Standard Transcription", icon: FileAudio },
      { text: "Web Access", icon: Globe },
      { text: "Email Support", icon: Headphones },
    ],
    buttonText: "Get Started",
    popular: false,
    color: "blue",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For professionals needing unlimited power.",
    features: [
      { text: "Unlimited Tokens", icon: Zap },
      { text: "Advanced AI Models", icon: Cpu },
      { text: "Cloud History Sync", icon: Globe },
      { text: "Priority Support", icon: Headphones },
      { text: "File Uploads", icon: FileBadge },
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    color: "indigo",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Scale with advanced security and control.",
    features: [
      { text: "SSO Integration", icon: Lock },
      { text: "On-Premise Deployment", icon: Shield },
      { text: "Custom AI Models", icon: Cpu },
      { text: "Audit Logs", icon: FileBadge },
      { text: "Dedicated Manager", icon: Users },
    ],
    buttonText: "Contact Sales",
    popular: false,
    color: "emerald",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium"
          >
            Choose the plan that fits your needs. No hidden fees or complex
            contracts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 ${
                plan.popular
                  ? "bg-white dark:bg-[#121214] border-indigo-600/30 shadow-2xl shadow-indigo-500/10 scale-105 z-10"
                  : "bg-white/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 backdrop-blur-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 rounded-full text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold dark:text-white tracking-tighter">
                  {plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">
                  {plan.period}
                </span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${plan.color}-600/10 text-${plan.color}-600`}
                    >
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300 tracking-tight">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] ${
                  plan.popular
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
                    : "bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
