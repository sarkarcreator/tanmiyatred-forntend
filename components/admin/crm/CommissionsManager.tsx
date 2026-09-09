'use client';

import React, { useState } from 'react';
import { CommissionItem, CommissionStatus } from '@/types';
import {
  Coins,
  CheckCircle,
  Clock,
  Check,
  User,
  Building,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  initialCommissions: CommissionItem[];
}

export const CommissionsManager: React.FC<Props> = ({ initialCommissions }) => {
  const [commissions, setCommissions] = useState<CommissionItem[]>(initialCommissions);

  const handleUpdateStatus = async (id: string, status: CommissionStatus) => {
    try {
      const res = await fetch(`/api/commissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setCommissions((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalCommissionsValue = commissions.reduce((acc, cur) => acc + cur.amount, 0);
  const pendingValue = commissions
    .filter((c) => c.status === 'PENDING_APPROVAL')
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl text-[#F5F2EB]">Brokerage Commissions</h1>
            <span className="px-2.5 py-0.5 bg-[#B79A62]/10 border border-[#B79A62]/30 text-[#B79A62] text-xs font-semibold">
              AED {(totalCommissionsValue / 1000).toFixed(0)}K Total Recorded
            </span>
          </div>
          <p className="text-xs text-[#8C867E]">
            Advisor splits, direct sales rewards, management approval, and escrow disbursements.
          </p>
        </div>

        <div className="p-3 bg-[#171715] border border-[#25221E] text-xs flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A756D] block">Pending Approval</span>
            <span className="font-editorial text-lg text-amber-300">
              AED {(pendingValue / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#171715] border border-[#25221E] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Advisor / Broker</th>
              <th className="py-3.5 px-4">Deal Reference</th>
              <th className="py-3.5 px-4">Commission (AED)</th>
              <th className="py-3.5 px-4">Split %</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">
            {commissions.map((comm) => (
              <tr key={comm.id} className="hover:bg-[#1E1C18]">
                <td className="py-3.5 px-4 font-medium text-[#F5F2EB]">
                  <div>{comm.agent?.name || 'Private Advisor'}</div>
                  <div className="text-[10px] text-[#7A756D]">
                    BRN: {comm.agent?.brn || 'RERA Registered'}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-[#F5F2EB]">Deal #{comm.dealId.slice(-6).toUpperCase()}</div>
                  <div className="text-[10px] text-[#7A756D]">
                    {new Date(comm.createdAt || comm.dueDate || Date.now()).toLocaleDateString()}
                  </div>
                </td>

                <td className="py-3.5 px-4 font-editorial text-sm text-[#B79A62]">
                  AED {comm.amount.toLocaleString()}
                </td>

                <td className="py-3.5 px-4">
                  <span className="text-[#D8BE8A] font-medium">{comm.splitPercentage}% Split</span>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      comm.status === 'PAID'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : comm.status === 'APPROVED'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {comm.status.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right space-x-1.5">
                  {comm.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => handleUpdateStatus(comm.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-[#B79A62] text-[#0A0A09] hover:bg-[#D8BE8A] text-[10px] font-semibold uppercase tracking-wider"
                    >
                      Approve
                    </button>
                  )}
                  {comm.status === 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus(comm.id, 'PAID')}
                      className="px-2.5 py-1 bg-emerald-950/70 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-[10px] font-semibold uppercase tracking-wider"
                    >
                      Mark Disbursed
                    </button>
                  )}
                  {comm.status === 'PAID' && (
                    <span className="text-[10px] text-emerald-400 font-medium">Disbursed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
