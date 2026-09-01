'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { House } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { Home, MapPin, IndianRupee } from 'lucide-react';

interface HouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: House | null;
}

export const HouseModal: React.FC<HouseModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addHouse, updateHouse } = useFinance();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAddress(initialData.address || '');
      setMonthlyBudget(initialData.monthlyBudget?.toString() || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setAddress('Greenwoods CHS, Baner, Pune');
      setMonthlyBudget('60000');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const numBudget = monthlyBudget ? parseFloat(monthlyBudget) : undefined;

    if (initialData) {
      updateHouse({
        ...initialData,
        name,
        address,
        monthlyBudget: numBudget,
        description,
      });
    } else {
      addHouse({
        name,
        address,
        startDate: new Date().toISOString().split('T')[0],
        currency: 'INR',
        monthlyBudget: numBudget,
        description,
        ownerMemberId: 'mem_me',
        members: [
          { id: 'mem_me', name: 'Rajesh (Me)', email: 'rajesh@example.com', role: 'Owner/Admin' },
        ],
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit House / PG' : '🏡 Create Shared House / PG'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            House / PG Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. ABC Girls PG / Our Flat 402"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Address / Location
          </label>
          <input
            type="text"
            placeholder="e.g. Flat 402, Greenwoods CHS, Baner"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Monthly House Budget Target (₹)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 60000"
            value={monthlyBudget}
            onChange={e => setMonthlyBudget(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description / Rules
          </label>
          <textarea
            rows={2}
            placeholder="Notes about rent agreement, landlord details, house rules..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            {initialData ? 'Save Changes' : 'Create House'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
