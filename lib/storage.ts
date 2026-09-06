import {
  AccountBalance,
  FinancialSettings,
  Income,
  Expense,
  Liability,
  UserProfile,
  MoneyTransfer,
  BalanceAdjustment,
  FinancialMetrics,
  UnifiedTransaction,
  BalanceHistoryEntry,
  PlannedCategoryBudget,
  RecurringFixedExpense,
  SavingsGoal,
  AccountType,
  Trip,
  TripExpense,
  TripSettlement,
  House,
  HouseExpense,
  HouseIncome,
  HouseSettlement,
  RecurringHouseExpense,
  HouseMemberCreditRecord,
  HouseCreditAdjustment,
} from './types';
import {
  DEFAULT_USER,
  DEFAULT_FINANCIAL_SETTINGS,
  INITIAL_BALANCES,
  DEFAULT_EXPENSE_CATEGORIES,
  INITIAL_INCOMES,
  INITIAL_EXPENSES,
  INITIAL_LIABILITIES,
  INITIAL_RECURRING_FIXED_EXPENSES,
  INITIAL_PLANNED_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSFERS,
  INITIAL_TRIPS,
  INITIAL_TRIP_EXPENSES,
  INITIAL_TRIP_SETTLEMENTS,
  INITIAL_HOUSES,
  INITIAL_HOUSE_EXPENSES,
  INITIAL_HOUSE_INCOMES,
  INITIAL_HOUSE_CREDIT_RECORDS,
  INITIAL_HOUSE_ADJUSTMENTS,
  INITIAL_HOUSE_SETTLEMENTS,
  INITIAL_RECURRING_HOUSE_EXPENSES,
} from './sampleData';

const KEYS = {
  USER: 'gharkharch_user',
  SETTINGS: 'gharkharch_settings',
  BALANCES: 'gharkharch_balances',
  INCOMES: 'gharkharch_incomes',
  EXPENSES: 'gharkharch_expenses',
  LIABILITIES: 'gharkharch_liabilities',
  RECURRING_EXPENSES: 'gharkharch_recurring_expenses',
  PLANNED_BUDGETS: 'gharkharch_planned_budgets',
  SAVINGS_GOALS: 'gharkharch_savings_goals',
  TRANSFERS: 'gharkharch_transfers',
  ADJUSTMENTS: 'gharkharch_adjustments',
  CATEGORIES: 'gharkharch_categories',
  TRIPS: 'gharkharch_trips',
  TRIP_EXPENSES: 'gharkharch_trip_expenses',
  TRIP_SETTLEMENTS: 'gharkharch_trip_settlements',
  HOUSES: 'gharkharch_houses',
  HOUSE_EXPENSES: 'gharkharch_house_expenses',
  HOUSE_INCOMES: 'gharkharch_house_incomes',
  HOUSE_CREDIT_RECORDS: 'gharkharch_house_credit_records',
  HOUSE_ADJUSTMENTS: 'gharkharch_house_adjustments',
  HOUSE_SETTLEMENTS: 'gharkharch_house_settlements',
  RECURRING_HOUSE_EXPENSES: 'gharkharch_recurring_house_expenses',
};

export const getStoredUser = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
};

export const setStoredUser = (user: UserProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user', err);
  }
};

export const getStoredSettings = (): FinancialSettings => {
  if (typeof window === 'undefined') return DEFAULT_FINANCIAL_SETTINGS;
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_FINANCIAL_SETTINGS;
  } catch {
    return DEFAULT_FINANCIAL_SETTINGS;
  }
};

export const setStoredSettings = (settings: FinancialSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

export const getStoredBalances = (): AccountBalance => {
  if (typeof window === 'undefined') return INITIAL_BALANCES;
  try {
    const data = localStorage.getItem(KEYS.BALANCES);
    return data ? JSON.parse(data) : INITIAL_BALANCES;
  } catch {
    return INITIAL_BALANCES;
  }
};

export const setStoredBalances = (balances: AccountBalance): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.BALANCES, JSON.stringify(balances));
  } catch (err) {
    console.error('Failed to save balances', err);
  }
};

