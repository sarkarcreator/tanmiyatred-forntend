'use client';

import React from 'react';

type Amenity = { id: string; label: string; category: 'PROPERTY_FEATURE' | 'BUILDING_AMENITY' | 'VIEW_FEATURE' };

const OPTIONS: Amenity[] = [
  { id: 'maid-room', label: "Maid's Room", category: 'PROPERTY_FEATURE' }, { id: 'study-room', label: 'Study Room', category: 'PROPERTY_FEATURE' },
  { id: 'drivers-room', label: "Driver's Room", category: 'PROPERTY_FEATURE' }, { id: 'storage-room', label: 'Storage Room', category: 'PROPERTY_FEATURE' },
  { id: 'laundry-room', label: 'Laundry Room', category: 'PROPERTY_FEATURE' }, { id: 'powder-room', label: 'Powder Room', category: 'PROPERTY_FEATURE' },
  { id: 'walk-in-closet', label: 'Walk-in Closet', category: 'PROPERTY_FEATURE' }, { id: 'balcony', label: 'Balcony', category: 'PROPERTY_FEATURE' },
  { id: 'terrace', label: 'Terrace', category: 'PROPERTY_FEATURE' }, { id: 'private-pool', label: 'Private Pool', category: 'PROPERTY_FEATURE' },
  { id: 'private-garden', label: 'Private Garden', category: 'PROPERTY_FEATURE' }, { id: 'private-elevator', label: 'Private Elevator', category: 'PROPERTY_FEATURE' },
  { id: 'built-in-wardrobes', label: 'Built-in Wardrobes', category: 'PROPERTY_FEATURE' }, { id: 'floor-to-ceiling-windows', label: 'Floor-to-Ceiling Windows', category: 'PROPERTY_FEATURE' },
  { id: 'central-ac', label: 'Central AC', category: 'PROPERTY_FEATURE' }, { id: 'smart-home', label: 'Smart Home', category: 'PROPERTY_FEATURE' },
  { id: 'swimming-pool', label: 'Swimming Pool', category: 'BUILDING_AMENITY' }, { id: 'gym', label: 'Gym / Fitness Centre', category: 'BUILDING_AMENITY' },
  { id: 'sauna', label: 'Sauna', category: 'BUILDING_AMENITY' }, { id: 'steam-room', label: 'Steam Room', category: 'BUILDING_AMENITY' },
  { id: 'jacuzzi', label: 'Jacuzzi', category: 'BUILDING_AMENITY' }, { id: 'kids-play-area', label: "Kids' Play Area", category: 'BUILDING_AMENITY' },
  { id: 'bbq-area', label: 'BBQ Area', category: 'BUILDING_AMENITY' }, { id: 'residents-lounge', label: "Residents' Lounge", category: 'BUILDING_AMENITY' },
  { id: 'clubhouse', label: 'Clubhouse', category: 'BUILDING_AMENITY' }, { id: 'cinema-room', label: 'Cinema Room', category: 'BUILDING_AMENITY' },
  { id: 'games-room', label: 'Games Room', category: 'BUILDING_AMENITY' }, { id: 'yoga-studio', label: 'Yoga / Fitness Studio', category: 'BUILDING_AMENITY' },
  { id: 'business-centre', label: 'Business Centre', category: 'BUILDING_AMENITY' }, { id: 'concierge', label: 'Concierge Service', category: 'BUILDING_AMENITY' },
  { id: 'security', label: '24/7 Security', category: 'BUILDING_AMENITY' }, { id: 'cctv', label: 'CCTV', category: 'BUILDING_AMENITY' },
  { id: 'reception', label: 'Reception / Lobby', category: 'BUILDING_AMENITY' }, { id: 'elevators', label: 'Elevators', category: 'BUILDING_AMENITY' },
  { id: 'parking', label: 'Private Parking', category: 'BUILDING_AMENITY' }, { id: 'visitor-parking', label: 'Visitor Parking', category: 'BUILDING_AMENITY' },
  { id: 'sea-view', label: 'Sea View', category: 'VIEW_FEATURE' }, { id: 'marina-view', label: 'Marina View', category: 'VIEW_FEATURE' },
  { id: 'burj-khalifa-view', label: 'Burj Khalifa View', category: 'VIEW_FEATURE' }, { id: 'city-view', label: 'City View', category: 'VIEW_FEATURE' },
  { id: 'community-view', label: 'Community View', category: 'VIEW_FEATURE' }, { id: 'park-view', label: 'Park View', category: 'VIEW_FEATURE' },
];

export function PropertyAmenitiesSelector({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const toggle = (label: string) => onChange(value.includes(label) ? value.filter(item => item !== label) : [...value, label]);
  const groups = [['PROPERTY_FEATURE', 'Property Features'], ['BUILDING_AMENITY', 'Building Amenities'], ['VIEW_FEATURE', 'Views']] as const;
  return <div className="mt-5 space-y-5">
    <div><label className="label">Property Features & Amenities</label><p className="text-[11px] text-[#6E6962] mb-3">Select only what this property or building actually provides. Unselected items will not appear publicly.</p></div>
    {groups.map(([category, title]) => <div key={category}><h3 className="text-xs uppercase tracking-[0.12em] text-[#B79A62] mb-2">{title}</h3><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">{OPTIONS.filter(option => option.category === category).map(option => { const checked = value.includes(option.label); return <label key={option.id} className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${checked ? 'border-[#B79A62] bg-[#B79A62]/10 text-[#F5F2EB]' : 'border-[#2B2823] bg-[#0A0A09] text-[#8C867E]'}`}><input type="checkbox" checked={checked} onChange={() => toggle(option.label)} className="accent-[#B79A62]"/><span className="text-[11px] leading-tight">{option.label}</span></label>; })}</div></div>)}
    {value.length > 0 && <div className="text-[11px] text-[#B79A62]">{value.length} selected</div>}
  </div>;
}
