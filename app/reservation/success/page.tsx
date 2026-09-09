import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reservation Confirmed | Tanmiyat Real Estate Development',
  description: 'Your property reservation has been secured with Tanmiyat Real Estate Development.',
};

export default function ReservationSuccessPage() {
  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-36 pb-24 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center rounded-full bg-[#B79A62]/10 border border-[#B79A62]">
            <CheckCircle2 className="w-10 h-10 text-[#B79A62]" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#B79A62] font-semibold block mb-2">
            TRANSACTION SECURED
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#F5F2EB] mb-4">
            Reservation Initiated.
          </h1>
          <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed mb-8">
            Thank you. Your reservation deposit has been registered in the Tanmiyat Escrow
            Management System. A dedicated private client advisor will contact you within two
            business hours with your official Booking Agreement and SPA documentation.
          </p>

          <div className="p-6 bg-[#171715] border border-[#25221E] text-left text-xs space-y-3 mb-8">
            <div className="flex items-center gap-2 text-[#B79A62] uppercase tracking-wider font-semibold">
              <FileText className="w-4 h-4" />
              <span>Next Legal Steps</span>
            </div>
            <p className="text-[#8C867E]">
              1. Identity verification (KYC) copy collection (Passport / Emirates ID).
              <br />
              2. Official Tanmiyat Reservation Form dispatch for digital signature.
              <br />
              3. Registration of reservation notice with Dubai Land Department / RERA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/developments"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D8BE8A] transition-colors"
            >
              Return to Portfolio
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 border border-[#3A3731] text-[#C8C0B3] hover:text-[#F5F2EB] text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              Tanmiyat Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
