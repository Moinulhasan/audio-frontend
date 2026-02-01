import { Suspense } from "react";
import { GoogleCallbackClient } from "./client";

export const dynamic = "force-static";

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <GoogleCallbackClient />
        </Suspense>
    );
}
