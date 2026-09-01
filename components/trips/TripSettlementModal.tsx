'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Trip, PaymentMethod } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { Sparkles, CheckSquare, Square } from 'lucide-react';

interface TripSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  initialData?: { fromId: string; toId: string; suggestedAmount: number } | null;
}

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Cash', 'Bank Transfer'];

export const TripSettlementModal: React.FC<TripSettlementModalProps> = ({
  isOpen,
  onClose,
  trip,
  initialData,
}) => {
  const { addTripSettlement } = useFinance();

  const [fromId, setFromId] = useState(trip.participants[0]?.id || '');
  const [toId, setToId] = useState(trip.participants[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');
  const [syncToPersonal, setSyncToPersonal] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFromId(initialData.fromId);
      setToId(initialData.toId);
      setAmount(initialData.suggestedAmount.toString());
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!fromId || !toId || fromId === toId || isNaN(numAmount) || numAmount <= 0) return;

    addTripSettlement(
      {
        tripId: trip.id,
        fromParticipantId: fromId,
        toParticipantId: toId,
        amount: numAmount,
        date,
        paymentMethod,
        notes,
        status: 'Completed',
      },
      syncToPersonal
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🤝 Record Trip Settlement"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payer (Who Pays) *
            </label>
            <select
              value={fromId}
              onChange={e => setFromId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {trip.participants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Receiver (Gets Paid) *
            </label>
            <select
              value={toId}
              onChange={e => setToId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {trip.participants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Settlement Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 1750"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Sync Checkbox */}
        {fromId === 'part_me' && (
          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Deduct from Personal Finance?
                </p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                  Deducts ₹{amount || '0'} from your personal Bank/Wallet balance.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSyncToPersonal(!syncToPersonal)}
              className="text-indigo-600 dark:text-indigo-400"
            >
              {syncToPersonal ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
          </div>
        )}

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
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
          >
            Confirm Settlement
          </button>
        </div>
      </form>
    </Modal>
  );
};
