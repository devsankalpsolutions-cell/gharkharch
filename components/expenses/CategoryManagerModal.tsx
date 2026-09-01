'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useFinance } from '@/context/FinanceContext';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();

  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleUpdate = (oldCat: string) => {
    if (!editName.trim()) return;
    updateCategory(oldCat, editName.trim());
    setEditingCat(null);
    setEditName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Expense Categories"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add new custom category (e.g. Pet Care)..."
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Categories List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto pr-1">
          {categories.map(cat => (
            <div
              key={cat}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl"
            >
              {editingCat === cat ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 rounded-lg focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(cat)}
                    className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCat(null)}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {cat}
                    </span>
                  </div>

                  {cat !== 'Other' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setEditName(cat);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
