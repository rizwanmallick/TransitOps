"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F17]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">403</h1>
        <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
