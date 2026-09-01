'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import { HouseModal } from '@/components/house/HouseModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Home,
  Plus,
  MapPin,
  Users,
  Search,
  Trash2,
  Edit2,
  ArrowRight,
  Building,
} from 'lucide-react';
import { House } from '@/lib/types';

export default function HouseDirectoryPage() {
  const { houses, houseExpenses, houseIncomes, deleteHouse } = useFinance();
  const { user } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  const filteredHouses = houses.filter(
    h =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.address && h.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Home className="w-4 h-4" />
            <span>Shared Household & PG Module</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Manage House / PG / Flat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage shared flat expenses, rent contributions, electricity bills, maid/groceries, and roommate ledgers & advance credits.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create House / PG</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search houses or PGs by name or location..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Houses Grid */}
      {filteredHouses.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Building className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">No House / PG Created</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create a shared house to track flat rent, maid salary, grocery bills, member ledgers, and advance credits!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.map(house => {
            const hExpenses = houseExpenses.filter(e => e.houseId === house.id);
            const hIncomes = houseIncomes.filter(i => i.houseId === house.id);

            const totalExp = hExpenses.reduce((acc, curr) => acc + curr.amount, 0);
            const totalInc = hIncomes.reduce((acc, curr) => acc + curr.amount, 0);
            const houseBal = totalInc - totalExp;

            return (
              <div
                key={house.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {house.address && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                          <MapPin className="w-3 h-3" />
                          <span>{house.address}</span>
                        </span>
                      )}
                      <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1.5 leading-tight">
                        {house.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingHouse(house)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                        title="Edit House"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(house.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete House"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{house.members.length} members</span>
                    </span>
                    {house.monthlyBudget && (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Target: {formatCurrency(house.monthlyBudget, currency, formatStyle)}
                      </span>
                    )}
                  </div>

                  {/* Financial Mini Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        House Expense
                      </span>
                      <p className="font-extrabold text-slate-900 dark:text-slate-100">
                        {formatCurrency(totalExp, currency, formatStyle)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        House Balance
                      </span>
                      <p className={`font-extrabold ${houseBal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(houseBal, currency, formatStyle)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {hExpenses.length} Shared bill(s)
                  </span>

                  <Link
                    href={`/dashboard/house/${house.id}`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                  >
                    <span>Manage House</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <HouseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editingHouse && (
        <HouseModal
          isOpen={!!editingHouse}
          onClose={() => setEditingHouse(null)}
          initialData={editingHouse}
        />
      )}

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={() => deleteHouse(deletingId)}
          title="Delete House"
          message="Are you sure you want to delete this house? All associated house expenses, incomes, and credit records will be removed."
        />
      )}
    </div>
  );
}
