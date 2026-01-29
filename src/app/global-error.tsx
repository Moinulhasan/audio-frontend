"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                    <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                    {typeof reset === "function" && (
                        <button
                            onClick={() => reset()}
                            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </body>
        </html>
    );
}
