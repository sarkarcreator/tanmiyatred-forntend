'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tanmiyat_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tanmiyat_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('tanmiyat_cookie_consent', 'necessary_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#171715]/95 backdrop-blur-md border border-[#332F28] p-5 shadow-2xl transition-all"
    >
      <div className="flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#B79A62] shrink-0 mt-0.5" />
        <div className="space-y-2 text-xs text-[#C8C0B3]">
          <p className="font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px]">
            Privacy & Cookie Standards
          </p>
          <p className="leading-relaxed">
            We employ essential and analytical cookies to ensure an exceptional digital experience,
            analyze website traffic, and respect your privacy under UAE data protection laws.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 bg-[#B79A62] text-[#0A0A09] font-semibold tracking-wider text-[10px] uppercase hover:bg-[#D8BE8A] transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-[#25221E] text-[#C8C0B3] text-[10px] uppercase tracking-wider hover:text-[#F5F2EB] transition-colors"
            >
              Essential Only
            </button>
            <Link
              href="/privacy"
              className="text-[#8C867E] hover:text-[#B79A62] text-[10px] underline ml-auto"
            >
              Details
            </Link>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-[#8C867E] hover:text-[#F5F2EB] p-1 shrink-0"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
