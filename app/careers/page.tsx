'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Briefcase, MapPin, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    notes: '',
  });

  const jobs = [
    {
      id: 'job-1',
      title: 'Senior Architectural Project Manager',
      department: 'Development & Engineering',
      location: 'Dubai, UAE (Headquarters)',
      type: 'Full-time',
      desc:
        'Lead the architectural coordination, contractor supervision, and aesthetic fidelity of upcoming signature residential towers in Dubai.',
      requirements: [
        'Bachelor or Master in Architecture / Civil Engineering',
        'Minimum 8 years of experience with leading UAE high-rise developers',
        'Demonstrated track record with RERA statutory compliance',
        'Fluency in English (Arabic proficiency advantageous)',
      ],
    },
    {
      id: 'job-2',
      title: 'Private Client Portfolio Director',
      department: 'Sales & Client Advisory',
      location: 'Dubai, UAE',
      type: 'Full-time',
      desc:
        'Manage high-net-worth individual (HNWI) relationships and institutional family office acquisitions across GCC, European, and Asian markets.',
      requirements: [
        '5+ years proven ultra-luxury real estate advisory in Dubai',
        'Established network of sovereign and private investor client bases',
        'Exceptional contract negotiation and bespoke presentation skills',
      ],
    },
    {
      id: 'job-3',
      title: 'Executive Legal Counsel (Real Estate & Escrow)',
      department: 'Corporate Legal & Governance',
      location: 'Dubai, UAE',
      type: 'Full-time',
      desc:
        'Oversee real estate sales purchase agreements (SPAs), joint venture structures, escrow compliance, and UAE property law advisory.',
      requirements: [
        'Law degree and qualification with UAE real estate practice',
        'Deep knowledge of Dubai Land Department (DLD) and RERA regulations',
        'Minimum 6 years post-qualification experience',
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
              CAREERS & LEADERSHIP
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-normal tracking-tight mb-4">
              Shape the Skyline of Tomorrow.
            </h1>
            <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed">
              At Tanmiyat Real Estate Development, our people are our greatest architectural asset.
              We seek exceptional professionals who share our relentless pursuit of precision,
              integrity, and enduring craft.
            </p>
          </div>

          {/* Job List */}
          <div className="space-y-6 mb-20">
            {jobs.map((job) => {
              const isExpanded = selectedJob === job.id;
              return (
                <div
                  key={job.id}
                  className="bg-[#171715] border border-[#25221E] transition-all"
                >
                  <div
                    onClick={() => setSelectedJob(isExpanded ? null : job.id)}
                    className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#1E1C18] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 text-xs text-[#8C867E] mb-2">
                        <span className="text-[#B79A62] uppercase tracking-wider">
                          {job.department}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B79A62]" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <h3 className="font-editorial text-2xl text-[#F5F2EB]">{job.title}</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-[#0A0A09] border border-[#332F28] text-xs text-[#C8C0B3]">
                        {job.type}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#B79A62]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#8C867E]" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-[#25221E] space-y-6">
                      <p className="text-sm text-[#C8C0B3] leading-relaxed">{job.desc}</p>

                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#F5F2EB] mb-3">
                          Candidate Requirements:
                        </h4>
                        <ul className="space-y-2 text-xs text-[#8C867E]">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62] mt-1.5 shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4">
                        <a
                          href="#apply-form"
                          className="px-6 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider inline-block hover:bg-[#D8BE8A] transition-colors"
                        >
                          Apply for this Position
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Application Form */}
          <div id="apply-form" className="max-w-2xl mx-auto bg-[#171715] border border-[#25221E] p-8 sm:p-12">
            <h2 className="font-editorial text-3xl text-[#F5F2EB] mb-2">Executive Candidate Submission</h2>
            <p className="text-xs text-[#8C867E] mb-8">
              Submit your curriculum vitae and executive portfolio directly to the Tanmiyat Talent
              Committee.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#B79A62] mx-auto" />
                <h3 className="font-editorial text-2xl text-[#F5F2EB]">Application Transmitted</h3>
                <p className="text-xs text-[#C8C0B3] max-w-sm mx-auto">
                  Thank you for your interest in joining Tanmiyat. Our HR leadership will review
                  your credentials in strict confidence.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                    LinkedIn or Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                    Professional Background Summary
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly state your relevant accomplishments in real estate development..."
                    className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D8BE8A] transition-colors"
                  >
                    SUBMIT APPLICATION
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
