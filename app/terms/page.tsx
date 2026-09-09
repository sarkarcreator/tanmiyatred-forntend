import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Tanmiyat Real Estate Development LLC',
  description: 'Official terms and conditions governing the use of Tanmiyat Real Estate Development LLC online platforms and services.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#C8C0B3] font-light leading-relaxed">
          <div className="border-b border-[#25221E] pb-6 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#B79A62] block mb-2">
              LEGAL TERMS
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#F5F2EB]">Terms & Conditions</h1>
            <p className="text-xs text-[#7A756D] mt-2">Last Updated: January 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you acknowledge that you have read, understood, and
              agree to be bound by these Terms & Conditions and all applicable laws of the United Arab
              Emirates and the Emirate of Dubai.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">2. Property Information & Disclaimers</h2>
            <p>
              All renderings, architectural floor plans, dimensions, photographic visualizations, and
              specifications presented on this website are conceptual representations provided for
              illustrative orientation only. Tanmiyat reserves the right to alter or modify designs,
              finishes, and dimensions as dictated by architectural evolution or regulatory requirements
              mandated by the Dubai Municipality and RERA.
            </p>
            <p>
              Prices, unit availability, and payment plans are subject to revision without prior notice.
              Binding contractual commitments are formed exclusively upon execution of official Sale
              and Purchase Agreements (SPAs) registered with the Dubai Land Department.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">3. Intellectual Property Rights</h2>
            <p>
              The Tanmiyat trademark, emblem, architectural photography, text, and graphics displayed
              on this website are the proprietary assets of Tanmiyat Real Estate Development LLC.
              Unauthorized reproduction, distribution, or commercial exploitation is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">4. Governing Law & Jurisdiction</h2>
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws
              of the Emirate of Dubai and the federal laws of the United Arab Emirates. Any dispute
              arising out of or in connection with these terms shall be submitted to the exclusive
              jurisdiction of the Courts of Dubai.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
