'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 border border-[#3A3731] bg-[#11110F]/90 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#C8C0B3] transition-all hover:border-[#B79A62] hover:text-[#B79A62]"
      aria-label="Back to home"
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      Back to Home
    </Link>
  );
}
