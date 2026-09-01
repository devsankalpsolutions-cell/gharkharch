'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { House, HouseMember } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { RefreshCw } from 'lucide-react';

interface HouseCreditRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House;
  member: HouseMember;
  availableCredit: number;
}

export const HouseCreditRefundModal: React.FC<HouseCreditRefundModalProps> = ({
  isOpen,
  onClose,
  house,
  member,
  availableCredit,
}) => {
  const { refundHouseCredit } = useFinance();

  const [refundAmount, setRefundAmount] = useState(availableCredit.toString());
  const [reason, setReason] = useState('Member Requested Credit Refund');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(refundAmount);
    if (isNaN(num) || num <= 0 || num > availableCredit) return;

    refundHouseCredit(house.id, member.id, num, reason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`💸 Refund Credit to ${member.name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs space-y-1">
          <p className="font-bold text-amber-900 dark:text-amber-200">
            Available Advance Credit: ₹{availableCredit.toLocaleString('en-IN')}
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-[11px]">
            Refunding will reduce {member.name}'s credit balance and log the refund in history.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Refund Amount (₹) *
          </label>
          <input
            type="number"
            required
            max={availableCredit}
            min="1"
            value={refundAmount}
            onChange={e => setRefundAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reason / Notes
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Confirm Refund</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
