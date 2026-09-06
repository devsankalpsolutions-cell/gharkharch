'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Income,
  Expense,
  Liability,
  LiabilityPayment,
  FinancialMetrics,
  UnifiedTransaction,
  FilterState,
  AccountBalance,
  AccountType,
  MoneyTransfer,
  BalanceAdjustment,
  BalanceHistoryEntry,
  FinancialSettings,
  RecurringFixedExpense,
  PlannedCategoryBudget,
  SavingsGoal,
  Trip,
  TripExpense,
  TripSettlement,
  TripParticipant,
  House,
  HouseExpense,
  HouseIncome,
  HouseSettlement,
  HouseMember,
  RecurringHouseExpense,
  HouseMemberCreditRecord,
  HouseCreditAdjustment,
  HouseMemberLedgerEntry,
} from '@/lib/types';
import {
  getStoredIncomes,
  setStoredIncomes,
  getStoredExpenses,
  setStoredExpenses,
  getStoredLiabilities,
  setStoredLiabilities,
  getStoredBalances,
  setStoredBalances,
  getStoredTransfers,
  setStoredTransfers,
  getStoredAdjustments,
  setStoredAdjustments,
  getStoredCategories,
  setStoredCategories,
  getStoredSettings,
  setStoredSettings,
  getStoredRecurringExpenses,
  setStoredRecurringExpenses,
  getStoredPlannedBudgets,
  setStoredPlannedBudgets,
  getStoredSavingsGoals,
  setStoredSavingsGoals,
  getStoredTrips,
  setStoredTrips,
  getStoredTripExpenses,
  setStoredTripExpenses,
  getStoredTripSettlements,
  setStoredTripSettlements,
  getStoredHouses,
  setStoredHouses,
  getStoredHouseExpenses,
  setStoredHouseExpenses,
  getStoredHouseIncomes,
  setStoredHouseIncomes,
  getStoredHouseCreditRecords,
  setStoredHouseCreditRecords,
  getStoredHouseAdjustments,
  setStoredHouseAdjustments,
  getStoredHouseSettlements,
  setStoredHouseSettlements,
  getStoredRecurringHouseExpenses,
  setStoredRecurringHouseExpenses,
  getAccountFromPaymentMethod,
  calculateMetrics,
  getUnifiedTransactions,
  getBalanceHistory,
  resetToSampleData as resetStorage,
} from '@/lib/storage';
import { calculateHouseMemberLedgers } from '@/lib/settlementEngine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface FinanceContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  
  // Database status
  dbConnected: boolean;
  dbStatusMessage: string;
  isDbLoading: boolean;
  refreshFromDb: () => Promise<void>;

  // Settings & Balances
  settings: FinancialSettings;
  updateSettings: (newSettings: Partial<FinancialSettings>) => void;
  balances: AccountBalance;
  updateAccountBalance: (account: AccountType, newBalance: number, reason: string) => void;

  // Personal Finance state records
  incomes: Income[];
  expenses: Expense[];
  liabilities: Liability[];
  transfers: MoneyTransfer[];
  adjustments: BalanceAdjustment[];
  categories: string[];
  recurringExpenses: RecurringFixedExpense[];
  plannedBudgets: PlannedCategoryBudget[];
  savingsGoals: SavingsGoal[];

  // Dynamic Calculated Metrics & History
  metrics: FinancialMetrics;
  unifiedTransactions: UnifiedTransaction[];
  balanceHistory: BalanceHistoryEntry[];

  // Toast system
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Category Management
  addCategory: (categoryName: string) => boolean;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (categoryName: string, reassignTo?: string) => boolean;

  // Recurring Fixed Expenses CRUD
  addRecurringExpense: (item: Omit<RecurringFixedExpense, 'id' | 'userId'>) => void;
  updateRecurringExpense: (item: RecurringFixedExpense) => void;
  deleteRecurringExpense: (id: string) => void;
  toggleRecurringExpense: (id: string) => void;

  // Planned Budget CRUD
  setPlannedBudget: (category: string, plannedAmount: number) => void;

  // Savings Goals CRUD
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;

  // Income CRUD
  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => boolean;
  updateIncome: (income: Income) => boolean;
  deleteIncome: (id: string) => void;

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'account'>, customCategoryInput?: string) => boolean;
  updateExpense: (expense: Expense, customCategoryInput?: string) => boolean;
  deleteExpense: (id: string) => void;

  // Transfers
  addTransfer: (fromAccount: AccountType, toAccount: AccountType, amount: number, date: string, description?: string) => boolean;
  deleteTransfer: (id: string) => void;

  // Liabilities & EMI CRUD
  addLiability: (liability: Omit<Liability, 'id' | 'createdAt' | 'remainingAmount' | 'paidAmount'>) => void;
  updateLiability: (liability: Liability) => void;
  deleteLiability: (id: string) => void;
  payEmi: (liabilityId: string, amount: number, paymentMethod: LiabilityPayment['paymentMethod'], date: string, notes?: string) => boolean;

  // ==========================================
  // 1. TRIPS ENGINE STATE & CRUD
  // ==========================================
  trips: Trip[];
  tripExpenses: TripExpense[];
  tripSettlements: TripSettlement[];

  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addTripParticipant: (tripId: string, participant: Omit<TripParticipant, 'id'>) => void;
  removeTripParticipant: (tripId: string, participantId: string) => void;

  addTripExpense: (expense: Omit<TripExpense, 'id' | 'createdAt'>, syncToPersonal?: boolean) => void;
  updateTripExpense: (expense: TripExpense) => void;
  deleteTripExpense: (id: string) => void;

  addTripSettlement: (settlement: Omit<TripSettlement, 'id' | 'createdAt'>, syncToPersonal?: boolean) => void;
  recordTripExpenseInPersonal: (title: string, amount: number, paymentMethod: TripExpense['paymentMethod'], date: string, category: string) => boolean;

  // ==========================================
  // 2. MANAGE HOUSE / PG STATE & ENHANCED LEDGER CRUD
  // ==========================================
  houses: House[];
  houseExpenses: HouseExpense[];
  houseIncomes: HouseIncome[];
  houseCreditRecords: HouseMemberCreditRecord[];
  houseCreditAdjustments: HouseCreditAdjustment[];
  houseSettlements: HouseSettlement[];
  recurringHouseExpenses: RecurringHouseExpense[];

  addHouse: (house: Omit<House, 'id' | 'createdAt'>) => void;
  updateHouse: (house: House) => void;
  deleteHouse: (id: string) => void;
  addHouseMember: (houseId: string, member: Omit<HouseMember, 'id'>) => void;
  removeHouseMember: (houseId: string, memberId: string) => void;

  addHouseExpense: (expense: Omit<HouseExpense, 'id' | 'createdAt'>, syncToPersonal?: boolean) => void;
  updateHouseExpense: (expense: HouseExpense) => void;
  deleteHouseExpense: (id: string) => void;

  addHouseIncome: (income: Omit<HouseIncome, 'id' | 'createdAt'>, syncToPersonal?: boolean) => void;
  deleteHouseIncome: (id: string) => void;

  addHouseSettlement: (settlement: Omit<HouseSettlement, 'id' | 'createdAt'>, syncToPersonal?: boolean) => void;
  addRecurringHouseExpense: (item: Omit<RecurringHouseExpense, 'id'>) => void;
  deleteRecurringHouseExpense: (id: string) => void;

  // Advance Credit & Custom Adjustment Actions
  applyHouseCredit: (houseId: string, memberId: string, creditAmount: number, expenseId: string, expenseTitle: string) => void;
  refundHouseCredit: (houseId: string, memberId: string, refundAmount: number, reason: string) => void;
  addHouseCreditAdjustment: (adj: Omit<HouseCreditAdjustment, 'id' | 'createdAt'>) => void;

  recordHouseExpenseInPersonal: (title: string, amount: number, paymentMethod: HouseExpense['paymentMethod'], date: string, category: string) => boolean;

  // Filters state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  // Quick Action Modal states
  isAddIncomeOpen: boolean;
  setIsAddIncomeOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isAddLiabilityOpen: boolean;
  setIsAddLiabilityOpen: (open: boolean) => void;
  isTransferOpen: boolean;
  setIsTransferOpen: (open: boolean) => void;
  isAddMoneyOpen: boolean;
  setIsAddMoneyOpen: (open: boolean) => void;

  resetDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [dbStatusMessage, setDbStatusMessage] = useState<string>('Connecting to database...');
  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);

  const [settings, setSettingsState] = useState<FinancialSettings>({
    salaryDate: 5,
    expectedMonthlySalary: 145000,
    minimumSafetyBalance: 5000,
    repaymentStrategy: 'balanced',
  });
  const [balances, setBalancesState] = useState<AccountBalance>({ bankBalance: 50000, walletBalance: 5000, totalAvailable: 55000 });
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [transfers, setTransfers] = useState<MoneyTransfer[]>([]);
  const [adjustments, setAdjustments] = useState<BalanceAdjustment[]>([]);
  const [categories, setCategoriesState] = useState<string[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringFixedExpense[]>([]);
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedCategoryBudget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  // Trips state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripExpenses, setTripExpenses] = useState<TripExpense[]>([]);
  const [tripSettlements, setTripSettlements] = useState<TripSettlement[]>([]);

  // House state
  const [houses, setHouses] = useState<House[]>([]);
  const [houseExpenses, setHouseExpenses] = useState<HouseExpense[]>([]);
  const [houseIncomes, setHouseIncomes] = useState<HouseIncome[]>([]);
  const [houseCreditRecords, setHouseCreditRecords] = useState<HouseMemberCreditRecord[]>([]);
  const [houseCreditAdjustments, setHouseCreditAdjustments] = useState<HouseCreditAdjustment[]>([]);
  const [houseSettlements, setHouseSettlements] = useState<HouseSettlement[]>([]);
  const [recurringHouseExpenses, setRecurringHouseExpenses] = useState<RecurringHouseExpense[]>([]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Quick Action Modals
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddLiabilityOpen, setIsAddLiabilityOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    month: '2026-09',
    searchQuery: '',
    category: 'All',
    paymentMethod: 'All',
    transactionType: 'All',
    account: 'All',
    dateRange: { start: '', end: '' },
    liabilityStatus: 'All',
  });

  // Database initialization & Sync
  const refreshFromDb = async () => {
    setIsDbLoading(true);
    try {
      // 1. Initialize schema if needed
      await fetch('/api/db/init').catch(() => null);

      // 2. Fetch fresh data
      const res = await fetch('/api/finance/sync');
      const json = await res.json();

      if (json.success && json.connected && json.data) {
        setDbConnected(true);
        setDbStatusMessage('Connected to MySQL (pma.devsankalpsolutions.com)');

        const d = json.data;
        if (d.incomes && d.incomes.length > 0) setIncomes(d.incomes);
        if (d.expenses && d.expenses.length > 0) setExpenses(d.expenses);
        if (d.liabilities && d.liabilities.length > 0) setLiabilities(d.liabilities);
        if (d.transfers && d.transfers.length > 0) setTransfers(d.transfers);
        if (d.adjustments && d.adjustments.length > 0) setAdjustments(d.adjustments);
        if (d.balances) setBalancesState(d.balances);
        if (d.settings) setSettingsState(d.settings);
        if (d.trips && d.trips.length > 0) setTrips(d.trips);
        if (d.houses && d.houses.length > 0) setHouses(d.houses);
      } else {
        setDbConnected(false);
        setDbStatusMessage(json.message || 'Offline mode (LocalStorage)');
      }
    } catch (err: any) {
      console.warn('DB Sync fallback to LocalStorage:', err);
      setDbConnected(false);
      setDbStatusMessage('Database offline, using LocalStorage');
    } finally {
      setIsDbLoading(false);
    }
  };

  // Sync to database helper
  const syncToDb = (action: string, data: any) => {
    if (typeof window === 'undefined') return;
    fetch('/api/finance/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data }),
    }).catch(err => console.warn('Failed async DB sync:', err));
  };

  // Load state on mount
  useEffect(() => {
    // First load from local storage
    setSettingsState(getStoredSettings());
    setBalancesState(getStoredBalances());
    setIncomes(getStoredIncomes());
    setExpenses(getStoredExpenses());
    setLiabilities(getStoredLiabilities());
    setTransfers(getStoredTransfers());
    setAdjustments(getStoredAdjustments());
    setCategoriesState(getStoredCategories());
    setRecurringExpenses(getStoredRecurringExpenses());
    setPlannedBudgets(getStoredPlannedBudgets());
    setSavingsGoals(getStoredSavingsGoals());

    setTrips(getStoredTrips());
    setTripExpenses(getStoredTripExpenses());
    setTripSettlements(getStoredTripSettlements());

    setHouses(getStoredHouses());
    setHouseExpenses(getStoredHouseExpenses());
    setHouseIncomes(getStoredHouseIncomes());
    setHouseCreditRecords(getStoredHouseCreditRecords());
    setHouseCreditAdjustments(getStoredHouseAdjustments());
    setHouseSettlements(getStoredHouseSettlements());
    setRecurringHouseExpenses(getStoredRecurringHouseExpenses());

    // Sync from MySQL database
    refreshFromDb();
  }, []);

  // Sync state helpers
  const updateSettings = (newSettings: Partial<FinancialSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    setStoredSettings(updated);
    syncToDb('save_settings', updated);
    addToast('Updated financial settings', 'info');
  };

  const saveBalances = (newBal: AccountBalance) => {
    const full = { ...newBal, totalAvailable: newBal.bankBalance + newBal.walletBalance };
    setBalancesState(full);
    setStoredBalances(full);
    syncToDb('save_balance', full);
  };

  const saveIncomes = (items: Income[]) => {
    setIncomes(items);
    setStoredIncomes(items);
  };

  const saveExpenses = (items: Expense[]) => {
    setExpenses(items);
    setStoredExpenses(items);
  };

  const saveLiabilities = (items: Liability[]) => {
    setLiabilities(items);
    setStoredLiabilities(items);
  };

  const saveTransfers = (items: MoneyTransfer[]) => {
    setTransfers(items);
    setStoredTransfers(items);
  };

  const saveAdjustments = (items: BalanceAdjustment[]) => {
    setAdjustments(items);
    setStoredAdjustments(items);
  };

  const saveCategories = (cats: string[]) => {
    setCategoriesState(cats);
    setStoredCategories(cats);
  };

  const saveRecurring = (items: RecurringFixedExpense[]) => {
    setRecurringExpenses(items);
    setStoredRecurringExpenses(items);
  };

  const savePlanned = (budgets: PlannedCategoryBudget[]) => {
    setPlannedBudgets(budgets);
    setStoredPlannedBudgets(budgets);
  };

  const saveGoals = (goals: SavingsGoal[]) => {
    setSavingsGoals(goals);
    setStoredSavingsGoals(goals);
  };

  // Trips & House Savers
  const saveTrips = (items: Trip[]) => {
    setTrips(items);
    setStoredTrips(items);
  };

  const saveTripExpenses = (items: TripExpense[]) => {
    setTripExpenses(items);
    setStoredTripExpenses(items);
  };

  const saveTripSettlements = (items: TripSettlement[]) => {
    setTripSettlements(items);
    setStoredTripSettlements(items);
  };

  const saveHouses = (items: House[]) => {
    setHouses(items);
    setStoredHouses(items);
  };

  const saveHouseExpenses = (items: HouseExpense[]) => {
    setHouseExpenses(items);
    setStoredHouseExpenses(items);
  };

  const saveHouseIncomes = (items: HouseIncome[]) => {
    setHouseIncomes(items);
    setStoredHouseIncomes(items);
  };

  const saveHouseCreditRecords = (items: HouseMemberCreditRecord[]) => {
    setHouseCreditRecords(items);
    setStoredHouseCreditRecords(items);
  };

  const saveHouseCreditAdjustments = (items: HouseCreditAdjustment[]) => {
    setHouseCreditAdjustments(items);
    setStoredHouseAdjustments(items);
  };

  const saveHouseSettlements = (items: HouseSettlement[]) => {
    setHouseSettlements(items);
    setStoredHouseSettlements(items);
  };

  const saveRecurringHouseExpenses = (items: RecurringHouseExpense[]) => {
    setRecurringHouseExpenses(items);
    setStoredRecurringHouseExpenses(items);
  };

  // Dynamic calculations
  const metrics = useMemo(() => {
    return calculateMetrics(
      incomes,
      expenses,
      liabilities,
      balances,
      settings,
      recurringExpenses,
      plannedBudgets,
      selectedMonth
    );
  }, [incomes, expenses, liabilities, balances, settings, recurringExpenses, plannedBudgets, selectedMonth]);

  const unifiedTransactions = useMemo(() => {
    return getUnifiedTransactions(incomes, expenses, liabilities, transfers, adjustments);
  }, [incomes, expenses, liabilities, transfers, adjustments]);

  const balanceHistory = useMemo(() => {
    return getBalanceHistory(incomes, expenses, liabilities, transfers, adjustments, balances);
  }, [incomes, expenses, liabilities, transfers, adjustments, balances]);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const checkAccountBalance = (account: AccountType, amount: number): boolean => {
    const current = account === 'Bank' ? balances.bankBalance : balances.walletBalance;
    if (amount > current) {
      const accLabel = account === 'Bank' ? 'bank' : 'wallet';
      addToast(`Insufficient ${accLabel} balance. Available balance: ₹${current.toLocaleString('en-IN')}`, 'error');
      return false;
    }
    return true;
  };

  // ==========================================
  // 1. TRIPS MODULE CRUD
  // ==========================================
  const addTrip = (trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const created: Trip = {
      ...trip,
      id: `trip_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveTrips([created, ...trips]);
    addToast(`Created trip "${created.name}"`);
  };

  const updateTrip = (trip: Trip) => {
    const updated = trips.map(t => (t.id === trip.id ? trip : t));
    saveTrips(updated);
    addToast(`Updated trip "${trip.name}"`);
  };

  const deleteTrip = (id: string) => {
    const target = trips.find(t => t.id === id);
    if (!target) return;
    saveTrips(trips.filter(t => t.id !== id));
    saveTripExpenses(tripExpenses.filter(e => e.tripId !== id));
    saveTripSettlements(tripSettlements.filter(s => s.tripId !== id));
    addToast(`Deleted trip "${target.name}"`, 'info');
  };

  const addTripParticipant = (tripId: string, participant: Omit<TripParticipant, 'id'>) => {
    const createdP: TripParticipant = {
      ...participant,
      id: `part_${Date.now()}`,
    };
    const updated = trips.map(t => (t.id === tripId ? { ...t, participants: [...t.participants, createdP] } : t));
    saveTrips(updated);
    addToast(`Added participant "${createdP.name}"`);
  };

  const removeTripParticipant = (tripId: string, participantId: string) => {
    const updated = trips.map(t => (t.id === tripId ? { ...t, participants: t.participants.filter(p => p.id !== participantId) } : t));
    saveTrips(updated);
    addToast('Removed trip participant', 'info');
  };

  const addTripExpense = (expense: Omit<TripExpense, 'id' | 'createdAt'>, syncToPersonal: boolean = false) => {
    const created: TripExpense = {
      ...expense,
      id: `tripexp_${Date.now()}`,
      isRecordedInPersonal: syncToPersonal,
      createdAt: new Date().toISOString(),
    };
    saveTripExpenses([created, ...tripExpenses]);
    addToast(`Added trip expense "${created.title}" of ₹${created.amount.toLocaleString('en-IN')}`);

    if (syncToPersonal) {
      recordTripExpenseInPersonal(created.title, created.amount, created.paymentMethod, created.date, created.category);
    }
  };

  const updateTripExpense = (expense: TripExpense) => {
    const updated = tripExpenses.map(e => (e.id === expense.id ? expense : e));
    saveTripExpenses(updated);
    addToast(`Updated trip expense "${expense.title}"`);
  };

  const deleteTripExpense = (id: string) => {
    saveTripExpenses(tripExpenses.filter(e => e.id !== id));
    addToast('Deleted trip expense', 'info');
  };

  const addTripSettlement = (settlement: Omit<TripSettlement, 'id' | 'createdAt'>, syncToPersonal: boolean = false) => {
    const created: TripSettlement = {
      ...settlement,
      id: `tripset_${Date.now()}`,
      isRecordedInPersonal: syncToPersonal,
      createdAt: new Date().toISOString(),
    };
    saveTripSettlements([created, ...tripSettlements]);
    addToast(`Recorded trip settlement of ₹${created.amount.toLocaleString('en-IN')}`);

    if (syncToPersonal) {
      recordTripExpenseInPersonal(`Trip Settlement Payment`, created.amount, created.paymentMethod, created.date, 'Other');
    }
  };

  const recordTripExpenseInPersonal = (
    title: string,
    amount: number,
    paymentMethod: TripExpense['paymentMethod'],
    date: string,
    category: string
  ): boolean => {
    return addExpense({
      userId: 'user_1',
      title: `[Trip] ${title}`,
      amount,
      date,
      category,
      paymentMethod,
      description: 'Trip expense synced to personal account balance',
    });
  };

  // ==========================================
  // 2. MANAGE HOUSE / PG MODULE CRUD & ENHANCED LEDGER
  // ==========================================
  const addHouse = (house: Omit<House, 'id' | 'createdAt'>) => {
    const created: House = {
      ...house,
      id: `house_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveHouses([created, ...houses]);
    addToast(`Created house "${created.name}"`);
  };

  const updateHouse = (house: House) => {
    const updated = houses.map(h => (h.id === house.id ? house : h));
    saveHouses(updated);
    addToast(`Updated house "${house.name}"`);
  };

  const deleteHouse = (id: string) => {
    const target = houses.find(h => h.id === id);
    if (!target) return;
    saveHouses(houses.filter(h => h.id !== id));
    saveHouseExpenses(houseExpenses.filter(e => e.houseId !== id));
    saveHouseIncomes(houseIncomes.filter(i => i.houseId !== id));
    saveHouseCreditRecords(houseCreditRecords.filter(c => c.houseId !== id));
    saveHouseCreditAdjustments(houseCreditAdjustments.filter(a => a.houseId !== id));
    saveHouseSettlements(houseSettlements.filter(s => s.houseId !== id));
    saveRecurringHouseExpenses(recurringHouseExpenses.filter(r => r.houseId !== id));
    addToast(`Deleted house "${target.name}"`, 'info');
  };

  const addHouseMember = (houseId: string, member: Omit<HouseMember, 'id'>) => {
    const createdM: HouseMember = {
      ...member,
      id: `mem_${Date.now()}`,
    };
    const updated = houses.map(h => (h.id === houseId ? { ...h, members: [...h.members, createdM] } : h));
    saveHouses(updated);
    addToast(`Added member "${createdM.name}"`);
  };

  const removeHouseMember = (houseId: string, memberId: string) => {
    const updated = houses.map(h => (h.id === houseId ? { ...h, members: h.members.filter(m => m.id !== memberId) } : h));
    saveHouses(updated);
    addToast('Removed house member', 'info');
  };

  const addHouseExpense = (expense: Omit<HouseExpense, 'id' | 'createdAt'>, syncToPersonal: boolean = false) => {
    const created: HouseExpense = {
      ...expense,
      id: `houseexp_${Date.now()}`,
      isRecordedInPersonal: syncToPersonal,
      createdAt: new Date().toISOString(),
    };
    saveHouseExpenses([created, ...houseExpenses]);
    addToast(`Added house expense "${created.title}" of ₹${created.amount.toLocaleString('en-IN')}`);

    if (syncToPersonal) {
      recordHouseExpenseInPersonal(created.title, created.amount, created.paymentMethod, created.date, created.category);
    }
  };

  const updateHouseExpense = (expense: HouseExpense) => {
    const updated = houseExpenses.map(e => (e.id === expense.id ? expense : e));
    saveHouseExpenses(updated);
    addToast(`Updated house expense "${expense.title}"`);
  };

  const deleteHouseExpense = (id: string) => {
    saveHouseExpenses(houseExpenses.filter(e => e.id !== id));
    addToast('Deleted house expense', 'info');
  };

  const addHouseIncome = (
    income: Omit<HouseIncome, 'id' | 'createdAt'>,
    syncToPersonal: boolean = false
  ) => {
    const created: HouseIncome = {
      ...income,
      id: `houseinc_${Date.now()}`,
      isRecordedInPersonal: syncToPersonal,
      createdAt: new Date().toISOString(),
    };

    saveHouseIncomes([created, ...houseIncomes]);
    addToast(`Recorded house income/contribution "${created.title}" of ₹${created.amount.toLocaleString('en-IN')}`);

    // Check for Overpayment (e.g. Dhrupi pays ₹1,000 for share of ₹836 -> ₹164 Advance Credit)
    const reqShare = income.requiredShare || 0;
    if (reqShare > 0 && income.amount > reqShare) {
      const overpayment = income.amount - reqShare;
      const targetHouse = houses.find(h => h.id === income.houseId);
      const payerObj = targetHouse?.members.find(m => m.id === income.paidByMemberId);
      const payerName = payerObj?.name || 'Member';

      if (income.overpaymentAction === 'Save as Advance Credit' || !income.overpaymentAction) {
        const creditRec: HouseMemberCreditRecord = {
          id: `cred_${Date.now()}`,
          houseId: income.houseId,
          memberId: income.paidByMemberId,
          memberName: payerName,
          amount: overpayment,
          remainingAmount: overpayment,
          reason: `${income.title} Overpayment`,
          date: income.date,
          status: 'Available',
          createdAt: new Date().toISOString(),
        };
        saveHouseCreditRecords([creditRec, ...houseCreditRecords]);
        addToast(`Created ₹${overpayment.toLocaleString('en-IN')} Advance Credit for ${payerName}`, 'info');
      }
    }

    if (syncToPersonal) {
      addIncome({
        userId: 'user_1',
        title: `[House Income] ${created.title}`,
        amount: created.amount,
        date: created.date,
        category: 'House Contribution',
        paymentMethod: 'UPI',
        receivedIn: 'Bank',
        notes: 'House income contribution synced to personal bank account',
      });
    }
  };

  const deleteHouseIncome = (id: string) => {
    saveHouseIncomes(houseIncomes.filter(i => i.id !== id));
    addToast('Deleted house income', 'info');
  };

  const addHouseSettlement = (settlement: Omit<HouseSettlement, 'id' | 'createdAt'>, syncToPersonal: boolean = false) => {
    const created: HouseSettlement = {
      ...settlement,
      id: `houseset_${Date.now()}`,
      isRecordedInPersonal: syncToPersonal,
      createdAt: new Date().toISOString(),
    };
    saveHouseSettlements([created, ...houseSettlements]);
    addToast(`Recorded house settlement of ₹${created.amount.toLocaleString('en-IN')}`);

    if (syncToPersonal) {
      recordHouseExpenseInPersonal('House Settlement Payment', created.amount, created.paymentMethod, created.date, 'Rent');
    }
  };

  const addRecurringHouseExpense = (item: Omit<RecurringHouseExpense, 'id'>) => {
    const created: RecurringHouseExpense = {
      ...item,
      id: `rechouse_${Date.now()}`,
    };
    saveRecurringHouseExpenses([...recurringHouseExpenses, created]);
    addToast(`Added recurring bill "${created.title}"`);
  };

  const deleteRecurringHouseExpense = (id: string) => {
    saveRecurringHouseExpenses(recurringHouseExpenses.filter(r => r.id !== id));
    addToast('Deleted recurring house bill', 'info');
  };

  // Advance Credit Actions
  const applyHouseCredit = (
    houseId: string,
    memberId: string,
    creditAmount: number,
    expenseId: string,
    expenseTitle: string
  ) => {
    const records = houseCreditRecords.filter(r => r.houseId === houseId && r.memberId === memberId && r.status === 'Available');
    let remainingToApply = creditAmount;

    const updatedRecords = houseCreditRecords.map(r => {
      if (r.houseId === houseId && r.memberId === memberId && r.status === 'Available' && remainingToApply > 0) {
        const deduct = Math.min(remainingToApply, r.remainingAmount);
        remainingToApply -= deduct;
        const newRem = r.remainingAmount - deduct;
        return {
          ...r,
          remainingAmount: newRem,
          status: newRem <= 0 ? ('Applied' as const) : ('Available' as const),
          appliedToExpenseId: expenseId,
          appliedToExpenseTitle: expenseTitle,
          appliedDate: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    });

    saveHouseCreditRecords(updatedRecords);
    addToast(`Applied ₹${creditAmount.toLocaleString('en-IN')} credit to "${expenseTitle}"`);
  };

  const refundHouseCredit = (houseId: string, memberId: string, refundAmount: number, reason: string) => {
    const records = houseCreditRecords.filter(r => r.houseId === houseId && r.memberId === memberId && r.status === 'Available');
    let remainingToRefund = refundAmount;

    const updatedRecords = houseCreditRecords.map(r => {
      if (r.houseId === houseId && r.memberId === memberId && r.status === 'Available' && remainingToRefund > 0) {
        const deduct = Math.min(remainingToRefund, r.remainingAmount);
        remainingToRefund -= deduct;
        const newRem = r.remainingAmount - deduct;
        return {
          ...r,
          remainingAmount: newRem,
          status: newRem <= 0 ? ('Refunded' as const) : ('Available' as const),
        };
      }
      return r;
    });

    saveHouseCreditRecords(updatedRecords);

    const adj: HouseCreditAdjustment = {
      id: `adj_${Date.now()}`,
      houseId,
      memberId,
      amount: refundAmount,
      type: 'Refund',
      reason,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    saveHouseCreditAdjustments([adj, ...houseCreditAdjustments]);

    addToast(`Refunded ₹${refundAmount.toLocaleString('en-IN')} credit to member`);
  };

  const addHouseCreditAdjustment = (adj: Omit<HouseCreditAdjustment, 'id' | 'createdAt'>) => {
    const created: HouseCreditAdjustment = {
      ...adj,
      id: `adj_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveHouseCreditAdjustments([created, ...houseCreditAdjustments]);

    if (adj.type === 'Credit') {
      const targetHouse = houses.find(h => h.id === adj.houseId);
      const memberObj = targetHouse?.members.find(m => m.id === adj.memberId);
      const creditRec: HouseMemberCreditRecord = {
        id: `cred_${Date.now()}`,
        houseId: adj.houseId,
        memberId: adj.memberId,
        memberName: memberObj?.name || 'Member',
        amount: adj.amount,
        remainingAmount: adj.amount,
        reason: adj.reason || 'Manual Credit Adjustment',
        date: adj.date,
        status: 'Available',
        createdAt: new Date().toISOString(),
      };
      saveHouseCreditRecords([creditRec, ...houseCreditRecords]);
    }

    addToast(`Added house credit adjustment (${adj.type}) of ₹${adj.amount.toLocaleString('en-IN')}`);
  };

  const recordHouseExpenseInPersonal = (
    title: string,
    amount: number,
    paymentMethod: HouseExpense['paymentMethod'],
    date: string,
    category: string
  ): boolean => {
    return addExpense({
      userId: 'user_1',
      title: `[House] ${title}`,
      amount,
      date,
      category,
      paymentMethod,
      description: 'House expense synced to personal account balance',
    });
  };

  // --- RECURRING FIXED EXPENSES CRUD ---
  const addRecurringExpense = (item: Omit<RecurringFixedExpense, 'id' | 'userId'>) => {
    const created: RecurringFixedExpense = {
      ...item,
      id: `fix_${Date.now()}`,
      userId: 'user_1',
    };
    const updated = [...recurringExpenses, created];
    saveRecurring(updated);
    addToast(`Added fixed recurring expense "${created.name}"`);
  };

  const updateRecurringExpense = (item: RecurringFixedExpense) => {
    const updated = recurringExpenses.map(r => (r.id === item.id ? item : r));
    saveRecurring(updated);
    addToast(`Updated recurring expense "${item.name}"`);
  };

  const deleteRecurringExpense = (id: string) => {
    const updated = recurringExpenses.filter(r => r.id !== id);
    saveRecurring(updated);
    addToast('Deleted recurring expense', 'info');
  };

  const toggleRecurringExpense = (id: string) => {
    const updated = recurringExpenses.map(r => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
    saveRecurring(updated);
  };

  // --- PLANNED BUDGET CRUD ---
  const setPlannedBudget = (category: string, plannedAmount: number) => {
    const exists = plannedBudgets.find(b => b.category === category);
    let updated: PlannedCategoryBudget[] = [];
    if (exists) {
      updated = plannedBudgets.map(b => (b.category === category ? { ...b, plannedAmount } : b));
    } else {
      updated = [...plannedBudgets, { id: `bud_${Date.now()}`, category, plannedAmount }];
    }
    savePlanned(updated);
    addToast(`Set planned budget for "${category}" to ₹${plannedAmount.toLocaleString('en-IN')}`);
  };

  // --- SAVINGS GOALS CRUD ---
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'userId'>) => {
    const created: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      userId: 'user_1',
    };
    const updated = [...savingsGoals, created];
    saveGoals(updated);
    addToast(`Added Savings Goal "${created.title}"`);
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    const updated = savingsGoals.map(g => (g.id === goal.id ? goal : g));
    saveGoals(updated);
    addToast(`Updated Savings Goal "${goal.title}"`);
  };

  const deleteSavingsGoal = (id: string) => {
    const updated = savingsGoals.filter(g => g.id !== id);
    saveGoals(updated);
    addToast('Deleted Savings Goal', 'info');
  };

  // --- CATEGORY MANAGEMENT ---
  const addCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    const exists = categories.some(c => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return true;

    const updated = [...categories, trimmed];
    saveCategories(updated);
    addToast(`Added category "${trimmed}"`);
    return true;
  };

  const updateCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;

    const updatedCats = categories.map(c => (c === oldName ? trimmed : c));
    saveCategories(updatedCats);

    const updatedExpenses = expenses.map(exp => (exp.category === oldName ? { ...exp, category: trimmed } : exp));
    saveExpenses(updatedExpenses);

    addToast(`Updated category "${oldName}" to "${trimmed}"`);
  };

  const deleteCategory = (categoryName: string, reassignTo: string = 'Other'): boolean => {
    if (categoryName === 'Other') {
      addToast('Cannot delete default "Other" category', 'error');
      return false;
    }

    const updatedCats = categories.filter(c => c !== categoryName);
    saveCategories(updatedCats);

    const updatedExpenses = expenses.map(exp => (exp.category === categoryName ? { ...exp, category: reassignTo } : exp));
    saveExpenses(updatedExpenses);

    addToast(`Deleted category "${categoryName}"`, 'info');
    return true;
  };

  // --- BALANCE MANUAL ADJUSTMENT ---
  const updateAccountBalance = (account: AccountType, newBalance: number, reason: string) => {
    const oldBal = account === 'Bank' ? balances.bankBalance : balances.walletBalance;
    const change = newBalance - oldBal;

    const newBalances = {
      ...balances,
      bankBalance: account === 'Bank' ? newBalance : balances.bankBalance,
      walletBalance: account === 'Wallet' ? newBalance : balances.walletBalance,
    };

    saveBalances(newBalances);

    const adj: BalanceAdjustment = {
      id: `adj_${Date.now()}`,
      userId: 'user_1',
      account,
      oldBalance: oldBal,
      newBalance,
      amountChange: change,
      reason: reason || 'Manual balance update',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    saveAdjustments([adj, ...adjustments]);
    addToast(`Updated ${account} Balance to ₹${newBalance.toLocaleString('en-IN')}`);
  };

  // --- MONEY TRANSFERS ---
  const addTransfer = (
    fromAccount: AccountType,
    toAccount: AccountType,
    amount: number,
    date: string,
    description?: string
  ): boolean => {
    if (fromAccount === toAccount) {
      addToast('Source and destination accounts must be different', 'error');
      return false;
    }
    if (!checkAccountBalance(fromAccount, amount)) return false;

    const newBalances = {
      ...balances,
      bankBalance:
        fromAccount === 'Bank'
          ? balances.bankBalance - amount
          : balances.bankBalance + amount,
      walletBalance:
        fromAccount === 'Wallet'
          ? balances.walletBalance - amount
          : balances.walletBalance + amount,
    };
    saveBalances(newBalances);

    const trf: MoneyTransfer = {
      id: `trf_${Date.now()}`,
      userId: 'user_1',
      fromAccount,
      toAccount,
      amount,
      date,
      description,
      createdAt: new Date().toISOString(),
    };

    saveTransfers([trf, ...transfers]);
    addToast(`Transferred ₹${amount.toLocaleString('en-IN')} from ${fromAccount} to ${toAccount}`);
    return true;
  };

  const deleteTransfer = (id: string) => {
    const trf = transfers.find(t => t.id === id);
    if (!trf) return;

    const newBalances = {
      ...balances,
      bankBalance:
        trf.fromAccount === 'Bank'
          ? balances.bankBalance + trf.amount
          : balances.bankBalance - trf.amount,
      walletBalance:
        trf.fromAccount === 'Wallet'
          ? balances.walletBalance + trf.amount
          : balances.walletBalance - trf.amount,
    };
    saveBalances(newBalances);

    const updated = transfers.filter(t => t.id !== id);
    saveTransfers(updated);
    addToast('Reversed and deleted money transfer', 'info');
  };

  // --- INCOME CRUD ---
  const addIncome = (newInc: Omit<Income, 'id' | 'createdAt'>): boolean => {
    const created: Income = {
      ...newInc,
      id: `inc_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const targetAccount = newInc.receivedIn || 'Bank';
    const newBalances = {
      ...balances,
      bankBalance: targetAccount === 'Bank' ? balances.bankBalance + newInc.amount : balances.bankBalance,
      walletBalance: targetAccount === 'Wallet' ? balances.walletBalance + newInc.amount : balances.walletBalance,
    };
    saveBalances(newBalances);

    saveIncomes([created, ...incomes]);
    addToast(`Added Income "${created.title}" of ₹${created.amount.toLocaleString('en-IN')} into ${targetAccount}`);
    return true;
  };

  const updateIncome = (updatedInc: Income): boolean => {
    const oldInc = incomes.find(i => i.id === updatedInc.id);
    if (!oldInc) return false;

    let tempBank = balances.bankBalance;
    let tempWallet = balances.walletBalance;

    if (oldInc.receivedIn === 'Bank') tempBank -= oldInc.amount;
    else tempWallet -= oldInc.amount;

    if (updatedInc.receivedIn === 'Bank') tempBank += updatedInc.amount;
    else tempWallet += updatedInc.amount;

    saveBalances({ ...balances, bankBalance: tempBank, walletBalance: tempWallet });

    const updated = incomes.map(item => (item.id === updatedInc.id ? updatedInc : item));
    saveIncomes(updated);
    addToast(`Updated Income "${updatedInc.title}"`);
    return true;
  };

  const deleteIncome = (id: string) => {
    const target = incomes.find(i => i.id === id);
    if (!target) return;

    const targetAccount = target.receivedIn || 'Bank';
    const newBalances = {
      ...balances,
      bankBalance: targetAccount === 'Bank' ? Math.max(0, balances.bankBalance - target.amount) : balances.bankBalance,
      walletBalance: targetAccount === 'Wallet' ? Math.max(0, balances.walletBalance - target.amount) : balances.walletBalance,
    };
    saveBalances(newBalances);

    const updated = incomes.filter(i => i.id !== id);
    saveIncomes(updated);
    addToast(`Deleted Income "${target.title}" and updated balance`, 'info');
  };

  // --- EXPENSE CRUD ---
  const addExpense = (
    newExp: Omit<Expense, 'id' | 'createdAt' | 'account'>,
    customCategoryInput?: string
  ): boolean => {
    const targetAccount = getAccountFromPaymentMethod(newExp.paymentMethod);

    if (!checkAccountBalance(targetAccount, newExp.amount)) return false;

    let finalCategory = newExp.category;
    if (newExp.category === 'Other' && customCategoryInput?.trim()) {
      finalCategory = customCategoryInput.trim();
      addCategory(finalCategory);
    }

    const created: Expense = {
      ...newExp,
      category: finalCategory,
      account: targetAccount,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const newBalances = {
      ...balances,
      bankBalance: targetAccount === 'Bank' ? balances.bankBalance - created.amount : balances.bankBalance,
      walletBalance: targetAccount === 'Wallet' ? balances.walletBalance - created.amount : balances.walletBalance,
    };
    saveBalances(newBalances);

    saveExpenses([created, ...expenses]);
    addToast(`Added Expense "${created.title}" of ₹${created.amount.toLocaleString('en-IN')} via ${targetAccount}`);
    return true;
  };

  const updateExpense = (
    updatedExp: Expense,
    customCategoryInput?: string
  ): boolean => {
    const oldExp = expenses.find(e => e.id === updatedExp.id);
    if (!oldExp) return false;

    let finalCategory = updatedExp.category;
    if (updatedExp.category === 'Other' && customCategoryInput?.trim()) {
      finalCategory = customCategoryInput.trim();
      addCategory(finalCategory);
    }

    const newTargetAccount = getAccountFromPaymentMethod(updatedExp.paymentMethod);
    const fullUpdatedExp = { ...updatedExp, category: finalCategory, account: newTargetAccount };

    const oldAccount = oldExp.account || getAccountFromPaymentMethod(oldExp.paymentMethod);
    let tempBank = balances.bankBalance;
    let tempWallet = balances.walletBalance;

    if (oldAccount === 'Bank') tempBank += oldExp.amount;
    else tempWallet += oldExp.amount;

    const availableInNewAccount = newTargetAccount === 'Bank' ? tempBank : tempWallet;
    if (fullUpdatedExp.amount > availableInNewAccount) {
      const accLabel = newTargetAccount === 'Bank' ? 'bank' : 'wallet';
      addToast(`Insufficient ${accLabel} balance for updated expense. Available: ₹${availableInNewAccount.toLocaleString('en-IN')}`, 'error');
      return false;
    }

    if (newTargetAccount === 'Bank') tempBank -= fullUpdatedExp.amount;
    else tempWallet -= fullUpdatedExp.amount;

    saveBalances({ ...balances, bankBalance: tempBank, walletBalance: tempWallet });

    const updated = expenses.map(item => (item.id === updatedExp.id ? fullUpdatedExp : item));
    saveExpenses(updated);
    addToast(`Updated Expense "${fullUpdatedExp.title}"`);
    return true;
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find(e => e.id === id);
    if (!target) return;

    const targetAccount = target.account || getAccountFromPaymentMethod(target.paymentMethod);
    const newBalances = {
      ...balances,
      bankBalance: targetAccount === 'Bank' ? balances.bankBalance + target.amount : balances.bankBalance,
      walletBalance: targetAccount === 'Wallet' ? balances.walletBalance + target.amount : balances.walletBalance,
    };
    saveBalances(newBalances);

    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
    addToast(`Deleted Expense "${target.title}" and restored ₹${target.amount.toLocaleString('en-IN')}`, 'info');
  };

  // --- LIABILITY CRUD ---
  const addLiability = (newLia: Omit<Liability, 'id' | 'createdAt' | 'remainingAmount' | 'paidAmount'>) => {
    const created: Liability = {
      ...newLia,
      id: `lia_${Date.now()}`,
      paidAmount: 0,
      remainingAmount: newLia.totalAmount,
      monthlyEmi: newLia.type === 'Friend Borrow' ? 0 : newLia.monthlyEmi,
      priority: newLia.priority || 'Medium',
      createdAt: new Date().toISOString(),
      payments: [],
    };
    const updated = [created, ...liabilities];
    saveLiabilities(updated);
    addToast(`Added Liability "${created.name}" of ₹${created.totalAmount.toLocaleString('en-IN')}`);
  };

  const updateLiability = (updatedLia: Liability) => {
    const remaining = updatedLia.totalAmount - updatedLia.paidAmount;
    const status = remaining <= 0 ? 'Paid' : updatedLia.status;
    const fullUpdated = {
      ...updatedLia,
      monthlyEmi: updatedLia.type === 'Friend Borrow' ? 0 : updatedLia.monthlyEmi,
      remainingAmount: Math.max(0, remaining),
      status,
    };
    const updated = liabilities.map(item => (item.id === updatedLia.id ? fullUpdated : item));
    saveLiabilities(updated);
    addToast(`Updated Liability "${updatedLia.name}"`);
  };

  const deleteLiability = (id: string) => {
    const target = liabilities.find(l => l.id === id);
    if (!target) return;

    let tempBank = balances.bankBalance;
    let tempWallet = balances.walletBalance;

    target.payments?.forEach(pmt => {
      const acc = pmt.account || getAccountFromPaymentMethod(pmt.paymentMethod);
      if (acc === 'Bank') tempBank += pmt.amount;
      else tempWallet += pmt.amount;
    });

    saveBalances({ ...balances, bankBalance: tempBank, walletBalance: tempWallet });

    const updated = liabilities.filter(l => l.id !== id);
    saveLiabilities(updated);
    addToast(`Deleted Liability "${target.name}"`, 'info');
  };

  const payEmi = (
    liabilityId: string,
    amount: number,
    paymentMethod: LiabilityPayment['paymentMethod'],
    date: string,
    notes?: string
  ): boolean => {
    const targetAccount = getAccountFromPaymentMethod(paymentMethod);
    if (!checkAccountBalance(targetAccount, amount)) return false;

    const newBalances = {
      ...balances,
      bankBalance: targetAccount === 'Bank' ? balances.bankBalance - amount : balances.bankBalance,
      walletBalance: targetAccount === 'Wallet' ? balances.walletBalance - amount : balances.walletBalance,
    };
    saveBalances(newBalances);

    const updated = liabilities.map(lia => {
      if (lia.id !== liabilityId) return lia;

      const newPayment: LiabilityPayment = {
        id: `pmt_${Date.now()}`,
        liabilityId,
        userId: lia.userId,
        amount,
        date,
        paymentMethod,
        account: targetAccount,
        notes,
      };

      const existingPayments = lia.payments || [];
      const newPaidAmount = lia.paidAmount + amount;
      const newRemaining = Math.max(0, lia.totalAmount - newPaidAmount);
      const newStatus = newRemaining === 0 ? 'Paid' : lia.status;

      return {
        ...lia,
        paidAmount: newPaidAmount,
        remainingAmount: newRemaining,
        status: newStatus,
        payments: [newPayment, ...existingPayments],
      };
    });

    saveLiabilities(updated);
    addToast(`Recorded repayment of ₹${amount.toLocaleString('en-IN')} via ${targetAccount}`);
    return true;
  };

  const resetDemoData = () => {
    resetStorage();
    setSettingsState(getStoredSettings());
    setBalancesState(getStoredBalances());
    setIncomes(getStoredIncomes());
    setExpenses(getStoredExpenses());
    setLiabilities(getStoredLiabilities());
    setTransfers(getStoredTransfers());
    setAdjustments(getStoredAdjustments());
    setCategoriesState(getStoredCategories());
    setRecurringExpenses(getStoredRecurringExpenses());
    setPlannedBudgets(getStoredPlannedBudgets());
    setSavingsGoals(getStoredSavingsGoals());

    setTrips(getStoredTrips());
    setTripExpenses(getStoredTripExpenses());
    setTripSettlements(getStoredTripSettlements());

    setHouses(getStoredHouses());
    setHouseExpenses(getStoredHouseExpenses());
    setHouseIncomes(getStoredHouseIncomes());
    setHouseCreditRecords(getStoredHouseCreditRecords());
    setHouseCreditAdjustments(getStoredHouseAdjustments());
    setHouseSettlements(getStoredHouseSettlements());
    setRecurringHouseExpenses(getStoredRecurringHouseExpenses());

    addToast('Reset to default sample data', 'info');
  };

  return (
    <FinanceContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        dbConnected,
        dbStatusMessage,
        isDbLoading,
        refreshFromDb,
        settings,
        updateSettings,
        balances,
        updateAccountBalance,
        incomes,
        expenses,
        liabilities,
        transfers,
        adjustments,
        categories,
        recurringExpenses,
        plannedBudgets,
        savingsGoals,
        metrics,
        unifiedTransactions,
        balanceHistory,
        toasts,
        addToast,
        removeToast,
        addCategory,
        updateCategory,
        deleteCategory,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        toggleRecurringExpense,
        setPlannedBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addTransfer,
        deleteTransfer,
        addLiability,
        updateLiability,
        deleteLiability,
        payEmi,

        // Trips Exports
        trips,
        tripExpenses,
        tripSettlements,
        addTrip,
        updateTrip,
        deleteTrip,
        addTripParticipant,
        removeTripParticipant,
        addTripExpense,
        updateTripExpense,
        deleteTripExpense,
        addTripSettlement,
        recordTripExpenseInPersonal,

        // House Exports
        houses,
        houseExpenses,
        houseIncomes,
        houseCreditRecords,
        houseCreditAdjustments,
        houseSettlements,
        recurringHouseExpenses,
        addHouse,
        updateHouse,
        deleteHouse,
        addHouseMember,
        removeHouseMember,
        addHouseExpense,
        updateHouseExpense,
        deleteHouseExpense,
        addHouseIncome,
        deleteHouseIncome,
        addHouseSettlement,
        addRecurringHouseExpense,
        deleteRecurringHouseExpense,
        applyHouseCredit,
        refundHouseCredit,
        addHouseCreditAdjustment,
        recordHouseExpenseInPersonal,

        filters,
        setFilters,
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
        resetDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
