'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Trip } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { Plane, Calendar, MapPin, IndianRupee } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Trip | null;
}

export const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addTrip, updateTrip } = useFinance();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDestination(initialData.destination);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setBudget(initialData.budget?.toString() || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDestination('');
      setStartDate('2026-09-10');
      setEndDate('2026-09-14');
      setBudget('50000');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination) return;

    const numBudget = budget ? parseFloat(budget) : undefined;

    if (initialData) {
      updateTrip({
        ...initialData,
        name,
        destination,
        startDate,
        endDate,
        budget: numBudget,
        description,
      });
    } else {
      addTrip({
        name,
        destination,
        startDate,
        endDate,
        description,
        budget: numBudget,
        currency: 'INR',
        adminParticipantId: 'part_me',
        participants: [
          { id: 'part_me', name: 'Rajesh (Me)', email: 'rajesh@example.com' },
        ],
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Trip' : '✈️ Create New Trip'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Trip Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Goa Beach Weekend 2026"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Destination *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Goa, India"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Optional Trip Budget (₹)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 50000"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description / Notes
          </label>
          <textarea
            rows={2}
            placeholder="Trip notes, hotel bookings, flight details..."
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
            {initialData ? 'Save Changes' : 'Create Trip'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
