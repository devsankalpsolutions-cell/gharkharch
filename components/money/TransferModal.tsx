'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AccountType } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { ArrowRightLeft, Building2, Wallet } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { balances, addTransfer, selectedMonth } = useFinance();

  const [fromAccount, setFromAccount] = useState<AccountType>('Bank');
  const [toAccount, setToAccount] = useState<AccountType>('Wallet');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const defaultDate = `${selectedMonth}-01`;
    setDate(defaultDate);
    setAmount('');
    setDescription('Money transfer between accounts');
  }, [isOpen, selectedMonth]);

  const handleSwap = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) return;

    const success = addTransfer(fromAccount, toAccount, numAmt, date, description);
    if (success) onClose();
  };

  const availableInFrom = fromAccount === 'Bank' ? balances.bankBalance : balances.walletBalance;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Money (Bank ↔ Wallet)"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From / To Accounts */}
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <div className="flex-1 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">From Account</span>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1 mt-0.5">
              {fromAccount === 'Bank' ? <Building2 className="w-4 h-4 text-indigo-500" /> : <Wallet className="w-4 h-4 text-emerald-500" />}
              <span>{fromAccount}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Avail: ₹{availableInFrom.toLocaleString('en-IN')}</p>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-xs border border-slate-200 dark:border-slate-600 hover:scale-105 transition-all text-slate-600 dark:text-slate-200"
            title="Swap Accounts"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">To Account</span>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1 mt-0.5">
              {toAccount === 'Bank' ? <Building2 className="w-4 h-4 text-indigo-500" /> : <Wallet className="w-4 h-4 text-emerald-500" />}
              <span>{toAccount}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Avail: ₹{(toAccount === 'Bank' ? balances.bankBalance : balances.walletBalance).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transfer Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              max={availableInFrom}
              placeholder="e.g. 5000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transfer Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description / Reason
          </label>
          <input
            type="text"
            placeholder="e.g. ATM withdrawal for weekly wallet cash"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
          >
            Execute Transfer
          </button>
        </div>
      </form>
    </Modal>
  );
};
