'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProjectItem, UnitItem } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import {
  MapPin,
  Download,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Maximize2,
  Phone,
  MessageSquare,
  Bed,
  Bath,
  Layers,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProjectDetailClientProps {
  project: ProjectItem;
}

export const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ project }) => {
  const { t, locale, isRTL } = useI18n();
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'VILLAS' | 'APARTMENTS' | 'PENTHOUSES'>('ALL');
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const title = locale === 'ar' && project.titleAr ? project.titleAr : project.title;
  const location = locale === 'ar' && project.locationAr ? project.locationAr : project.location;
  const overview = locale === 'ar' && project.overviewAr ? project.overviewAr : project.overview;
  const architecture =
    locale === 'ar' && project.architectureAr ? project.architectureAr : project.architecture;

  const units = project.units || [];
  const gallery = project.gallery || [];

  const filteredUnits = units.filter((u) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'VILLAS') return u.type.toLowerCase().includes('villa');
    if (activeTab === 'APARTMENTS') return u.type.toLowerCase().includes('apartment');
    if (activeTab === 'PENTHOUSES') return u.type.toLowerCase().includes('penthouse');
    return true;
  });

  const handleUnitReserve = (unit: UnitItem) => {
    setSelectedUnit(unit);
    setInquiryModalOpen(true);
  };

  const openGallery = (index: number) => setGalleryIndex(index);
  const closeGallery = () => setGalleryIndex(null);
  const showPreviousImage = () => {
    if (!gallery.length || galleryIndex === null) return;
    setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length);
  };
  const showNextImage = () => {
    if (!gallery.length || galleryIndex === null) return;
    setGalleryIndex((galleryIndex + 1) % gallery.length);
  };

  const whatsAppNumber = '+971480082664';
  const whatsAppUrl = `https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Tanmiyat. I am requesting full documentation and private availability for ${project.title}.`
  )}`;

  return (
    <div className="text-[#F5F2EB]">
      {/* 1. FULL-SCREEN HERO */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-end pb-20 overflow-hidden bg-[#0A0A09]">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-[#0A0A09]/50 to-[#0A0A09]/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#B79A62] text-[#0A0A09] text-[10px] font-bold uppercase tracking-[0.2em]">
                {project.status === 'COMPLETED' ? 'DELIVERED & OPERATIONAL' : project.status}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#C8C0B3] bg-black/50 px-3 py-1 border border-[#3A3731]">
                {project.category.replace('_', ' ')}
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#F5F2EB]">
              {title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C8C0B3]">
              <MapPin className="w-4 h-4 text-[#B79A62]" />
              <span className="tracking-wider uppercase">{location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW & ARCHITECTURE */}
      <section className="py-20 sm:py-28 bg-[#0A0A09] border-b border-[#22201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Overview */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block">
                DEVELOPMENT OVERVIEW
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB] font-normal leading-snug">
                {project.tagline}
              </h2>
              <p className="text-base text-[#C8C0B3] font-light leading-relaxed">
                {overview}
              </p>

              {architecture && (
                <div className="pt-6 border-t border-[#22201C] space-y-3">
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-[#F5F2EB] uppercase">
                    Architectural Finesse & Design
                  </h3>
                  <p className="text-sm text-[#C8C0B3] font-light leading-relaxed">
                    {architecture}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Facts Card */}
            <div className="lg:col-span-5 bg-[#171715] border border-[#25221E] p-8 space-y-6">
              <h3 className="font-editorial text-2xl text-[#F5F2EB] border-b border-[#2B2925] pb-4">
                Executive Specifications
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-2 border-b border-[#22201C]">
                  <span className="text-[#8C867E] uppercase tracking-wider">Location:</span>
                  <span className="text-[#F5F2EB] font-medium text-right">{location}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#22201C]">
                  <span className="text-[#8C867E] uppercase tracking-wider">Status:</span>
                  <span className="text-[#B79A62] font-semibold">{project.status}</span>
                </div>
                {project.startingPrice && (
                  <div className="flex justify-between py-2 border-b border-[#22201C]">
                    <span className="text-[#8C867E] uppercase tracking-wider">Starting Price:</span>
                    <span className="font-editorial text-base text-[#B79A62]">
                      AED {project.startingPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                {project.completionDate && (
                  <div className="flex justify-between py-2 border-b border-[#22201C]">
                    <span className="text-[#8C867E] uppercase tracking-wider">Handover:</span>
                    <span className="text-[#F5F2EB]">{project.completionDate}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-[#8C867E] uppercase tracking-wider">Developer:</span>
                  <span className="text-[#F5F2EB]">Tanmiyat Real Estate Development LLC</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#D8BE8A] transition-all"
                >
                  REQUEST PROJECT DOSSIER
                </button>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#1D1B18] border border-[#332F28] text-[#25D366] text-xs font-semibold tracking-wider uppercase hover:border-[#25D366]/50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct WhatsApp Inquiries</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AMENITIES */}
      {project.amenities && project.amenities.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#0E0E0D] border-b border-[#22201C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-2">
                CURATED AMENITIES
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB]">
                World-Class Leisure & Lifestyle
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.amenities.map((am) => (
                <div
                  key={am.id}
                  className="bg-[#171715] border border-[#25221E] p-6 space-y-3 hover:border-[#B79A62]/40 transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#0A0A09] border border-[#332F28] text-[#B79A62]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-xl text-[#F5F2EB]">
                    {locale === 'ar' && am.titleAr ? am.titleAr : am.title}
                  </h3>
                  {am.description && (
                    <p className="text-xs text-[#8C867E] leading-relaxed">
                      {am.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. RESIDENCES & UNIT INVENTORY */}
      <section id="residences" className="py-20 sm:py-28 bg-[#0A0A09] border-b border-[#22201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-2">
                RESIDENCES & FLOOR PLANS
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB]">
                {t.units.title}
              </h2>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-2">
              {(['ALL', 'VILLAS', 'APARTMENTS', 'PENTHOUSES'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-[#B79A62] text-[#0A0A09] font-semibold'
                      : 'bg-[#171715] text-[#C8C0B3] border border-[#2D2A26]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredUnits.length === 0 ? (
            <div className="p-12 text-center bg-[#171715] border border-[#25221E]">
              <Building className="w-8 h-8 text-[#B79A62] mx-auto mb-3" />
              <p className="text-[#C8C0B3] text-sm">
                No units matching this category are currently unreserved. Please contact private
                sales for unlisted off-market inventory.
              </p>
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="mt-4 px-6 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider"
              >
                Inquire With Private Sales
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#25221E] bg-[#171715]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider border-b border-[#25221E]">
                  <tr>
                    <th className="py-4 px-6">{t.units.unitNumber}</th>
                    <th className="py-4 px-4">{t.units.type}</th>
                    <th className="py-4 px-4">{t.units.bedrooms}</th>
                    <th className="py-4 px-4">{t.units.bathrooms}</th>
                    <th className="py-4 px-4">{t.units.area}</th>
                    <th className="py-4 px-4">{t.units.price}</th>
                    <th className="py-4 px-4">{t.units.status}</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">
                  {filteredUnits.map((u) => (
                    <tr key={u.id} className="hover:bg-[#1E1C18] transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F5F2EB]">{u.unitNumber}</td>
                      <td className="py-4 px-4">{u.type}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-[#B79A62]" />
                          <span>{u.bedrooms}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-3.5 h-3.5 text-[#B79A62]" />
                          <span>{u.bathrooms}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{u.areaSqFt.toLocaleString()} sq.ft.</td>
                      <td className="py-4 px-4 font-editorial text-sm text-[#B79A62]">
                        AED {u.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            u.status === 'AVAILABLE'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                              : u.status === 'RESERVED'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                              : 'bg-stone-900 text-stone-400'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.status === 'AVAILABLE' ? (
                          <button
                            onClick={() => handleUnitReserve(u)}
                            className="px-4 py-2 bg-[#B79A62] text-[#0A0A09] font-semibold text-[11px] tracking-wider uppercase hover:bg-[#D8BE8A] transition-colors"
                          >
                            {t.units.reserve}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnitReserve(u)}
                            className="px-4 py-2 border border-[#3A3731] text-[#8C867E] hover:text-[#F5F2EB] text-[11px] tracking-wider uppercase transition-colors"
                          >
                            Waitlist
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 5. ARCHITECTURAL GALLERY */}
      {gallery.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#0A0A09] border-b border-[#22201C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-2">
                VISUAL ARCHIVE
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB]">
                Architectural Photography & Interiors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.map((img, idx) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => openGallery(idx)}
                  className="group relative aspect-[4/3] bg-[#171715] overflow-hidden cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62]"
                  aria-label={`Open ${img.caption || `${project.title} image ${idx + 1}`}`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.caption || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                    <Maximize2 className="w-6 h-6 text-[#B79A62]" />
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/75 backdrop-blur-sm text-[11px] text-[#C8C0B3] line-clamp-1">
                      {locale === 'ar' && img.captionAr ? img.captionAr : img.caption}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BROCHURES & DOWNLOADS */}
      {project.documents && project.documents.length > 0 && (
        <section className="py-16 bg-[#121210] border-b border-[#22201C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-editorial text-2xl text-[#F5F2EB]">
                  Official Architectural Documentation
                </h3>
                <p className="text-xs text-[#8C867E]">
                  Download high-resolution master plans, floor layouts, and technical specifications.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {project.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setInquiryModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#171715] border border-[#2D2A26] text-xs uppercase tracking-wider text-[#C8C0B3] hover:border-[#B79A62] hover:text-[#B79A62] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>{doc.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. FLOATING CTA STRIP */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366] text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
          aria-label="WhatsApp Private Advisor"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </a>

        <button
          onClick={() => setInquiryModalOpen(true)}
          className="px-6 py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase shadow-2xl hover:bg-[#D8BE8A] transition-all"
        >
          REQUEST INFORMATION
        </button>
      </div>

      {/* VISUAL ARCHIVE LIGHTBOX */}
      {galleryIndex !== null && gallery[galleryIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Visual Archive image viewer"
          onClick={closeGallery}
        >
          <button
            type="button"
            onClick={closeGallery}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-[#171715]/90 border border-[#3A3731] text-[#F5F2EB] flex items-center justify-center hover:border-[#B79A62] hover:text-[#B79A62] transition-colors"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#171715]/90 border border-[#3A3731] text-[#F5F2EB] flex items-center justify-center hover:border-[#B79A62] hover:text-[#B79A62] transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#171715]/90 border border-[#3A3731] text-[#F5F2EB] flex items-center justify-center hover:border-[#B79A62] hover:text-[#B79A62] transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-6xl h-[78vh] flex items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={gallery[galleryIndex].imageUrl}
              alt={gallery[galleryIndex].caption || project.title}
              fill
              sizes="90vw"
              referrerPolicy="no-referrer"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] text-center">
            <p className="text-xs sm:text-sm text-[#C8C0B3] bg-[#0A0A09]/85 border border-[#2D2A26] px-4 py-2">
              {locale === 'ar' && gallery[galleryIndex].captionAr
                ? gallery[galleryIndex].captionAr
                : gallery[galleryIndex].caption || `${galleryIndex + 1} / ${gallery.length}`}
            </p>
          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => {
          setInquiryModalOpen(false);
          setSelectedUnit(null);
        }}
        initialProject={project.title}
        initialUnit={selectedUnit?.unitNumber}
        initialType={selectedUnit ? 'UNIT' : 'PROJECT'}
      />
    </div>
  );
};