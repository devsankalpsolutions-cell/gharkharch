'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { FloatingQuickActions } from '@/components/layout/FloatingQuickActions';
import { ToastContainer } from '@/components/ui/Toast';
import { IncomeModal } from '@/components/income/IncomeModal';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { LiabilityModal } from '@/components/liabilities/LiabilityModal';
import { TransferModal } from '@/components/money/TransferModal';
import { AddBalanceModal } from '@/components/money/AddBalanceModal';
import { useFinance } from '@/context/FinanceContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {
    isAddIncomeOpen,
    setIsAddIncomeOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    isAddLiabilityOpen,
    setIsAddLiabilityOpen,
    isTransferOpen,
    setIsTransferOpen,
    isAddMoneyOpen,
    setIsAddMoneyOpen,
  } = useFinance();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Bottom Left Floating Action Menu */}
      <FloatingQuickActions />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Toasts Container */}
      <ToastContainer />

      {/* Global Quick Action Modals */}
      <IncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />
      <ExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
      <LiabilityModal
        isOpen={isAddLiabilityOpen}
        onClose={() => setIsAddLiabilityOpen(false)}
      />
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
      <AddBalanceModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
      />
    </div>
  );
}
