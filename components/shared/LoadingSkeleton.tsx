"use client";

import { Layers } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-dv-bg flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-dv-accent/20 flex items-center justify-center">
          <Layers size={16} className="text-dv-accent animate-pulse-slow" strokeWidth={2} />
        </div>
        <span className="font-heading font-semibold text-[18px] text-dv-text tracking-tight">
          DevVault
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-dv-accent animate-pulse-slow" />
        <span className="font-mono text-[12px] text-dv-text3">
          fetching resources from GitHub...
        </span>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-dv-bg flex flex-col items-center justify-center gap-3">
      <div className="font-mono text-[13px] text-red-400">
        error: {message}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="text-[12px] text-dv-text3 hover:text-dv-text2 transition-colors cursor-pointer bg-transparent border border-dv-border2 rounded px-3 py-1.5 font-body"
      >
        Retry
      </button>
    </div>
  );
}
