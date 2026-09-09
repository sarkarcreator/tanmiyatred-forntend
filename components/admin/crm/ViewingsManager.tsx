'use client';

import React, { useState } from 'react';
import { ViewingItem } from '@/types';
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Video,
  MapPin,
} from 'lucide-react';

interface Props {
  initialViewings: ViewingItem[];
}

type ViewingStatus = ViewingItem['status'];

export const ViewingsManager: React.FC<Props> = ({ initialViewings }) => {
  const [viewings, setViewings] = useState<ViewingItem[]>(initialViewings);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredViewings = viewings.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (id: string, status: ViewingStatus) => {
    try {
      const res = await fetch(`/api/viewings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setViewings((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl text-[#F5F2EB]">Private Viewings & Tours</h1>
            <span className="px-2.5 py-0.5 bg-[#B79A62]/10 border border-[#B79A62]/30 text-[#B79A62] text-xs font-semibold">
              {viewings.filter((v) => v.status === 'CONFIRMED').length} Upcoming Tours
            </span>
          </div>
          <p className="text-xs text-[#8C867E]">
            Executive VIP on-site viewings, chauffeur appointments, and high-definition virtual tours.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#171715] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      <div className="bg-[#171715] border border-[#25221E] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Property / Residence</th>
              <th className="py-3.5 px-4">Tour Format</th>
              <th className="py-3.5 px-4">Assigned Advisor</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">
            {filteredViewings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#7A756D]">
                  No viewing reservations found for the selected filter.
                </td>
              </tr>
            ) : (
              filteredViewings.map((v) => (
                <tr key={v.id} className="hover:bg-[#1E1C18]">
                  <td className="py-3.5 px-4 font-medium text-[#F5F2EB]">
                    <div className="flex items-center gap-1.5 text-[#D8BE8A]">
                      <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{v.date}</span>
                    </div>
                    <div className="text-[10px] text-[#7A756D] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{v.time || '14:00'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#F5F2EB]">{v.customerName}</div>
                    <div className="text-[10px] text-[#8C867E] flex items-center gap-2 mt-0.5">
                      <a
                        href={`tel:${v.customerPhone}`}
                        className="hover:text-[#B79A62] inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#B79A62]" />
                        <span>{v.customerPhone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${v.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline"
                        title="WhatsApp client"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[#F5F2EB] line-clamp-1">{v.propertyTitle || 'Prime Development'}</div>
                    <div className="text-[10px] text-[#7A756D]">Ref: {v.propertyId}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-[#A8A196]">
                      {v.viewingType === 'VIRTUAL_TOUR' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-blue-400" />
                          <span>Virtual Tour</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-[#B79A62]" />
                          <span>On-Site Private</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[#A8A196]">{v.agentName || 'Assigned Broker'}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        v.status === 'CONFIRMED'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          : v.status === 'COMPLETED'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {v.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(v.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-emerald-950/70 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-[10px] uppercase tracking-wider font-semibold"
                          title="Mark Tour Completed"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(v.id, 'CANCELLED')}
                          className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-red-300 text-[10px] uppercase tracking-wider"
                          title="Cancel Tour"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
