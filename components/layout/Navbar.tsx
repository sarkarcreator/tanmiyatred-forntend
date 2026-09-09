'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { TanmiyatLogo } from '@/components/brand/TanmiyatLogo';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { Menu, X, Globe, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { locale, setLocale, t, isRTL } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/properties?purpose=FOR_SALE', label: t.nav.buy },
    { href: '/properties?purpose=FOR_RENT', label: t.nav.rent },
    { href: '/developments', label: t.nav.developments },
    { href: '/agents', label: t.nav.agents },
    { href: '/#about', label: t.nav.about },
    { href: '/news', label: t.nav.news },
    { href: '/contact', label: t.nav.contact },
  ];

  const isHome = pathname === '/';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled || !isHome ? 'bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#25221E] shadow-2xl py-3.5' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center transition-transform hover:scale-[1.01]" aria-label="Tanmiyat Real Estate Development Home">
              <TanmiyatLogo variant="gold" size={isScrolled ? 'sm' : 'md'} showDescriptor={!isScrolled} />
            </Link>

            <nav className="hidden lg:flex items-center space-x-7 rtl:space-x-reverse">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return <Link key={link.href} href={link.href} className={`text-xs uppercase tracking-[0.18em] font-medium transition-all relative py-1 ${isActive ? 'text-[#B79A62]' : 'text-[#E5DFD5] hover:text-[#B79A62]'}`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#B79A62]" />}
                </Link>;
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-5 rtl:space-x-reverse">
              <div className="flex items-center bg-[#171715] border border-[#2D2A26] px-2 py-1 text-xs">
                <Globe className="w-3.5 h-3.5 text-[#B79A62] mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                <button onClick={() => setLocale('en')} className={`px-1.5 py-0.5 tracking-wider transition-colors ${locale === 'en' ? 'text-[#B79A62] font-semibold' : 'text-[#8C867E] hover:text-[#C8C0B3]'}`}>EN</button>
                <span className="text-[#3A3731]">|</span>
                <button onClick={() => setLocale('ar')} className={`px-1.5 py-0.5 tracking-wider transition-colors ${locale === 'ar' ? 'text-[#B79A62] font-semibold' : 'text-[#8C867E] hover:text-[#C8C0B3]'}`}>العربية</button>
              </div>
              <Link href="/admin" className="text-[#8C867E] hover:text-[#C8C0B3] p-1.5 transition-colors" title="Staff / Admin Portal"><Shield className="w-4 h-4" /></Link>
              <button onClick={() => setInquiryModalOpen(true)} className="relative group overflow-hidden px-5 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#D8BE8A] transition-all shadow-md"><span className="relative z-10">{t.nav.inquireNow}</span></button>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} className="px-2.5 py-1 text-xs text-[#B79A62] border border-[#3A3731]">{locale === 'en' ? 'AR' : 'EN'}</button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#F5F2EB] hover:text-[#B79A62] transition-colors" aria-label="Toggle navigation menu">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#B79A62]" />}</button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && <div className="fixed inset-0 top-[60px] z-50 bg-[#0A0A09] border-t border-[#25221E] flex flex-col justify-between px-6 py-8 overflow-y-auto lg:hidden">
          <div className="space-y-6 pt-4">
            <div className="pb-4 border-b border-[#25221E]"><TanmiyatLogo variant="gold" size="sm" showDescriptor={false} /></div>
            <div className="flex flex-col space-y-4">{navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="font-editorial text-2xl text-[#E5DFD5] hover:text-[#B79A62] transition-colors tracking-wide py-1">{link.label}</Link>)}</div>
          </div>
          <div className="pt-8 border-t border-[#25221E] space-y-4">
            <button onClick={() => { setMobileMenuOpen(false); setInquiryModalOpen(true); }} className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase text-center hover:bg-[#D8BE8A] transition-colors">{t.nav.inquireNow}</button>
            <div className="flex items-center justify-between text-xs text-[#8C867E] pt-2"><span>Business Bay, Dubai, UAE</span><Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#B79A62] hover:underline">Admin Portal</Link></div>
          </div>
        </div>}
      </header>
      <InquiryModal isOpen={inquiryModalOpen} onClose={() => setInquiryModalOpen(false)} />
    </>
  );
};