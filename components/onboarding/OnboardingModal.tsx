'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Building2,
  Wallet,
  TrendingUp,
  CalendarClock,
  PiggyBank,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { updateSettings, updateAccountBalance, refreshFromDb, addToast } = useFinance();
  const { user, updateUserPreferences } = useAuth();

  const [bankBalance, setBankBalance] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<string>('');
  const [expectedSalary, setExpectedSalary] = useState<string>('');
  const [salaryDate, setSalaryDate] = useState<number>(5);
  const [safetyReserve, setSafetyReserve] = useState<string>('5000');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedBank = parseFloat(bankBalance) || 0;
    const parsedWallet = parseFloat(walletBalance) || 0;
    const parsedSalary = parseFloat(expectedSalary) || 0;
    const parsedReserve = parseFloat(safetyReserve) || 0;

    try {
      // 1. Submit setup to database
      const res = await fetch('/api/finance/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_setup',
          data: {
            bankBalance: parsedBank,
            walletBalance: parsedWallet,
            expectedMonthlySalary: parsedSalary,
            salaryDate: Number(salaryDate),
            minimumSafetyBalance: parsedReserve,
            repaymentStrategy: 'balanced',
          },
        }),
      });

      const json = await res.json();

      if (json.success) {
        // 2. Update local state
        updateSettings({
          expectedMonthlySalary: parsedSalary,
          salaryDate: Number(salaryDate),
          minimumSafetyBalance: parsedReserve,
        });

        updateAccountBalance('Bank', parsedBank, 'Initial Setup Bank Balance');
        updateAccountBalance('Wallet', parsedWallet, 'Initial Setup Wallet Balance');

        // 3. Mark setup completed
        updateUserPreferences({ isInitialSetupCompleted: true });

        // 4. Refresh context from DB
        await refreshFromDb();

        addToast('Financial workspace setup completed successfully!', 'success');
        onClose();
      } else {
        addToast(json.error || 'Failed to save setup data.', 'error');
      }
    } catch (err: any) {
      addToast('Error setting up workspace. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0D2044] border border-[#1E3A8A] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-sky-500/20 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome to Famvexa! 👋
          </h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Let's set up your private financial workspace. Enter your initial balance and monthly details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SECTION 1: ACCOUNT BALANCES */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs font-extrabold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 1. Initial Account Balances
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" /> Bank Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  placeholder="e.g. 50000"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-sky-400" /> Wallet / Cash (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  placeholder="e.g. 5000"
                  value={walletBalance}
                  onChange={(e) => setWalletBalance(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: MONTHLY SALARY & PAY DAY */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> 2. Monthly Income Details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Expected Monthly Pay (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  placeholder="e.g. 145000"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5 text-indigo-400" /> Salary Date of Month
                </label>
                <select
                  value={salaryDate}
                  onChange={(e) => setSalaryDate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of month
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: SAFETY RESERVE */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4" /> 3. Emergency Safety Reserve
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Minimum Safety Reserve Pool (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="e.g. 5000"
                value={safetyReserve}
                onChange={(e) => setSafetyReserve(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Amount locked as emergency safety net for safe spending calculations.
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Complete Setup & Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
