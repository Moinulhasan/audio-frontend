"use client";

import { useEffect, useRef, useState } from "react";

interface AdUnitProps {
    slot?: string;
    format?: "auto" | "fluid" | "rectangle";
    className?: string;
    label?: string;
}

export function AdUnit({ slot, format = "auto", className = "", label = "Advertisement" }: AdUnitProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
            <span className="text-xs text-gray-600 uppercase tracking-widest mb-2">{label}</span>
            <div
                ref={adRef}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg flex items-center justify-center overflow-hidden min-h-[100px]"
                style={{ minHeight: format === 'rectangle' ? '250px' : '100px' }}
            >
                {/* 
                   Only render AdSense tag on client after mount to prevent hydration mismatches.
                   Scripts might modify the DOM which confuses React if present during hydration.
                */}
                {isMounted && slot ? (
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block", width: "100%" }}
                        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with actual client ID
                        data-ad-slot={slot}
                        data-ad-format={format}
                        data-full-width-responsive="true"
                        suppressHydrationWarning={true}
                    />
                ) : (
                    <div className="p-4 text-center text-gray-500 text-sm animate-pulse">
                        <p className="mb-1 font-semibold">Ad Space</p>
                        <p className="text-xs opacity-70">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
