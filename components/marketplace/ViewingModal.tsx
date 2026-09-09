'use client';

import React, { useState } from 'react';
import { PropertyItem } from '@/types';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ViewingModalProps {
  property: PropertyItem;
  onClose: () => void;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({ property, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00');
  const [viewingType, setViewingType] = useState<'PHYSICAL' | 'VIRTUAL_LIVE'>('PHYSICAL');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) {
      setError('Please provide your name, phone number, and preferred date.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Create viewing
      const viewingRes = await fetch('/api/viewings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          agentId: property.agentId || 'agent-1',
          agentName: property.agent?.name || 'Senior Private Advisor',
          date,
          time,
          viewingType,
          notes,
        }),
      });

      // 2. Also register lead directly into CRM pipeline with stage VIEWING_BOOKED
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          customerType: property.purpose === 'FOR_RENT' ? 'TENANT' : 'BUYER',
          source: 'VIEWING_REQUEST',
          propertyId: property.id,
          propertyTitle: property.title,
          agentId: property.agentId,
          stage: 'VIEWING_BOOKED',
          priority: 'HIGH',
          budgetMax: property.price,
          preferredLocation: property.community,
          notes: `Requested ${viewingType} viewing on ${date} at ${time}. ${notes ? `Client note: ${notes}` : ''}`,
          initialNote: `Client booked a private viewing for ${property.title} via portal.`,
        }),
      });

      if (!viewingRes.ok) {
        throw new Error('Failed to reserve viewing appointment');
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#171715] border border-[#25221E] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C867E] hover:text-[#F5F2EB] p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[#F5F2EB]">Private Viewing Reserved</h3>
            <p className="text-xs sm:text-sm text-[#A8A196] leading-relaxed">
              Your appointment for <strong className="text-[#F5F2EB]">{property.title}</strong> has been logged with our executive concierge.
              {property.agent?.name && (
                <span className="block mt-2 text-[#B79A62]">
                  Assigned Advisor: {property.agent.name} (BRN: {property.agent.brn})
                </span>
              )}
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#B79A62] text-[#0A0A09] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D8BE8A] transition-colors"
              >
                Return to Portfolio
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79A62] font-semibold block">
                Private Consultation
              </span>
              <h2 className="font-editorial text-2xl text-[#F5F2EB]">Schedule Exclusive Viewing</h2>
              <p className="text-xs text-[#8C867E] line-clamp-1">{property.title} • {property.community}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900/60 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Viewing Type */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setViewingType('PHYSICAL')}
                  className={`py-2 px-3 border text-center uppercase tracking-wider text-[11px] font-medium transition-colors ${
                    viewingType === 'PHYSICAL'
                      ? 'bg-[#25221E] border-[#B79A62] text-[#F5F2EB]'
                      : 'border-[#25221E] text-[#8C867E] hover:border-[#3A3731]'
                  }`}
                >
                  In-Person Viewing
                </button>
                <button
                  type="button"
                  onClick={() => setViewingType('VIRTUAL_LIVE')}
                  className={`py-2 px-3 border text-center uppercase tracking-wider text-[11px] font-medium transition-colors ${
                    viewingType === 'VIRTUAL_LIVE'
                      ? 'bg-[#25221E] border-[#B79A62] text-[#F5F2EB]'
                      : 'border-[#25221E] text-[#8C867E] hover:border-[#3A3731]'
                  }`}
                >
                  Live Video Walkthrough
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lord Alexander Wright"
                  className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@domain.com"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Time Window
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  >
                    <option value="10:00">10:00 AM (Morning)</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">02:00 PM (Afternoon)</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:30">05:30 PM (Golden Hour)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Specific Requirements or Questions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need chauffeur transfer from DIFC / Interested in immediate handover..."
                  className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2 text-[#F5F2EB] outline-none resize-none"
                />
              </div>

              {/* Footer CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] font-semibold text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Confirming Appointment...' : 'Confirm Private Viewing'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7A756D] text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B79A62]" />
                <span>Confidential registration under Dubai Land Department broker privacy standards.</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