export const getStoredIncomes = (): Income[] => {
  if (typeof window === 'undefined') return INITIAL_INCOMES;
  try {
    const data = localStorage.getItem(KEYS.INCOMES);
    return data ? JSON.parse(data) : INITIAL_INCOMES;
  } catch {
    return INITIAL_INCOMES;
  }
};

export const setStoredIncomes = (incomes: Income[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.INCOMES, JSON.stringify(incomes));
  } catch (err) {
    console.error('Failed to save incomes', err);
  }
};

export const getStoredExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return INITIAL_EXPENSES;
  try {
    const data = localStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : INITIAL_EXPENSES;
  } catch {
    return INITIAL_EXPENSES;
  }
};

export const setStoredExpenses = (expenses: Expense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses', err);
  }
};

export const getStoredLiabilities = (): Liability[] => {
  if (typeof window === 'undefined') return INITIAL_LIABILITIES;
  try {
    const data = localStorage.getItem(KEYS.LIABILITIES);
    return data ? JSON.parse(data) : INITIAL_LIABILITIES;
  } catch {
    return INITIAL_LIABILITIES;
  }
};

export const setStoredLiabilities = (liabilities: Liability[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.LIABILITIES, JSON.stringify(liabilities));
  } catch (err) {
    console.error('Failed to save liabilities', err);
  }
};

export const getStoredRecurringExpenses = (): RecurringFixedExpense[] => {
  if (typeof window === 'undefined') return INITIAL_RECURRING_FIXED_EXPENSES;
  try {
    const data = localStorage.getItem(KEYS.RECURRING_EXPENSES);
    return data ? JSON.parse(data) : INITIAL_RECURRING_FIXED_EXPENSES;
  } catch {
    return INITIAL_RECURRING_FIXED_EXPENSES;
  }
};

export const setStoredRecurringExpenses = (items: RecurringFixedExpense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.RECURRING_EXPENSES, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save recurring expenses', err);
  }
};

export const getStoredPlannedBudgets = (): PlannedCategoryBudget[] => {
  if (typeof window === 'undefined') return INITIAL_PLANNED_BUDGETS;
  try {
    const data = localStorage.getItem(KEYS.PLANNED_BUDGETS);
    return data ? JSON.parse(data) : INITIAL_PLANNED_BUDGETS;
  } catch {
    return INITIAL_PLANNED_BUDGETS;
  }
};

export const setStoredPlannedBudgets = (budgets: PlannedCategoryBudget[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.PLANNED_BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error('Failed to save planned budgets', err);
  }
};

export const getStoredSavingsGoals = (): SavingsGoal[] => {
  if (typeof window === 'undefined') return INITIAL_SAVINGS_GOALS;
  try {
    const data = localStorage.getItem(KEYS.SAVINGS_GOALS);
    return data ? JSON.parse(data) : INITIAL_SAVINGS_GOALS;
  } catch {
    return INITIAL_SAVINGS_GOALS;
  }
};

export const setStoredSavingsGoals = (goals: SavingsGoal[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save savings goals', err);
  }
};

export const getStoredTransfers = (): MoneyTransfer[] => {
  if (typeof window === 'undefined') return INITIAL_TRANSFERS;
  try {
    const data = localStorage.getItem(KEYS.TRANSFERS);
    return data ? JSON.parse(data) : INITIAL_TRANSFERS;
  } catch {
    return INITIAL_TRANSFERS;
  }
};

export const setStoredTransfers = (transfers: MoneyTransfer[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.TRANSFERS, JSON.stringify(transfers));
  } catch (err) {
    console.error('Failed to save transfers', err);
  }
};

export const getStoredAdjustments = (): BalanceAdjustment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(KEYS.ADJUSTMENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setStoredAdjustments = (adjustments: BalanceAdjustment[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ADJUSTMENTS, JSON.stringify(adjustments));
  } catch (err) {
    console.error('Failed to save adjustments', err);
  }
};

