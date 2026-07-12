"use client";

import { useRouter } from "next/navigation";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 dark:bg-red-500/15 flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">403</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">You don&apos;t have permission to access this page.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
