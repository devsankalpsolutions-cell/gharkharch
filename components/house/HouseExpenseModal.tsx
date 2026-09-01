'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { House, HouseFinancialTreatment, PaymentMethod, TripSplitMethod, AppliedMemberCredit } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { getAccountFromPaymentMethod } from '@/lib/storage';
import { Sparkles, CheckSquare, Square, Info, Loader2 } from 'lucide-react';

interface HouseExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House;
}

const HOUSE_CATEGORIES = [
  'Rent',
  'Electricity',
  'Groceries',
  'Water Bill',
  'Internet / Wi-Fi',
  'Maid / Cook Salary',
  'Gas Cylinder',
  'Repairs & Maintenance',
  'House Supplies',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = ['Bank Transfer', 'UPI', 'Cash', 'Credit Card', 'Debit Card'];

export const HouseExpenseModal: React.FC<HouseExpenseModalProps> = ({
  isOpen,
  onClose,
  house,
}) => {
  const { addHouseExpense, houseCreditRecords, balances } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Rent');
  const [paidBy, setPaidBy] = useState(house.members[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [financialTreatment, setFinancialTreatment] = useState<HouseFinancialTreatment>('Personal Account Payment');
  const [splitMethod, setSplitMethod] = useState<TripSplitMethod>('equal');
  const [notes, setNotes] = useState('');
  const [syncToPersonal, setSyncToPersonal] = useState(true);
  const [selectedCredits, setSelectedCredits] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available member credits for this house
  const availableCredits = houseCreditRecords.filter(
    c => c.houseId === house.id && c.status === 'Available' && c.remainingAmount > 0
  );

  useEffect(() => {
    // Default select all available credits
    const defaultSel: Record<string, boolean> = {};
    availableCredits.forEach(c => {
      defaultSel[c.id] = true;
    });
    setSelectedCredits(defaultSel);
    setIsSubmitting(false);
  }, [isOpen, house.id]);

  const numAmount = parseFloat(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !title || isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);

    // Calculate equal share split
    const perMemberShare = Math.round((numAmount / house.members.length) * 100) / 100;
    const shares = house.members.map(m => ({
      memberId: m.id,
      shareAmount: perMemberShare,
    }));

    // Prepare applied member credits
    const appliedCredits: AppliedMemberCredit[] = availableCredits
      .filter(c => selectedCredits[c.id])
      .map(c => ({
        memberId: c.memberId,
        creditRecordId: c.id,
        amount: Math.min(c.remainingAmount, perMemberShare),
      }));

    addHouseExpense(
      {
        houseId: house.id,
        title,
        amount: numAmount,
        date,
        category,
        paidByMemberId: paidBy,
        splitMethod,
        shares,
        paymentMethod,
        financialTreatment,
        appliedCredits,
        notes,
      },
      syncToPersonal
    );

    setIsSubmitting(false);
    setTitle('');
    setAmount('');
    setNotes('');
    onClose();
  };

  const targetAccount = getAccountFromPaymentMethod(paymentMethod);
  const availableBal = targetAccount === 'Bank' ? balances.bankBalance : balances.walletBalance;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏠 Record House / PG Expense"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expense Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. September Flat Rent or Electricity Bill"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Total Bill Amount (₹) *
            </label>
            <input
              type="number"
              inputMode="decimal"
              required
              min="1"
              placeholder="e.g. 34000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            >
              {HOUSE_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paid By Member *
            </label>
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100"
            >
              {house.members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Treatment Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Financial Treatment / Account Source *
          </label>
          <div className="space-y-2 text-xs">
            {[
              {
                id: 'Personal Account Payment',
                label: 'Personal Account Payment',
                desc: 'Paid from my personal Bank/UPI account. Other members owe me their share.',
              },
              {
                id: 'PG / House Income',
                label: 'PG / House Income Pool',
                desc: 'Paid from collected house pool money.',
              },
            ].map(opt => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  financialTreatment === opt.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="financialTreatment"
                  value={opt.id}
                  checked={financialTreatment === opt.id}
                  onChange={() => setFinancialTreatment(opt.id as HouseFinancialTreatment)}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <p className="font-bold text-xs">{opt.label}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Available Member Credits (Rule 7, 9, 25) */}
        {availableCredits.length > 0 && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Available Member Advance Credits</span>
            </div>

            {availableCredits.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-200">
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {c.memberName}: ₹{c.remainingAmount.toLocaleString('en-IN')} Advance Credit
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Would you like to apply {c.memberName}'s credit to this bill?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCredits(prev => ({ ...prev, [c.id]: !prev[c.id] }))
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCredits[c.id]
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {selectedCredits[c.id] ? 'Use Credit' : 'Keep Credit'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sync to Personal Bank confirmation */}
        {financialTreatment === 'Personal Account Payment' && (
          <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Deduct ₹{numAmount.toLocaleString('en-IN')} from my Personal Bank Balance?
                </p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                  Avail: ₹{availableBal.toLocaleString('en-IN')} ({targetAccount})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSyncToPersonal(!syncToPersonal)}
              className="text-indigo-600 dark:text-indigo-400 shrink-0"
            >
              {syncToPersonal ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Record House Expense</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