export const getStoredCategories = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_EXPENSE_CATEGORIES;
  try {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_EXPENSE_CATEGORIES;
  } catch {
    return DEFAULT_EXPENSE_CATEGORIES;
  }
};

export const setStoredCategories = (categories: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories', err);
  }
};

// ==========================================
// TRIPS & HOUSE PERSISTENCE HELPERS
// ==========================================

export const getStoredTrips = (): Trip[] => {
  if (typeof window === 'undefined') return INITIAL_TRIPS;
  try {
    const data = localStorage.getItem(KEYS.TRIPS);
    return data ? JSON.parse(data) : INITIAL_TRIPS;
  } catch {
    return INITIAL_TRIPS;
  }
};

export const setStoredTrips = (trips: Trip[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.TRIPS, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trips', err);
  }
};

export const getStoredTripExpenses = (): TripExpense[] => {
  if (typeof window === 'undefined') return INITIAL_TRIP_EXPENSES;
  try {
    const data = localStorage.getItem(KEYS.TRIP_EXPENSES);
    return data ? JSON.parse(data) : INITIAL_TRIP_EXPENSES;
  } catch {
    return INITIAL_TRIP_EXPENSES;
  }
};

export const setStoredTripExpenses = (items: TripExpense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.TRIP_EXPENSES, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save trip expenses', err);
  }
};

export const getStoredTripSettlements = (): TripSettlement[] => {
  if (typeof window === 'undefined') return INITIAL_TRIP_SETTLEMENTS;
  try {
    const data = localStorage.getItem(KEYS.TRIP_SETTLEMENTS);
    return data ? JSON.parse(data) : INITIAL_TRIP_SETTLEMENTS;
  } catch {
    return INITIAL_TRIP_SETTLEMENTS;
  }
};

export const setStoredTripSettlements = (items: TripSettlement[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.TRIP_SETTLEMENTS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save trip settlements', err);
  }
};

export const getStoredHouses = (): House[] => {
  if (typeof window === 'undefined') return INITIAL_HOUSES;
  try {
    const data = localStorage.getItem(KEYS.HOUSES);
    return data ? JSON.parse(data) : INITIAL_HOUSES;
  } catch {
    return INITIAL_HOUSES;
  }
};

export const setStoredHouses = (houses: House[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.HOUSES, JSON.stringify(houses));
  } catch (err) {
    console.error('Failed to save houses', err);
  }
};

export const getStoredHouseExpenses = (): HouseExpense[] => {
  if (typeof window === 'undefined') return INITIAL_HOUSE_EXPENSES;
  try {
    const data = localStorage.getItem(KEYS.HOUSE_EXPENSES);
    return data ? JSON.parse(data) : INITIAL_HOUSE_EXPENSES;
  } catch {
    return INITIAL_HOUSE_EXPENSES;
  }
};

export const setStoredHouseExpenses = (items: HouseExpense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.HOUSE_EXPENSES, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save house expenses', err);
  }
};

export const getStoredHouseIncomes = (): HouseIncome[] => {
  if (typeof window === 'undefined') return INITIAL_HOUSE_INCOMES;
  try {
    const data = localStorage.getItem(KEYS.HOUSE_INCOMES);
    return data ? JSON.parse(data) : INITIAL_HOUSE_INCOMES;
  } catch {
    return INITIAL_HOUSE_INCOMES;
  }
};

export const setStoredHouseIncomes = (items: HouseIncome[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.HOUSE_INCOMES, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save house incomes', err);
  }
};

export const getStoredHouseCreditRecords = (): HouseMemberCreditRecord[] => {
  if (typeof window === 'undefined') return INITIAL_HOUSE_CREDIT_RECORDS;
  try {
    const data = localStorage.getItem(KEYS.HOUSE_CREDIT_RECORDS);
    return data ? JSON.parse(data) : INITIAL_HOUSE_CREDIT_RECORDS;
  } catch {
    return INITIAL_HOUSE_CREDIT_RECORDS;
  }
};

export const setStoredHouseCreditRecords = (items: HouseMemberCreditRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.HOUSE_CREDIT_RECORDS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save house credit records', err);
  }
};

