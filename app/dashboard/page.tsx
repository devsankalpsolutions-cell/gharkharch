'use client';

import React from 'react';
import Link from 'next/link';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SmartAdviceCard } from '@/components/dashboard/SmartAdviceCard';
import { FinancialCharts } from '@/components/dashboard/FinancialCharts';
import { RecentTransactionsWidget } from '@/components/dashboard/RecentTransactionsWidget';
import {
  Plane,
  Home,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const { trips, tripExpenses, houses, houseExpenses } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Active Trip stats
  const activeTrip = trips[0];
  const activeTripExpenses = activeTrip ? tripExpenses.filter(e => e.tripId === activeTrip.id) : [];
  const activeTripTotal = activeTripExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Active House stats
  const activeHouse = houses[0];
  const activeHouseExpenses = activeHouse ? houseExpenses.filter(e => e.houseId === activeHouse.id) : [];
  const activeHouseTotal = activeHouseExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 8 Primary Personal Financial Summary Cards */}
      <SummaryCards />

      {/* Trips & House Context Preview Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TRIPS CONTEXT CARD */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                <Plane className="w-4 h-4" />
                <span>TRIP FINANCE CONTEXT</span>
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {trips.length} Active Trip(s)
              </span>
            </div>

            {activeTrip ? (
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {activeTrip.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTrip.destination} • {activeTrip.participants.length} Participants
                </p>
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex justify-between items-center text-xs">
                  <span className="text-slate-500">Trip Total Spent</span>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
                    {formatCurrency(activeTripTotal, currency, formatStyle)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active trips currently recorded.</p>
            )}
          </div>

          <Link
            href="/dashboard/trips"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Trips Hub (Splitwise)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* HOUSE / PG CONTEXT CARD */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200/50">
                <Home className="w-4 h-4" />
                <span>HOUSE / PG FINANCE CONTEXT</span>
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {houses.length} House(s)
              </span>
            </div>

            {activeHouse ? (
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {activeHouse.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeHouse.address} • {activeHouse.members.length} Members
                </p>
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex justify-between items-center text-xs">
                  <span className="text-slate-500">Monthly House Expenses</span>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
                    {formatCurrency(activeHouseTotal, currency, formatStyle)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No shared houses currently recorded.</p>
            )}
          </div>

          <Link
            href="/dashboard/house"
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Manage House Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Smart Money Assistant Advisory Card */}
      <SmartAdviceCard />

      {/* Charts & Visual Analytics */}
      <FinancialCharts />

      {/* Recent Transactions Widget */}
      <RecentTransactionsWidget />
    </div>
  );
}
