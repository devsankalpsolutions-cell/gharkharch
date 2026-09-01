'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { House, HouseAdjustmentType } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { Sliders } from 'lucide-react';

interface HouseCreditAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House;
}

const TYPES: HouseAdjustmentType[] = ['Credit', 'Outstanding', 'Refund', 'Adjustment'];

export const HouseCreditAdjustmentModal: React.FC<HouseCreditAdjustmentModalProps> = ({
  isOpen,
  onClose,
  house,
}) => {
  const { addHouseCreditAdjustment } = useFinance();

  const [memberId, setMemberId] = useState(house.members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<HouseAdjustmentType>('Credit');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!memberId || isNaN(numAmount) || numAmount <= 0) return;

    addHouseCreditAdjustment({
      houseId: house.id,
      memberId,
      amount: numAmount,
      type,
      reason: reason.trim() || `Manual ${type} adjustment`,
      date,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚙️ Custom Ledger Adjustment"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Select Member *
          </label>
          <select
            value={memberId}
            onChange={e => setMemberId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
          >
            {house.members.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adjustment Type *
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as HouseAdjustmentType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reason *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. September Overpayment Adjustment"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Additional details..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
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
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            <span>Save Adjustment</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