export const getStoredHouseAdjustments = (): HouseCreditAdjustment[] => {
  if (typeof window === 'undefined') return INITIAL_HOUSE_ADJUSTMENTS;
  try {
    const data = localStorage.getItem(KEYS.HOUSE_ADJUSTMENTS);
    return data ? JSON.parse(data) : INITIAL_HOUSE_ADJUSTMENTS;
  } catch {
    return INITIAL_HOUSE_ADJUSTMENTS;
  }
};

export const setStoredHouseAdjustments = (items: HouseCreditAdjustment[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.HOUSE_ADJUSTMENTS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save house adjustments', err);
  }
};

export const getStoredHouseSettlements = (): HouseSettlement[] => {
  if (typeof window === 'undefined') return INITIAL_HOUSE_SETTLEMENTS;
  try {
    const data = localStorage.getItem(KEYS.HOUSE_SETTLEMENTS);
    return data ? JSON.parse(data) : INITIAL_HOUSE_SETTLEMENTS;
  } catch {
    return INITIAL_HOUSE_SETTLEMENTS;
  }
};

export const setStoredHouseSettlements = (items: HouseSettlement[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.HOUSE_SETTLEMENTS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save house settlements', err);
  }
};

export const getStoredRecurringHouseExpenses = (): RecurringHouseExpense[] => {
  if (typeof window === 'undefined') return INITIAL_RECURRING_HOUSE_EXPENSES;
  try {
    const data = localStorage.getItem(KEYS.RECURRING_HOUSE_EXPENSES);
    return data ? JSON.parse(data) : INITIAL_RECURRING_HOUSE_EXPENSES;
  } catch {
    return INITIAL_RECURRING_HOUSE_EXPENSES;
  }
};

export const setStoredRecurringHouseExpenses = (items: RecurringHouseExpense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.RECURRING_HOUSE_EXPENSES, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save recurring house expenses', err);
  }
};

export const resetToSampleData = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_FINANCIAL_SETTINGS));
    localStorage.setItem(KEYS.BALANCES, JSON.stringify(INITIAL_BALANCES));
    localStorage.setItem(KEYS.INCOMES, JSON.stringify(INITIAL_INCOMES));
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(KEYS.LIABILITIES, JSON.stringify(INITIAL_LIABILITIES));
    localStorage.setItem(KEYS.RECURRING_EXPENSES, JSON.stringify(INITIAL_RECURRING_FIXED_EXPENSES));
    localStorage.setItem(KEYS.PLANNED_BUDGETS, JSON.stringify(INITIAL_PLANNED_BUDGETS));
    localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify(INITIAL_SAVINGS_GOALS));
    localStorage.setItem(KEYS.TRANSFERS, JSON.stringify(INITIAL_TRANSFERS));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_EXPENSE_CATEGORIES));
    localStorage.setItem(KEYS.ADJUSTMENTS, JSON.stringify([]));

    localStorage.setItem(KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
    localStorage.setItem(KEYS.TRIP_EXPENSES, JSON.stringify(INITIAL_TRIP_EXPENSES));
    localStorage.setItem(KEYS.TRIP_SETTLEMENTS, JSON.stringify(INITIAL_TRIP_SETTLEMENTS));

    localStorage.setItem(KEYS.HOUSES, JSON.stringify(INITIAL_HOUSES));
    localStorage.setItem(KEYS.HOUSE_EXPENSES, JSON.stringify(INITIAL_HOUSE_EXPENSES));
    localStorage.setItem(KEYS.HOUSE_INCOMES, JSON.stringify(INITIAL_HOUSE_INCOMES));
    localStorage.setItem(KEYS.HOUSE_CREDIT_RECORDS, JSON.stringify(INITIAL_HOUSE_CREDIT_RECORDS));
    localStorage.setItem(KEYS.HOUSE_ADJUSTMENTS, JSON.stringify(INITIAL_HOUSE_ADJUSTMENTS));
    localStorage.setItem(KEYS.HOUSE_SETTLEMENTS, JSON.stringify(INITIAL_HOUSE_SETTLEMENTS));
    localStorage.setItem(KEYS.RECURRING_HOUSE_EXPENSES, JSON.stringify(INITIAL_RECURRING_HOUSE_EXPENSES));
  } catch (err) {
    console.error('Failed to reset sample data', err);
  }
};

