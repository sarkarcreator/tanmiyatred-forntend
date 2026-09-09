import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Cookie Policy | Tanmiyat Real Estate Development LLC',
  description: 'Learn about cookie usage and analytical privacy preferences on Tanmiyat Real Estate Development LLC website.',
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#C8C0B3] font-light leading-relaxed">
          <div className="border-b border-[#25221E] pb-6 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#B79A62] block mb-2">
              COOKIE POLICY
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#F5F2EB]">Cookie Policy</h1>
            <p className="text-xs text-[#7A756D] mt-2">Effective: 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files placed on your device to enhance your browsing experience,
              remember your preferred language (such as English or Arabic), and optimize website
              performance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">2. Categories of Cookies We Utilize</h2>
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-[#171715] border border-[#25221E]">
                <strong className="text-[#F5F2EB] block mb-1">Essential Cookies</strong>
                <p className="text-[#8C867E]">
                  Necessary for website security, language retention, and secure inquiry submissions.
                  These cannot be disabled.
                </p>
              </div>
              <div className="p-4 bg-[#171715] border border-[#25221E]">
                <strong className="text-[#F5F2EB] block mb-1">Analytical & Performance Cookies</strong>
                <p className="text-[#8C867E]">
                  Enable us to measure visitor engagement, traffic sources, and portfolio interest to
                  continually refine user experience.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">3. Managing Your Preferences</h2>
            <p>
              You may modify your cookie consent at any time through our on-screen banner or through
              your web browser settings.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
