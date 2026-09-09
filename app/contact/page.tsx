'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useI18n } from '@/lib/i18n/context';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Building2,
} from 'lucide-react';

export default function ContactPage() {
  const { t, isRTL } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    interestedProject: '',
    propertyType: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const phoneNumber = '+971503490817';
  const displayPhoneNumber = '+971-50-3490817';
  const whatsAppUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Tanmiyat Real Estate Development. I would like to schedule a private consultation.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'GENERAL',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error sending inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
              DUBAI HEADQUARTERS & PRIVATE ADVISORY
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-normal tracking-tight mb-4">
              Connect With Tanmiyat.
            </h1>
            <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed">
              Whether you are an individual purchaser seeking a landmark residence, or an
              institutional investor evaluating portfolio scale acquisitions, our executive team
              stands ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Direct Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#171715] border border-[#25221E] p-8 space-y-6">
                <h3 className="font-editorial text-2xl text-[#F5F2EB] border-b border-[#2B2925] pb-4">
                  Corporate Offices
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#B79A62] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-[#F5F2EB] mb-0.5">Headquarters</strong>
                      <p className="text-[#8C867E]">
                        Tanmiyat Real Estate Development LLC
                        <br />
                        Business Bay, Dubai, United Arab Emirates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#B79A62] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-[#F5F2EB] mb-0.5">Telephone</strong>
                      <a href={`tel:${phoneNumber}`} className="text-[#8C867E] hover:text-[#B79A62]">
                        {displayPhoneNumber}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#B79A62] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-[#F5F2EB] mb-0.5">Official Email</strong>
                      <a
                        href="mailto:info@tanmiyatrealestate.com"
                        className="text-[#8C867E] hover:text-[#B79A62]"
                      >
                        info@tanmiyatrealestate.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#B79A62] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-[#F5F2EB] mb-0.5">Executive Hours</strong>
                      <p className="text-[#8C867E]">
                        Monday – Friday: 9:00 AM – 6:00 PM (Gulf Standard Time)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2B2925] space-y-3">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold uppercase tracking-wider hover:bg-[#25D366]/25 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge (24/7)</span>
                  </a>

                  <a
                    href={`tel:${phoneNumber}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#1F1D1A] border border-[#332F28] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider hover:border-[#B79A62] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#B79A62]" />
                    <span>Call Sales Office</span>
                  </a>
                </div>
              </div>

              {/* Regulatory Assurance */}
              <div className="p-6 bg-[#0E0E0D] border border-[#22201C] space-y-2 text-xs text-[#8C867E]">
                <div className="flex items-center gap-2 text-[#B79A62] font-semibold uppercase tracking-wider text-[11px]">
                  <Building2 className="w-4 h-4" />
                  <span>RERA & Dubai Land Department</span>
                </div>
                <p>
                  Tanmiyat Real Estate Development LLC is a licensed property developer registered
                  in the Emirate of Dubai under official developer licensing.
                </p>
              </div>
            </div>

            {/* Right: Comprehensive Inquiry Form */}
            <div className="lg:col-span-7 bg-[#171715] border border-[#25221E] p-8 sm:p-12">
              <h2 className="font-editorial text-3xl text-[#F5F2EB] mb-2">
                Executive Consultation Request
              </h2>
              <p className="text-xs text-[#8C867E] mb-8">
                Please complete the briefing below. An accredited Tanmiyat portfolio manager will
                connect with you within four business hours.
              </p>

              {isSuccess ? (
                <div className="py-16 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-[#B79A62] mx-auto" />
                  <h3 className="font-editorial text-3xl text-[#F5F2EB]">
                    {t.inquiry.successTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C8C0B3] max-w-md mx-auto leading-relaxed">
                    {t.inquiry.successMessage}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-8 py-3 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-widest"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-200 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                        Telephone (with country code) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                        Country of Residence
                      </label>
                      <input
                        type="text"
                        placeholder="United Arab Emirates"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                        Interested Development
                      </label>
                      <select
                        value={formData.interestedProject}
                        onChange={(e) =>
                          setFormData({ ...formData, interestedProject: e.target.value })
                        }
                        className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                      >
                        <option value="">General Portfolio / Multiple</option>
                        <option value="Living Legends">Living Legends (Dubailand)</option>
                        <option value="The Court Tower">The Court Tower (Dubai Canal)</option>
                        <option value="The Exchange Tower">The Exchange Tower (Business Bay)</option>
                        <option value="Horizon Residences">Horizon Residences</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                        Target Property Type
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                      >
                        <option value="">Any / Advisory Preference</option>
                        <option value="Luxury Villa">Signature Golf Villa</option>
                        <option value="Penthouse">Sky Penthouse</option>
                        <option value="Apartment">Luxury Apartment</option>
                        <option value="Commercial">Commercial Headquarters</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                      Brief Message or Acquisition Specifications
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share any preferred bedroom counts, floor levels, or desired handover timelines..."
                      className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D8BE8A] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'TRANSMITTING INQUIRY...' : 'TRANSMIT INQUIRY TO ADVISORY'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
