import Link from 'next/link'

export const dynamic = "force-static";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="mb-4 text-gray-600">Could not find requested resource</p>
            <Link href="/" className="text-blue-600 hover:underline font-medium">
                Return Home
            </Link>
        </div>
    )
}
