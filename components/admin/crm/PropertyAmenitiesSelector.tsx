'use client';

import React from 'react';
import { PROPERTY_AMENITY_OPTIONS } from '@/types';

export function PropertyAmenitiesSelector({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter(item => item !== id) : [...value, id]);
  const groups = [
    ['PROPERTY_FEATURE', 'Property Features'],
    ['BUILDING_AMENITY', 'Building Amenities'],
    ['VIEW_FEATURE', 'Views'],
  ] as const;
  return (
    <div className="mt-5 space-y-5">
      <div>
        <label className="label">Property Features & Amenities</label>
        <p className="text-[11px] text-[#6E6962] mb-3">Select only what this specific property/building actually provides. Unselected amenities will not appear publicly.</p>
      </div>
      {groups.map(([category, title]) => (
        <div key={category}>
          <h3 className="text-xs uppercase tracking-[0.12em] text-[#B79A62] mb-2">{title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {PROPERTY_AMENITY_OPTIONS.filter(option => option.category === category).map(option => {
              const checked = value.includes(option.label);
              return (
                <label key={option.id} className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${checked ? 'border-[#B79A62] bg-[#B79A62]/10 text-[#F5F2EB]' : 'border-[#2B2823] bg-[#0A0A09] text-[#8C867E]'}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(option.label)} className="accent-[#B79A62]" />
                  <span className="text-[11px] leading-tight">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {value.length > 0 && <div className="text-[11px] text-[#B79A62]">{value.length} selected</div>}
    </div>
  );
}
