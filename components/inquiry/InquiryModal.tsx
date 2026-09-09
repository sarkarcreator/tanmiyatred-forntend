'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { X, MessageSquare, Phone, Mail, CheckCircle2, Building2 } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: string;
  initialUnit?: string;
  initialType?: 'GENERAL' | 'PROJECT' | 'UNIT' | 'INVESTOR';
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  initialProject = '',
  initialUnit = '',
  initialType = 'GENERAL',
}) => {
  const { t, isRTL } = useI18n();
  const [inquiryType, setInquiryType] = useState<'GENERAL' | 'PROJECT' | 'UNIT' | 'INVESTOR'>(initialType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    interestedProject: initialProject,
    propertyType: '',
    message: initialUnit ? `Inquiring regarding Unit: ${initialUnit}` : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
          type: inquiryType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppNumber = '+971480082664';
  const whatsAppText = encodeURIComponent(
    `Hello Tanmiyat Real Estate Development. I am interested in inquiring about ${
      formData.interestedProject || 'your Dubai developments'
    }.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#171715] border border-[#2B2925] p-6 sm:p-10 shadow-2xl transition-all my-8"
        style={{ borderRadius: '2px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 ${
            isRTL ? 'left-6' : 'right-6'
          } text-[#C8C0B3] hover:text-[#F5F2EB] transition-colors p-2`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#B79A62]/10 border border-[#B79A62]">
              <CheckCircle2 className="w-8 h-8 text-[#B79A62]" />
            </div>
            <h3 className="font-editorial text-3xl text-[#F5F2EB] mb-3 tracking-wide">
              {t.inquiry.successTitle}
            </h3>
            <p className="text-[#C8C0B3] max-w-md mx-auto text-sm leading-relaxed mb-8">
              {t.inquiry.successMessage}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${whatsAppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold tracking-widest uppercase hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {t.inquiry.whatsAppPrompt}
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-widest uppercase hover:bg-[#D8BE8A] transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#B79A62] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                <Building2 className="w-4 h-4" />
                <span>TANMIYAT PRIVATE CLIENT ADVISORY</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#F5F2EB] tracking-wide mb-2">
                {t.inquiry.title}
              </h2>
              <p className="text-[#C8C0B3] text-xs sm:text-sm leading-relaxed">
                {t.inquiry.subtitle}
              </p>
            </div>

            {/* Inquiry Type Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 border-b border-[#2B2925] pb-4">
              {[
                { id: 'GENERAL', label: t.inquiry.general },
                { id: 'PROJECT', label: t.inquiry.project },
                { id: 'UNIT', label: t.inquiry.unit },
                { id: 'INVESTOR', label: t.inquiry.investor },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInquiryType(tab.id as any)}
                  className={`py-2 text-xs uppercase tracking-wider font-medium text-center transition-all ${
                    inquiryType === tab.id
                      ? 'text-[#B79A62] border-b-2 border-[#B79A62]'
                      : 'text-[#8C867E] hover:text-[#C8C0B3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                    {t.inquiry.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.inquiry.fullNamePlaceholder}
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                    {t.inquiry.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.inquiry.emailPlaceholder}
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                    {t.inquiry.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.inquiry.phonePlaceholder}
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                    {t.inquiry.country}
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder={t.inquiry.countryPlaceholder}
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                    {t.inquiry.selectProject}
                  </label>
                  <select
                    value={formData.interestedProject}
                    onChange={(e) => setFormData({ ...formData, interestedProject: e.target.value })}
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors"
                  >
                    <option value="">General Portfolio</option>
                    <option value="Living Legends">Living Legends (Dubailand)</option>
                    <option value="The Court Tower">The Court Tower (Dubai Canal)</option>
                    <option value="The Exchange Tower">The Exchange Tower (Business Bay)</option>
                    <option value="Horizon Residences">Horizon Residences</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                    {t.inquiry.propertyType}
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors"
                  >
                    <option value="">Any / Flexible</option>
                    <option value="Signature Villa">Signature Villa</option>
                    <option value="Penthouse">Sky Penthouse</option>
                    <option value="Luxury Apartment">Luxury Apartment (1-3 BR)</option>
                    <option value="Commercial Office">Commercial Headquarters</option>
                    <option value="Full Floor">Full Floor Investment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#C8C0B3] text-xs uppercase tracking-wider mb-1">
                  {t.inquiry.message}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.inquiry.messagePlaceholder}
                  className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2.5 text-[#F5F2EB] text-sm focus:outline-none focus:border-[#B79A62] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${whatsAppText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#25D366]/80 font-medium tracking-wider uppercase transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <span className="text-[#3A3731]">•</span>
                  <a
                    href="tel:+97143699000"
                    className="inline-flex items-center gap-1.5 text-xs text-[#C8C0B3] hover:text-[#F5F2EB] font-medium tracking-wider uppercase transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+971 4 369 9000</span>
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#D8BE8A] active:bg-[#9E824C] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? t.inquiry.submitting : t.inquiry.submit}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