export function getAccountFromPaymentMethod(paymentMethod: string): AccountType {
  if (paymentMethod === 'Cash') return 'Wallet';
  return 'Bank';
}

export function calculateNextSalaryDate(salaryDate: number): { formattedDate: string; daysRemaining: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let targetDate = new Date(year, month, salaryDate);
  if (now.getDate() >= salaryDate) {
    targetDate = new Date(year, month + 1, salaryDate);
  }

  const diffTime = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString('en-GB', options);

  return { formattedDate, daysRemaining };
}

export function calculateActualVsPlanned(
  expenses: Expense[],
  plannedBudgets: PlannedCategoryBudget[],
  selectedMonth: string
) {
  const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));
  const actualMap: Record<string, number> = {};

  monthExpenses.forEach(exp => {
    actualMap[exp.category] = (actualMap[exp.category] || 0) + exp.amount;
  });

  return plannedBudgets.map(b => {
    const actualAmount = actualMap[b.category] || 0;
    const remainingAmount = b.plannedAmount - actualAmount;
    let status: 'Under Plan' | 'On Plan' | 'Over Plan' = 'Under Plan';

    if (actualAmount === b.plannedAmount) {
      status = 'On Plan';
    } else if (actualAmount > b.plannedAmount) {
      status = 'Over Plan';
    }

    return {
      category: b.category,
      plannedAmount: b.plannedAmount,
      actualAmount,
      remainingAmount,
      status,
    };
  });
}

