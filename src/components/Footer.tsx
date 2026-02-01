"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-white dark:bg-[#0b0f19] border-t border-black/5 dark:border-white/5 pt-16 pb-8 relative overflow-hidden z-10 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
                        <Logo />
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            Transforming your voice into organized, actionable notes with the power of advanced AI.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Product</h3>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Company</h3>
                        <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Connect</h3>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="mailto:support@econotes.com" className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} EcoNotes. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by EcoNotes Team
                    </div>
                </div>
            </div>
        </footer>
    );
}
