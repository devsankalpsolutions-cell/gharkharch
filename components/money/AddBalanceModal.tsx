'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AccountType } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { Building2, Wallet } from 'lucide-react';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccount?: AccountType;
}

export const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isOpen,
  onClose,
  defaultAccount = 'Bank',
}) => {
  const { balances, updateAccountBalance } = useFinance();

  const [account, setAccount] = useState<AccountType>(defaultAccount);
  const [newBalance, setNewBalance] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    setAccount(defaultAccount);
    const current = defaultAccount === 'Bank' ? balances.bankBalance : balances.walletBalance;
    setNewBalance(current.toString());
    setReason('Manual balance update');
  }, [defaultAccount, isOpen, balances]);

  const handleAccountChange = (acc: AccountType) => {
    setAccount(acc);
    const current = acc === 'Bank' ? balances.bankBalance : balances.walletBalance;
    setNewBalance(current.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBalance);
    if (isNaN(val) || val < 0) return;

    updateAccountBalance(account, val, reason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Account Balance"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Account to Adjust
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAccountChange('Bank')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                account === 'Bank'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bank Balance (₹{balances.bankBalance.toLocaleString('en-IN')})</span>
            </button>

            <button
              type="button"
              onClick={() => handleAccountChange('Wallet')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                account === 'Wallet'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Wallet Cash (₹{balances.walletBalance.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            New Available Balance (₹) *
          </label>
          <input
            type="number"
            required
            min="0"
            placeholder="e.g. 55000"
            value={newBalance}
            onChange={e => setNewBalance(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reason / Remark for Adjustment
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Initial setup / Bank passbook audit"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
          >
            Update Balance
          </button>
        </div>
      </form>
    </Modal>
  );
};
