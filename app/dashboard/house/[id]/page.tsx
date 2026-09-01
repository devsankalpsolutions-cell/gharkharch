'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  calculateHouseMemberLedgers,
  minimizeDebtSettlements,
} from '@/lib/settlementEngine';
import { HouseExpenseModal } from '@/components/house/HouseExpenseModal';
import { HouseIncomeModal } from '@/components/house/HouseIncomeModal';
import { HouseMemberModal } from '@/components/house/HouseMemberModal';
import { HouseSettlementModal } from '@/components/house/HouseSettlementModal';
import { HouseCreditRefundModal } from '@/components/house/HouseCreditRefundModal';
import { HouseCreditAdjustmentModal } from '@/components/house/HouseCreditAdjustmentModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Home,
  Plus,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Printer,
  UserPlus,
  Clock,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { HouseExpense, HouseMember } from '@/lib/types';

export default function HouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const houseId = params.id as string;

  const {
    houses,
    houseExpenses,
    houseIncomes,
    houseCreditRecords,
    houseCreditAdjustments,
    houseSettlements,
    recurringHouseExpenses,
    deleteHouseExpense,
    deleteHouseIncome,
    deleteRecurringHouseExpense,
  } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const [activeTab, setActiveTab] = useState<'ledger' | 'expenses' | 'income' | 'credits' | 'recurring'>('ledger');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [deletingIncomeId, setDeletingIncomeId] = useState<string | null>(null);
  
  // Refund modal target state
  const [refundTarget, setRefundTarget] = useState<{ member: HouseMember; credit: number } | null>(null);

  const [settlementData, setSettlementData] = useState<{
    fromId: string;
    toId: string;
    suggestedAmount: number;
  } | null>(null);

  const house = houses.find(h => h.id === houseId);

  if (!house) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">House / PG Not Found</h3>
        <button
          onClick={() => router.push('/dashboard/house')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
        >
          Back to Houses
        </button>
      </div>
    );
  }

  const hExpenses = houseExpenses.filter(e => e.houseId === houseId);
  const hIncomes = houseIncomes.filter(i => i.houseId === houseId);
  const hSettlements = houseSettlements.filter(s => s.houseId === houseId);
  const hRecurring = recurringHouseExpenses.filter(r => r.houseId === houseId);
  const hCredits = houseCreditRecords.filter(c => c.houseId === houseId);
  const hAdjustments = houseCreditAdjustments.filter(a => a.houseId === houseId);

  // Compute Enhanced House Member Ledgers
  const memberLedgers = calculateHouseMemberLedgers(
    house.members,
    hExpenses,
    hIncomes,
    hSettlements,
    hCredits,
    hAdjustments
  );

  // Compute Minimal Debt Settlement Instructions
  const minimalSettlements = minimizeDebtSettlements(
    memberLedgers.map(ml => ({
      participantId: ml.memberId,
      participantName: ml.memberName,
      netBalance: ml.netPosition,
    }))
  );

  // Financial Summaries
  const totalHouseExpense = hExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalHouseIncome = hIncomes.reduce((acc, curr) => acc + curr.amount, 0);
  const houseBalance = totalHouseIncome - totalHouseExpense;

  const totalMemberCredits = memberLedgers.reduce((acc, curr) => acc + curr.advanceCredit, 0);
  const totalMemberOutstanding = memberLedgers.reduce((acc, curr) => acc + curr.outstandingAmount, 0);

  // Stats for Manager / "Me"
  const myLedger = memberLedgers.find(ml => ml.memberId === 'mem_jenisha' || ml.memberId === 'mem_me') || memberLedgers[0];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button & Header Banner */}
      <button
        onClick={() => router.push('/dashboard/house')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Houses</span>
      </button>

      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl shadow-xl border border-emerald-800/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {house.address && (
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>{house.address}</span>
              </div>
            )}
            <h2 className="text-3xl font-black text-white tracking-tight">{house.name}</h2>
            <p className="text-xs text-emerald-200 mt-1">
              Shared House / PG Ledger • {house.members.length} House Members (Equal Financial Rights)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Member</span>
            </button>

            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ House Income</span>
            </button>

            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ House Expense</span>
            </button>
          </div>
        </div>

        {house.monthlyBudget && (
          <div className="p-3 bg-white/5 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between font-bold text-emerald-200">
              <span>Monthly House Target Progress</span>
              <span>
                {formatCurrency(totalHouseExpense, currency, formatStyle)} / {formatCurrency(house.monthlyBudget, currency, formatStyle)}
              </span>
            </div>
            <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totalHouseExpense > house.monthlyBudget ? 'bg-rose-500' : 'bg-teal-400'
                }`}
                style={{ width: `${Math.min(100, (totalHouseExpense / house.monthlyBudget) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 6 Comprehensive Financial Summary Cards (Rule 28 & 33) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* TOTAL HOUSE EXPENSES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Expenses
          </span>
          <h4 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalHouseExpense, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{hExpenses.length} Shared bills</p>
        </div>

        {/* TOTAL HOUSE INCOME */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            House Income
          </span>
          <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalHouseIncome, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Contributions collected</p>
        </div>

        {/* HOUSE BALANCE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            House Balance
          </span>
          <h4 className={`text-xl font-black mt-1 ${houseBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(houseBalance, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Income minus Expense</p>
        </div>

        {/* TOTAL MEMBER OUTSTANDING */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Member Outstanding
          </span>
          <h4 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalMemberOutstanding, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total due from members</p>
        </div>

        {/* ADVANCE MEMBER CREDITS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Advance Credits
          </span>
          <h4 className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(totalMemberCredits, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total member overpayments</p>
        </div>

        {/* MY RECEIVABLE / OUTSTANDING */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            My Net Position
          </span>
          <h4 className={`text-xl font-black mt-1 ${myLedger?.netPosition >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {myLedger?.netPosition >= 0 ? '+' : ''}
            {formatCurrency(myLedger?.netPosition || 0, currency, formatStyle)}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {myLedger?.netPosition >= 0 ? 'To receive from house' : 'You owe house'}
          </p>
        </div>
      </div>

      {/* TWO SEPARATE SECTIONS: MEMBERS WHO OWE vs MEMBER ADVANCE CREDITS (Rule 30) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 1: MEMBERS WHO OWE (OUTSTANDING) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>MEMBERS WHO OWE (OUTSTANDING)</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">Underpayments</span>
          </div>

          {memberLedgers.filter(m => m.outstandingAmount > 0).length === 0 ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No member has pending outstanding dues!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {memberLedgers
                .filter(m => m.outstandingAmount > 0)
                .map(m => (
                  <div
                    key={m.memberId}
                    className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {m.memberName}
                      </h5>
                      <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold mt-0.5">
                        Share: {formatCurrency(m.currentShare, currency, formatStyle)} • Paid: {formatCurrency(m.totalPaid, currency, formatStyle)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-rose-600 dark:text-rose-400">
                        {formatCurrency(m.outstandingAmount, currency, formatStyle)}
                      </span>
                      <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                        Outstanding Due
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* SECTION 2: MEMBER ADVANCE CREDITS (OVERPAYMENTS) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>MEMBER ADVANCE CREDITS (OVERPAYMENTS)</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">Belongs to Member</span>
          </div>

          {memberLedgers.filter(m => m.advanceCredit > 0).length === 0 ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-500">
              No member currently has advance credit balances.
            </div>
          ) : (
            <div className="space-y-3">
              {memberLedgers
                .filter(m => m.advanceCredit > 0)
                .map(m => {
                  const memberObj = house.members.find(x => x.id === m.memberId);

                  return (
                    <div
                      key={m.memberId}
                      className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {m.memberName}
                        </h5>
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
                          {formatCurrency(m.advanceCredit, currency, formatStyle)} Advance Credit Available
                        </p>
                      </div>

                      {memberObj && (
                        <button
                          onClick={() => setRefundTarget({ member: memberObj, credit: m.advanceCredit })}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Refund Credit</span>
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* HOUSE MEMBER LEDGER STATEMENT TABLE (Rule 16, 17, 29) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-lg">
              House Member Ledger Statement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Financial calculation is equal for all {house.members.length} members. No role hierarchies applied.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdjustmentOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Adjustment</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print House Statement</span>
            </button>
          </div>
        </div>

        {/* Ledger Grid Cards (Rule 29 - New Member Card Design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberLedgers.map(ml => (
            <div
              key={ml.memberId}
              className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {ml.memberName}
                </h4>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                    ml.status === 'Credit Available'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : ml.status === 'Due'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {ml.statusLabel}
                </span>
              </div>

              <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Current Month Share:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(ml.currentShare, currency, formatStyle)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid / Contributed:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(ml.totalPaid, currency, formatStyle)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding Due:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(ml.outstandingAmount, currency, formatStyle)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Advance Credit:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(ml.advanceCredit, currency, formatStyle)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-black text-slate-900 dark:text-white">
                  <span>Net Position:</span>
                  <span className={ml.netPosition >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {ml.netPosition >= 0 ? '+' : ''}
                    {formatCurrency(ml.netPosition, currency, formatStyle)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section: Shared Expenses, House Income, Credit History, Recurring Bills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ledger'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Summary Ledger
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'expenses'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Shared Expenses ({hExpenses.length})
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              House Income ({hIncomes.length})
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'credits'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Credit Logs ({hCredits.length})
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'recurring'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Recurring Bills ({hRecurring.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Summary Ledger */}
        {activeTab === 'ledger' && (
          <div>
            {/* Mobile Stacked Ledger Cards (Rule 2 & 24) */}
            <div className="sm:hidden space-y-3">
              {memberLedgers.map(ml => (
                <div
                  key={ml.memberId}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {ml.memberName}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]">
                      {ml.statusLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Month Share</span>
                      <span className="font-bold">{formatCurrency(ml.currentShare, currency, formatStyle)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Total Paid</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(ml.totalPaid, currency, formatStyle)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Outstanding</span>
                      <span className="font-bold text-rose-600">{formatCurrency(ml.outstandingAmount, currency, formatStyle)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Advance Credit</span>
                      <span className="font-bold text-amber-600">{formatCurrency(ml.advanceCredit, currency, formatStyle)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                    <th className="py-2.5 px-3">Member Name</th>
                    <th className="py-2.5 px-3">Month Share</th>
                    <th className="py-2.5 px-3">Total Paid</th>
                    <th className="py-2.5 px-3">Credits Applied</th>
                    <th className="py-2.5 px-3">Outstanding Due</th>
                    <th className="py-2.5 px-3">Advance Credit</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {memberLedgers.map(ml => (
                    <tr key={ml.memberId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{ml.memberName}</td>
                      <td className="py-3 px-3 font-semibold">{formatCurrency(ml.currentShare, currency, formatStyle)}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">{formatCurrency(ml.totalPaid, currency, formatStyle)}</td>
                      <td className="py-3 px-3 font-semibold">{formatCurrency(ml.creditsApplied, currency, formatStyle)}</td>
                      <td className="py-3 px-3 font-bold text-rose-600">{formatCurrency(ml.outstandingAmount, currency, formatStyle)}</td>
                      <td className="py-3 px-3 font-bold text-amber-600">{formatCurrency(ml.advanceCredit, currency, formatStyle)}</td>
                      <td className="py-3 px-3">
                        <span className="font-extrabold">{ml.statusLabel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Shared Expenses */}
        {activeTab === 'expenses' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {hExpenses.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No shared house expenses recorded yet.</p>
            ) : (
              hExpenses.map(exp => {
                const paidPerson = house.members.find(m => m.id === exp.paidByMemberId)?.name || 'Unknown';

                return (
                  <div
                    key={exp.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{exp.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                          {exp.category}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {exp.financialTreatment || 'Personal Account Payment'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Paid by <span className="font-bold text-slate-700 dark:text-slate-300">{paidPerson}</span> on {formatDate(exp.date)} via {exp.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                        {formatCurrency(exp.amount, currency, formatStyle)}
                      </span>
                      <button
                        onClick={() => setDeletingExpenseId(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: House Income */}
        {activeTab === 'income' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {hIncomes.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No house income records found.</p>
            ) : (
              hIncomes.map(inc => {
                const payer = house.members.find(m => m.id === inc.paidByMemberId)?.name || 'Member';
                const receiver = house.members.find(m => m.id === inc.receivedByMemberId)?.name || 'Manager';

                return (
                  <div
                    key={inc.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{inc.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Contributed by <span className="font-bold text-slate-700 dark:text-slate-300">{payer}</span> to <span className="font-bold text-slate-700 dark:text-slate-300">{receiver}</span> on {formatDate(inc.date)} • {inc.category}
                      </p>
                      {inc.advanceCreditGenerated && inc.advanceCreditGenerated > 0 ? (
                        <span className="inline-block text-[10px] font-bold text-amber-600 mt-0.5">
                          ★ Generated ₹{inc.advanceCreditGenerated.toLocaleString('en-IN')} Advance Credit for {payer}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(inc.amount, currency, formatStyle)}
                      </span>
                      <button
                        onClick={() => setDeletingIncomeId(inc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete income"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 4: Credit History (Rule 26) */}
        {activeTab === 'credits' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {hCredits.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No member credit history recorded yet.</p>
            ) : (
              hCredits.map(cr => (
                <div
                  key={cr.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl text-xs"
                >
                  <div>
                    <h5 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      {cr.memberName}: ₹{cr.amount.toLocaleString('en-IN')} Credit Created
                    </h5>
                    <p className="text-slate-500 mt-0.5">
                      Reason: {cr.reason} • Created: {formatDate(cr.date)}
                    </p>
                    {cr.appliedToExpenseTitle && (
                      <p className="text-emerald-600 font-semibold mt-0.5">
                        Applied to: {cr.appliedToExpenseTitle} on {cr.appliedDate ? formatDate(cr.appliedDate) : ''}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className={`font-black px-2.5 py-1 rounded-lg text-[10px] uppercase ${
                      cr.status === 'Available' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cr.status} ({formatCurrency(cr.remainingAmount, currency, formatStyle)} left)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Recurring Bills */}
        {activeTab === 'recurring' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {hRecurring.map(rec => (
              <div
                key={rec.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{rec.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Due on {rec.dueDateDay}th of every month • {rec.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(rec.expectedAmount, currency, formatStyle)}
                  </span>
                  <button
                    onClick={() => deleteRecurringHouseExpense(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete recurring bill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <HouseExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        house={house}
      />

      <HouseIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        house={house}
      />

      <HouseMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        houseId={house.id}
      />

      {refundTarget && (
        <HouseCreditRefundModal
          isOpen={!!refundTarget}
          onClose={() => setRefundTarget(null)}
          house={house}
          member={refundTarget.member}
          availableCredit={refundTarget.credit}
        />
      )}

      <HouseCreditAdjustmentModal
        isOpen={isAdjustmentOpen}
        onClose={() => setIsAdjustmentOpen(false)}
        house={house}
      />

      {settlementData && (
        <HouseSettlementModal
          isOpen={!!settlementData}
          onClose={() => setSettlementData(null)}
          house={house}
          initialData={settlementData}
        />
      )}

      {deletingExpenseId && (
        <ConfirmDialog
          isOpen={!!deletingExpenseId}
          onClose={() => setDeletingExpenseId(null)}
          onConfirm={() => deleteHouseExpense(deletingExpenseId)}
          title="Delete House Expense"
          message="Are you sure you want to delete this shared house expense?"
        />
      )}

      {deletingIncomeId && (
        <ConfirmDialog
          isOpen={!!deletingIncomeId}
          onClose={() => setDeletingIncomeId(null)}
          onConfirm={() => deleteHouseIncome(deletingIncomeId)}
          title="Delete House Income"
          message="Are you sure you want to delete this house income record?"
        />
      )}
    </div>
  );
}
