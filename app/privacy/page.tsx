import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tanmiyat Real Estate Development LLC',
  description: 'Official privacy statement and data protection policy for Tanmiyat Real Estate Development LLC, Dubai, UAE.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#C8C0B3] font-light leading-relaxed">
          <div className="border-b border-[#25221E] pb-6 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#B79A62] block mb-2">
              LEGAL & REGULATORY
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#F5F2EB]">Privacy Policy</h1>
            <p className="text-xs text-[#7A756D] mt-2">Effective Date: January 1, 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">1. Introduction & Scope</h2>
            <p>
              Tanmiyat Real Estate Development LLC (&quot;Tanmiyat&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), registered
              in Dubai, United Arab Emirates, is committed to safeguarding the confidentiality and
              integrity of personal data entrusted to us by clients, investors, purchasers, and
              website visitors.
            </p>
            <p>
              This Privacy Policy explains how we collect, process, disclose, and secure your
              personal information in accordance with UAE Federal Decree-Law No. 45 of 2021 on the
              Protection of Personal Data and relevant regulations established by the Dubai Land
              Department (DLD) and the Real Estate Regulatory Agency (RERA).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">2. Information We Collect</h2>
            <p>We may collect personal information that you directly provide to us, including:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-4">
              <li>Contact details: Full legal name, email address, telephone numbers, and country of residence.</li>
              <li>Identification & KYC: Passport copies, Emirates ID, proof of address, and nationality for property reservation and SPA preparation.</li>
              <li>Acquisition criteria: Preferred developments, property specifications, budgets, and investment objectives.</li>
              <li>Digital interactions: IP addresses, browser types, interaction telemetry, and cookie preferences.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">3. Purpose of Processing</h2>
            <p>Your data is processed strictly for legitimate real estate business purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-4">
              <li>Processing unit reservations, purchase agreements, and escrow transactions.</li>
              <li>Executing statutory compliance with DLD and RERA property registration protocols.</li>
              <li>Providing customized advisory briefings regarding off-market releases and developments.</li>
              <li>Complying with federal anti-money laundering (AML) and counter-terrorist financing obligations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">4. Data Protection & Security</h2>
            <p>
              Tanmiyat employs enterprise-grade cryptographic standards, role-based access control,
              and secure infrastructure to protect your personal and financial information against
              unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">5. Contact Our Data Governance Officer</h2>
            <p>
              For questions, access requests, or regulatory queries regarding this Privacy Policy, please
              contact:
            </p>
            <div className="p-4 bg-[#171715] border border-[#25221E] text-sm text-[#F5F2EB]">
              <strong>Data Governance Officer</strong>
              <br />
              Tanmiyat Real Estate Development LLC
              <br />
              Business Bay, Dubai, UAE
              <br />
              Email: legal@tanmiyatrealestate.com
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
