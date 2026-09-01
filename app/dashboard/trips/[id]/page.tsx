'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  calculateTripParticipantBalances,
  minimizeDebtSettlements,
} from '@/lib/settlementEngine';
import { TripExpenseModal } from '@/components/trips/TripExpenseModal';
import { TripParticipantModal } from '@/components/trips/TripParticipantModal';
import { TripSettlementModal } from '@/components/trips/TripSettlementModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Plane,
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
  PieChart,
  UserPlus,
} from 'lucide-react';
import { TripExpense } from '@/lib/types';

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const {
    trips,
    tripExpenses,
    tripSettlements,
    deleteTripExpense,
  } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TripExpense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [settlementData, setSettlementData] = useState<{
    fromId: string;
    toId: string;
    suggestedAmount: number;
  } | null>(null);

  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Trip Not Found</h3>
        <button
          onClick={() => router.push('/dashboard/trips')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  // Filter expenses & settlements for this trip
  const expenses = tripExpenses.filter(e => e.tripId === tripId);
  const settlements = tripSettlements.filter(s => s.tripId === tripId);

  // Compute Participant Net Balances
  const participantBalances = calculateTripParticipantBalances(
    trip.participants,
    expenses,
    settlements
  );

  // Compute Minimal Debt Settlement Instructions
  const minimalSettlements = minimizeDebtSettlements(
    participantBalances.map(pb => ({
      participantId: pb.participantId,
      participantName: pb.participantName,
      netBalance: pb.netBalance,
    }))
  );

  // Stats for "Me"
  const myBalanceInfo = participantBalances.find(pb => pb.participantId === 'part_me') || {
    totalPaid: 0,
    totalShare: 0,
    netBalance: 0,
  };

  const totalTripExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button & Header Banner */}
      <button
        onClick={() => router.push('/dashboard/trips')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Trips</span>
      </button>

      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl shadow-xl border border-indigo-800/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{trip.destination}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">{trip.name}</h2>
            <p className="text-xs text-indigo-200 mt-1">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)} • {trip.participants.length} Participants
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddParticipantOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Member</span>
            </button>

            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Trip Expense</span>
            </button>
          </div>
        </div>

        {trip.budget && (
          <div className="p-3 bg-white/5 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between font-bold text-indigo-200">
              <span>Trip Budget Progress</span>
              <span>
                {formatCurrency(totalTripExpense, currency, formatStyle)} / {formatCurrency(trip.budget, currency, formatStyle)}
              </span>
            </div>
            <div className="w-full h-2 bg-indigo-950 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totalTripExpense > trip.budget ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (totalTripExpense / trip.budget) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Trip Expense */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Trip Expense
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalTripExpense, currency, formatStyle)}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            {expenses.length} Expense item(s)
          </p>
        </div>

        {/* My Paid Amount */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            My Total Paid
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(myBalanceInfo.totalPaid, currency, formatStyle)}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Total out of pocket
          </p>
        </div>

        {/* My Share */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            My Actual Share
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(myBalanceInfo.totalShare, currency, formatStyle)}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            My consumed cost
          </p>
        </div>

        {/* My Net Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            My Net Balance
          </span>
          <h3
            className={`text-2xl font-black mt-1 ${
              myBalanceInfo.netBalance >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {myBalanceInfo.netBalance >= 0 ? '+' : ''}
            {formatCurrency(myBalanceInfo.netBalance, currency, formatStyle)}
          </h3>
          <p className="text-xs font-semibold mt-1 text-slate-500 dark:text-slate-400">
            {myBalanceInfo.netBalance >= 0 ? 'To receive from group' : 'You owe group'}
          </p>
        </div>
      </div>

      {/* Splitwise-Style Minimal Debt Settlement Engine */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Splitwise Debt Minimization Engine</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">Optimized Settlement Plan</span>
        </div>

        {minimalSettlements.length === 0 ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All trip balances are completely settled! No pending debts.</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {minimalSettlements.map((st, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                      <span className="text-rose-600 dark:text-rose-400">{st.fromParticipantName}</span> pays{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">{st.toParticipantName}</span>
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {formatCurrency(st.amount, currency, formatStyle)}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSettlementData({
                        fromId: st.fromParticipantId,
                        toId: st.toParticipantId,
                        suggestedAmount: st.amount,
                      })
                    }
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                  >
                    <span>Settle Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Participants Directory & Balances Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
          Trip Participant Balances ({trip.participants.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {participantBalances.map(pb => (
            <div
              key={pb.participantId}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {pb.participantName}
                </span>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                    pb.netBalance >= 0
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {pb.netBalance >= 0 ? 'Receives' : 'Owes'}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(pb.totalPaid, currency, formatStyle)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Share:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(pb.totalShare, currency, formatStyle)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-extrabold">
                  <span>Net Balance:</span>
                  <span className={pb.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {formatCurrency(pb.netBalance, currency, formatStyle)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Expenses Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
            Trip Expense Ledger ({expenses.length})
          </h3>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No expenses recorded for this trip yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map(exp => {
              const paidPerson = trip.participants.find(p => p.id === exp.paidByParticipantId)?.name || 'Unknown';

              return (
                <div
                  key={exp.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {exp.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                        {exp.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Split: {exp.splitMethod}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <TripExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        trip={trip}
      />

      <TripParticipantModal
        isOpen={isAddParticipantOpen}
        onClose={() => setIsAddParticipantOpen(false)}
        tripId={trip.id}
      />

      {settlementData && (
        <TripSettlementModal
          isOpen={!!settlementData}
          onClose={() => setSettlementData(null)}
          trip={trip}
          initialData={settlementData}
        />
      )}

      {deletingExpenseId && (
        <ConfirmDialog
          isOpen={!!deletingExpenseId}
          onClose={() => setDeletingExpenseId(null)}
          onConfirm={() => deleteTripExpense(deletingExpenseId)}
          title="Delete Trip Expense"
          message="Are you sure you want to delete this trip expense? Net balances will be recalculated automatically."
        />
      )}
    </div>
  );
}
