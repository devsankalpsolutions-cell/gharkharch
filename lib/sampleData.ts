import {
  AccountBalance,
  FinancialSettings,
  Income,
  Expense,
  Liability,
  UserProfile,
  MoneyTransfer,
  RecurringFixedExpense,
  PlannedCategoryBudget,
  SavingsGoal,
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

export const DEFAULT_USER: UserProfile = {
  id: 'guest',
  name: 'User Profile',
  email: 'user@example.com',
  currency: '₹',
  numberFormat: 'indian',
  theme: 'dark',
  isMonthlyCarryForwardEnabled: true,
  isInitialSetupCompleted: false,
};

export const DEFAULT_FINANCIAL_SETTINGS: FinancialSettings = {
  salaryDate: 5,
  expectedMonthlySalary: 0,
  minimumSafetyBalance: 0,
  repaymentStrategy: 'balanced',
};

export const INITIAL_BALANCES: AccountBalance = {
  bankBalance: 0,
  walletBalance: 0,
  totalAvailable: 0,
};

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  'Rent',
  'Electricity',
  'Water',
  'Internet',
  'Gas',
  'Groceries',
  'Cleaning',
  'Maid',
  'Maintenance',
  'Furniture',
  'Repairs',
  'Subscription',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Other',
];

export const INITIAL_RECURRING_FIXED_EXPENSES: RecurringFixedExpense[] = [];
export const INITIAL_PLANNED_BUDGETS: PlannedCategoryBudget[] = [];
export const INITIAL_INCOMES: Income[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_LIABILITIES: Liability[] = [];
export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [];
export const INITIAL_TRANSFERS: MoneyTransfer[] = [];

export const INITIAL_TRIPS: Trip[] = [];
export const INITIAL_TRIP_EXPENSES: TripExpense[] = [];
export const INITIAL_TRIP_SETTLEMENTS: TripSettlement[] = [];

export const INITIAL_HOUSES: House[] = [];
export const INITIAL_HOUSE_EXPENSES: HouseExpense[] = [];
export const INITIAL_HOUSE_INCOMES: HouseIncome[] = [];
export const INITIAL_HOUSE_CREDIT_RECORDS: HouseMemberCreditRecord[] = [];
export const INITIAL_HOUSE_ADJUSTMENTS: HouseCreditAdjustment[] = [];
export const INITIAL_HOUSE_SETTLEMENTS: HouseSettlement[] = [];
export const INITIAL_RECURRING_HOUSE_EXPENSES: RecurringHouseExpense[] = [];
