import React from 'react';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A09] text-[#F5F2EB]"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#332F28] border-t-[#B79A62]" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E]">
          Tanmiyat
        </span>
      </div>
    </div>
  );
}