export function calculateSmartLiabilityRecommendation(
  totalAvailable: number,
  remainingFixedExpenses: number,
  remainingPlannedExpenses: number,
  minimumSafetyBalance: number,
  liabilities: Liability[],
  strategy: 'balanced' | 'quick_win' | 'largest_first'
) {
  const safeLiabilityCapacity = Math.max(
    0,
    totalAvailable - remainingFixedExpenses - remainingPlannedExpenses - minimumSafetyBalance
  );

  const activeLiabilities = liabilities.filter(l => l.status === 'Active' && l.remainingAmount > 0);

  if (activeLiabilities.length === 0 || safeLiabilityCapacity <= 0) {
    return {
      safeLiabilityCapacity,
      totalRecommended: 0,
      explanation: 'No capacity available or no active liabilities.',
      distributions: [],
    };
  }

  let sorted = [...activeLiabilities];
  if (strategy === 'quick_win') {
    sorted.sort((a, b) => a.remainingAmount - b.remainingAmount);
  } else if (strategy === 'largest_first') {
    sorted.sort((a, b) => b.remainingAmount - a.remainingAmount);
  } else {
    sorted.sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  let remainingPool = safeLiabilityCapacity;
  const distributions = sorted.map(l => {
    const rec = Math.min(remainingPool, l.remainingAmount);
    remainingPool -= rec;
    return {
      liabilityId: l.id,
      liabilityName: l.name,
      remainingAmount: l.remainingAmount,
      recommendedAmount: rec,
      priority: l.priority,
    };
  }).filter(d => d.recommendedAmount > 0);

  const totalRecommended = distributions.reduce((acc, c) => acc + c.recommendedAmount, 0);

  return {
    safeLiabilityCapacity,
    totalRecommended,
    explanation: `Calculated using ${strategy.replace('_', ' ')} strategy. Safe debt capacity: ₹${safeLiabilityCapacity.toLocaleString('en-IN')}`,
    distributions,
  };
}

export function calculateMoneyHealthScore(
  totalAvailable: number,
  minimumSafetyReserve: number,
  remainingFixedExpenses: number,
  overBudgetCount: number
) {
  if (totalAvailable < minimumSafetyReserve) {
    return {
      score: 'Critical' as const,
      reason: 'Total available balance is below your minimum safety reserve.',
    };
  }
  if (totalAvailable < minimumSafetyReserve + remainingFixedExpenses || overBudgetCount > 1) {
    return {
      score: 'Needs Attention' as const,
      reason: 'Available balance is tight relative to remaining fixed expenses.',
    };
  }
  return {
    score: 'Good' as const,
    reason: 'Healthy cash reserve maintained above minimum safety threshold.',
  };
}

export function calculateMetrics(
  incomes: Income[],
  expenses: Expense[],
  liabilities: Liability[],
  balances: AccountBalance,
  settings: FinancialSettings,
  recurringExpenses: RecurringFixedExpense[],
  plannedBudgets: PlannedCategoryBudget[],
  selectedMonth: string
): FinancialMetrics {
  const monthIncomes = incomes.filter(inc => inc.date.startsWith(selectedMonth));
  const monthExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));

  let liabilityPaymentsThisMonth = 0;
  liabilities.forEach(lia => {
    if (lia.payments) {
      lia.payments.forEach(pmt => {
        if (pmt.date.startsWith(selectedMonth)) {
          liabilityPaymentsThisMonth += pmt.amount;
        }
      });
    }
  });

  const totalIncome = monthIncomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = monthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalLiabilityPaymentsThisMonth = liabilityPaymentsThisMonth;

  const monthlyAmountDue = liabilities
    .filter(lia => lia.status === 'Active')
    .reduce((acc, curr) => acc + (curr.type === 'Friend Borrow' ? 0 : curr.monthlyEmi), 0);

  const totalLiabilitiesRemaining = liabilities
    .filter(lia => lia.status === 'Active' || lia.status === 'Overdue')
    .reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);

  const remainingBalance = totalIncome - totalExpenses - totalLiabilityPaymentsThisMonth;
  const savingsSurplus = Math.max(0, remainingBalance);

  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const liabilityPaymentPercentage = totalIncome > 0 ? (totalLiabilityPaymentsThisMonth / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (remainingBalance / totalIncome) * 100 : 0;

  const categoryMap: Record<string, number> = {};
  monthExpenses.forEach(exp => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });

  let highestCat: { category: string; amount: number } | null = null;
  Object.entries(categoryMap).forEach(([cat, amt]) => {
    if (!highestCat || amt > highestCat.amount) {
      highestCat = { category: cat, amount: amt };
    }
  });

  const dailyExpenseAverage = Math.round(totalExpenses / 30);

  const { formattedDate: nextSalaryDateFormatted, daysRemaining: daysToNextSalary } =
    calculateNextSalaryDate(settings.salaryDate);

  const activeFixedExpenses = recurringExpenses.filter(r => r.isEnabled);
  const fixedExpensesTotal = activeFixedExpenses.reduce((acc, c) => acc + (c.expectedAmount ?? c.amount ?? 0), 0);
  
  const paidFixedCategories = new Set(monthExpenses.map(e => e.category));
  const remainingFixedExpensesThisMonth = activeFixedExpenses
    .filter(r => !paidFixedCategories.has(r.category))
    .reduce((acc, c) => acc + (c.expectedAmount ?? c.amount ?? 0), 0);

  const plannedExpensesTotal = plannedBudgets.reduce((acc, c) => acc + c.plannedAmount, 0);
  const actualVsPlannedCategories = calculateActualVsPlanned(expenses, plannedBudgets, selectedMonth);
  const remainingPlannedExpensesThisMonth = Math.max(
    0,
    actualVsPlannedCategories.reduce((acc, c) => acc + Math.max(0, c.remainingAmount), 0)
  );

  const totalExpectedMonthlyExpenses = fixedExpensesTotal + plannedExpensesTotal;

  const bankBal = Number(balances?.bankBalance ?? (balances as any)?.bank_balance ?? 0);
  const walletBal = Number(balances?.walletBalance ?? (balances as any)?.wallet_balance ?? 0);
  const totalAvailable = bankBal + walletBal;
  const safeSpendingUntilNextSalary = Math.max(
    0,
    totalAvailable - remainingFixedExpensesThisMonth - remainingPlannedExpensesThisMonth - (settings.minimumSafetyBalance || 0)
  );

  const dailySafeSpendingLimit = Math.round(
    safeSpendingUntilNextSalary / Math.max(1, daysToNextSalary)
  );

  const smartRecommendation = calculateSmartLiabilityRecommendation(
    totalAvailable,
    remainingFixedExpensesThisMonth,
    remainingPlannedExpensesThisMonth,
    settings.minimumSafetyBalance || 0,
    liabilities,
    settings.repaymentStrategy
  );

  const overBudgetCount = actualVsPlannedCategories.filter(c => c.status === 'Over Plan').length;
  const { score: moneyHealthScore, reason: moneyHealthReason } = calculateMoneyHealthScore(
    totalAvailable,
    settings.minimumSafetyBalance || 0,
    remainingFixedExpensesThisMonth,
    overBudgetCount
  );

  const expectedClosingBalanceForecast =
    totalAvailable + (settings.expectedMonthlySalary || 0) - totalExpectedMonthlyExpenses - smartRecommendation.totalRecommended;

  return {
    bankBalance: bankBal,
    walletBalance: walletBal,
    totalAvailable,
    totalIncome,
    totalExpenses,
    totalLiabilitiesRemaining,
    totalLiabilityPaymentsThisMonth,
    monthlyAmountDue,
    remainingBalance,
    savingsSurplus,
    expensePercentage,
    liabilityPaymentPercentage,
    savingsPercentage,
    highestExpenseCategory: highestCat,
    dailyExpenseAverage,

    salaryDate: settings.salaryDate,
    nextSalaryDateFormatted,
    daysToNextSalary,
    expectedMonthlySalary: settings.expectedMonthlySalary,
    minimumSafetyBalance: settings.minimumSafetyBalance,
    fixedExpensesTotal,
    plannedExpensesTotal,
    totalExpectedMonthlyExpenses,
    remainingFixedExpensesThisMonth,
    remainingPlannedExpensesThisMonth,
    safeSpendingUntilNextSalary,
    dailySafeSpendingLimit,
    safeLiabilityCapacity: smartRecommendation.safeLiabilityCapacity,
    smartRecommendation,
    moneyHealthScore,
    moneyHealthReason,
    actualVsPlannedCategories,
    expectedClosingBalanceForecast,
  };
}

