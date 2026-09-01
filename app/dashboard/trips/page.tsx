'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TripModal } from '@/components/trips/TripModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Plane,
  Plus,
  MapPin,
  Calendar,
  Users,
  Search,
  Trash2,
  Edit2,
  ArrowRight,
} from 'lucide-react';
import { Trip } from '@/lib/types';

export default function TripsPage() {
  const { trips, tripExpenses, deleteTrip } = useFinance();
  const { user } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const filteredTrips = trips.filter(
    t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Plane className="w-4 h-4" />
            <span>Trip Expense Hub</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Vacation & Group Trips
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track vacation expenses, split hotel/food bills with friends, and settle debts cleanly.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Trip</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search trips by title or destination..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Plane className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">No Trips Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first group trip to start splitting expenses with friends!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => {
            const expensesForTrip = tripExpenses.filter(e => e.tripId === trip.id);
            const totalSpent = expensesForTrip.reduce((acc, curr) => acc + curr.amount, 0);
            const budgetPct = trip.budget ? Math.min(100, Math.round((totalSpent / trip.budget) * 100)) : 0;

            return (
              <div
                key={trip.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                        <MapPin className="w-3 h-3" />
                        <span>{trip.destination}</span>
                      </span>
                      <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1.5 leading-tight">
                        {trip.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTrip(trip)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                        title="Edit Trip"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(trip.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.participants.length} members</span>
                    </span>
                  </div>

                  {/* Budget & Spend Progress */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Total Spent</span>
                      <span className="text-slate-900 dark:text-white">
                        {formatCurrency(totalSpent, currency, formatStyle)}
                      </span>
                    </div>

                    {trip.budget && (
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              budgetPct > 100 ? 'bg-rose-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${budgetPct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 text-right">
                          Budget: {formatCurrency(trip.budget, currency, formatStyle)} ({budgetPct}%)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {expensesForTrip.length} Expense item(s)
                  </span>

                  <Link
                    href={`/dashboard/trips/${trip.id}`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                  >
                    <span>View Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <TripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editingTrip && (
        <TripModal
          isOpen={!!editingTrip}
          onClose={() => setEditingTrip(null)}
          initialData={editingTrip}
        />
      )}

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteTrip(deletingId)}
          title="Delete Trip"
          message="Are you sure you want to delete this trip? All trip expenses and settlements will be removed."
        />
      )}
    </div>
  );
}
