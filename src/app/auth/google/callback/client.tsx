"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function GoogleCallbackClient() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push("/profile");
        }, 1500);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Processing login...</p>
        </div>
    );
}
