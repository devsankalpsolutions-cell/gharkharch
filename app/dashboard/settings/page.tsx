'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { RepaymentStrategy } from '@/lib/types';
import {
  Settings,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Sliders,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserPreferences } = useAuth();
  const { settings, updateSettings, resetDemoData } = useFinance();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [numberFormat, setNumberFormat] = useState<'indian' | 'international' | 'standard'>(user?.numberFormat || 'indian');

  const [salaryDate, setSalaryDate] = useState(settings.salaryDate.toString());
  const [expectedSalary, setExpectedSalary] = useState(settings.expectedMonthlySalary.toString());
  const [minimumSafety, setMinimumSafety] = useState(settings.minimumSafetyBalance.toString());
  const [strategy, setStrategy] = useState<RepaymentStrategy>(settings.repaymentStrategy || 'balanced');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({ name, email, currency, numberFormat });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    const salDate = parseInt(salaryDate, 10) || 5;
    const expSal = parseFloat(expectedSalary) || 40000;
    const minSafe = parseFloat(minimumSafety) || 5000;

    updateSettings({
      salaryDate: salDate,
      expectedMonthlySalary: expSal,
      minimumSafetyBalance: minSafe,
      repaymentStrategy: strategy,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Preferences & Financial Parameters</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Application Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure salary dates, minimum safety reserve, repayment strategies, and profile settings.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* 1. Smart Financial Settings Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5" />
          <span>Smart Money & Salary Parameters</span>
        </div>

        <form onSubmit={handleSaveFinancial} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Salary Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Salary Arrival Date (Day of Month) *
              </label>
              <select
                value={salaryDate}
                onChange={e => setSalaryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1">1st of every month</option>
                <option value="2">2nd of every month</option>
                <option value="5">5th of every month (Default)</option>
                <option value="7">7th of every month</option>
                <option value="10">10th of every month</option>
                <option value="15">15th of every month</option>
                <option value="20">20th of every month</option>
                <option value="25">25th of every month</option>
                <option value="30">30th / Last day of month</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Used to compute the Next Salary Countdown & Safe Daily Spending Limit.
              </p>
            </div>

            {/* Expected Monthly Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expected Monthly Salary (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={expectedSalary}
                onChange={e => setExpectedSalary(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used for month-end cash flow projections and budget planning.
              </p>
            </div>

            {/* Minimum Safety Balance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Minimum Safety Balance Reserve (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={minimumSafety}
                onChange={e => setMinimumSafety(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Emergency cushion that will NEVER be recommended for liability repayment.
              </p>
            </div>

            {/* Preferred Repayment Strategy */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Default Repayment Strategy *
              </label>
              <select
                value={strategy}
                onChange={e => setStrategy(e.target.value as RepaymentStrategy)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="balanced">Balanced Strategy (Pro-rata distribution)</option>
                <option value="quick_win">Quick Win Strategy (Smallest loan first)</option>
                <option value="largest_first">Largest First Strategy (Largest principal first)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Default algorithm used by Smart Liability Payment Advisor.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Financial Parameters</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. User Profile & Currency Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
          <IndianRupee className="w-5 h-5" />
          <span>User Profile & Formatting</span>
        </div>

        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                User Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Number Formatting Standard
              </label>
              <select
                value={numberFormat}
                onChange={e => setNumberFormat(e.target.value as 'indian' | 'standard')}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="indian">Indian Lakhs System (e.g. ₹1,50,000)</option>
                <option value="standard">International Standard (e.g. ₹150,000)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Demo Data Reset */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            Reset Demo Data
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Reset all balances, incomes, expenses, liabilities, and settings back to initial sample values.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
}