export function getUnifiedTransactions(
  incomes: Income[],
  expenses: Expense[],
  liabilities: Liability[],
  transfers: MoneyTransfer[],
  adjustments: BalanceAdjustment[]
): UnifiedTransaction[] {
  const transactions: UnifiedTransaction[] = [];

  incomes.forEach(inc => {
    transactions.push({
      id: `tx_${inc.id}`,
      type: 'Income',
      title: inc.title,
      amount: inc.amount,
      date: inc.date,
      category: inc.category,
      paymentMethod: inc.paymentMethod || 'Bank Transfer',
      account: inc.receivedIn || 'Bank',
      description: inc.description || inc.notes || '',
      referenceId: inc.id,
    });
  });

  expenses.forEach(exp => {
    transactions.push({
      id: `tx_${exp.id}`,
      type: 'Expense',
      title: exp.title,
      amount: exp.amount,
      date: exp.date,
      category: exp.category,
      paymentMethod: exp.paymentMethod,
      account: exp.account || getAccountFromPaymentMethod(exp.paymentMethod),
      description: exp.description,
      referenceId: exp.id,
    });
  });

  liabilities.forEach(lia => {
    if (lia.payments) {
      lia.payments.forEach(pmt => {
        transactions.push({
          id: `tx_${pmt.id}`,
          type: 'Liability Payment',
          title: `Payment: ${lia.name}`,
          amount: pmt.amount,
          date: pmt.date,
          category: lia.type,
          paymentMethod: pmt.paymentMethod,
          account: pmt.account || getAccountFromPaymentMethod(pmt.paymentMethod),
          description: pmt.notes || `Repayment for ${lia.name}`,
          referenceId: lia.id,
        });
      });
    }
  });

  transfers.forEach(trf => {
    const isBankToWallet = trf.fromAccount === 'Bank' && trf.toAccount === 'Wallet';
    transactions.push({
      id: `tx_${trf.id}`,
      type: isBankToWallet ? 'Transfer (Bank → Wallet)' : 'Transfer (Wallet → Bank)',
      title: `Transfer ${trf.fromAccount} → ${trf.toAccount}`,
      amount: trf.amount,
      date: trf.date,
      category: 'Money Transfer',
      paymentMethod: 'Internal Transfer',
      account: trf.fromAccount,
      description: trf.description || `Moved money between ${trf.fromAccount} and ${trf.toAccount}`,
      referenceId: trf.id,
    });
  });

  adjustments.forEach(adj => {
    transactions.push({
      id: `tx_${adj.id}`,
      type: 'Balance Adjustment',
      title: `Balance Adjustment (${adj.account})`,
      amount: Math.abs(adj.amountChange),
      date: adj.date,
      category: 'Adjustment',
      paymentMethod: 'Manual Adjustment',
      account: adj.account,
      description: adj.reason || `Adjusted ${adj.account} balance from ₹${adj.oldBalance} to ₹${adj.newBalance}`,
      referenceId: adj.id,
    });
  });

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBalanceHistory(
  incomes: Income[],
  expenses: Expense[],
  liabilities: Liability[],
  transfers: MoneyTransfer[],
  adjustments: BalanceAdjustment[],
  currentBalances: AccountBalance
): BalanceHistoryEntry[] {
  const events: {
    id: string;
    date: string;
    account: AccountType;
    amountChange: number;
    type: string;
    title: string;
  }[] = [];

  incomes.forEach(inc => {
    events.push({
      id: inc.id,
      date: inc.date,
      account: inc.receivedIn || 'Bank',
      amountChange: inc.amount,
      type: 'Income Deposit',
      title: inc.title,
    });
  });

  expenses.forEach(exp => {
    const acc = exp.account || getAccountFromPaymentMethod(exp.paymentMethod);
    events.push({
      id: exp.id,
      date: exp.date,
      account: acc,
      amountChange: -exp.amount,
      type: 'Expense Payment',
      title: exp.title,
    });
  });

  liabilities.forEach(lia => {
    lia.payments?.forEach(pmt => {
      const acc = pmt.account || getAccountFromPaymentMethod(pmt.paymentMethod);
      events.push({
        id: pmt.id,
        date: pmt.date,
        account: acc,
        amountChange: -pmt.amount,
        type: 'Liability Payment',
        title: `Payment: ${lia.name}`,
      });
    });
  });

  transfers.forEach(trf => {
    events.push({
      id: `${trf.id}_out`,
      date: trf.date,
      account: trf.fromAccount,
      amountChange: -trf.amount,
      type: 'Transfer Out',
      title: `Transfer to ${trf.toAccount}`,
    });
    events.push({
      id: `${trf.id}_in`,
      date: trf.date,
      account: trf.toAccount,
      amountChange: trf.amount,
      type: 'Transfer In',
      title: `Transfer from ${trf.fromAccount}`,
    });
  });

  adjustments.forEach(adj => {
    events.push({
      id: adj.id,
      date: adj.date,
      account: adj.account,
      amountChange: adj.amountChange,
      type: 'Manual Adjustment',
      title: adj.reason || `Balance adjustment`,
    });
  });

  events.sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime());

  let runningBank = 50000;
  let runningWallet = 5000;

  const historyEntries: BalanceHistoryEntry[] = events.map(evt => {
    if (evt.account === 'Bank') {
      runningBank += evt.amountChange;
    } else {
      runningWallet += evt.amountChange;
    }

    return {
      id: evt.id,
      date: evt.date,
      account: evt.account,
      amountChange: evt.amountChange,
      type: evt.type,
      title: evt.title,
      runningBankBalance: runningBank,
      runningWalletBalance: runningWallet,
    };
  });

  return historyEntries.reverse();
}
