'use client';

// ==========================================
// CORE PERSONAL FINANCE TYPES
// ==========================================

export type AccountType = 'Bank' | 'Wallet';

export type PaymentMethod = 
  | 'Bank Transfer' 
  | 'UPI' 
  | 'Cash' 
  | 'Credit Card' 
  | 'Debit Card'
  | 'Cheque'
  | 'Other';

export interface AccountBalance {
  bankBalance: number;
  walletBalance: number;
  totalAvailable: number;
}

export type RepaymentStrategy = 'balanced' | 'quick_win' | 'largest_first';

export interface FinancialSettings {
  salaryDate: number; // 1 to 31
  expectedMonthlySalary: number; // e.g. 145000
  minimumSafetyBalance: number; // e.g. 5000
  repaymentStrategy: RepaymentStrategy;
}

export type IncomeCategory = string;

export interface Income {
  id: string;
  userId: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  receivedIn: AccountType; // Bank or Wallet
  paymentMethod?: PaymentMethod;
  description?: string;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  paymentMethod: PaymentMethod;
  account: AccountType;
  description?: string;
  createdAt: string;
}

export type LiabilityType = 
  | 'Credit Card' 
  | 'Personal Loan' 
  | 'Home Loan' 
  | 'Car Loan' 
  | 'Friend Borrow' 
  | 'Loan'
  | 'EMI'
  | 'Other';

export type LiabilityPriority = 'High' | 'Medium' | 'Low';
export type LiabilityStatus = 'Active' | 'Paid' | 'Overdue' | 'Upcoming';

export interface LiabilityPayment {
  id: string;
  liabilityId: string;
  userId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  account: AccountType;
  notes?: string;
}

export interface Liability {
  id: string;
  userId: string;
  name: string;
  type: LiabilityType;
  totalAmount: number;
  remainingAmount: number;
  paidAmount: number;
  monthlyEmi: number;
  dueDate: string;
  priority: LiabilityPriority;
  lenderName?: string;
  friendName?: string;
  interestRate?: number;
  startDate?: string;
  endDate?: string;
  expectedReturnDate?: string;
  notes?: string;
  status: LiabilityStatus;
  createdAt: string;
  payments?: LiabilityPayment[];
}

export interface MoneyTransfer {
  id: string;
  userId: string;
  fromAccount: AccountType;
  toAccount: AccountType;
  amount: number;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: string;
}

export interface BalanceAdjustment {
  id: string;
  userId: string;
  account: AccountType;
  oldBalance: number;
  newBalance: number;
  amountChange: number;
  reason: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface RecurringFixedExpense {
  id: string;
  userId: string;
  name: string;
  amount?: number;
  expectedAmount?: number;
  dueDateDay: number; // 1 to 31
  category: string;
  isEnabled: boolean;
  isFixed?: boolean;
}

export interface PlannedCategoryBudget {
  id: string;
  category: string;
  plannedAmount: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  iconName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currency: string;
  numberFormat: 'indian' | 'international' | 'standard';
  theme: 'light' | 'dark' | 'system';
  isMonthlyCarryForwardEnabled?: boolean;
  isInitialSetupCompleted?: boolean;
  defaultMonth?: string;
  createdAt?: string;
}

export type User = UserProfile;

export interface CustomCategory {
  id: string;
  name: string;
  isCustom: boolean;
  createdAt: string;
}

export type TransactionType = 
  | 'Income' 
  | 'Expense' 
  | 'Liability Payment' 
  | 'Transfer (Bank → Wallet)' 
  | 'Transfer (Wallet → Bank)' 
  | 'Balance Adjustment';

export interface UnifiedTransaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  account: AccountType;
  description?: string;
  referenceId?: string;
}

export interface BalanceHistoryEntry {
  id: string;
  date: string;
  account: AccountType;
  amountChange: number;
  type: string;
  title: string;
  runningBankBalance: number;
  runningWalletBalance: number;
}

export interface RecommendedPaymentItem {
  liabilityId: string;
  liabilityName: string;
  remainingAmount: number;
  recommendedAmount: number;
  priority: LiabilityPriority;
}

export interface SmartRecommendationResult {
  safeLiabilityCapacity: number;
  totalRecommended: number;
  explanation: string;
  distributions: RecommendedPaymentItem[];
}

export interface ActualVsPlannedCategory {
  category: string;
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  status: 'Under Plan' | 'On Plan' | 'Over Plan';
}

export interface FinancialMetrics {
  bankBalance: number;
  walletBalance: number;
  totalAvailable: number;
  totalIncome: number;
  totalExpenses: number;
  totalLiabilitiesRemaining: number;
  totalLiabilityPaymentsThisMonth: number;
  monthlyAmountDue: number;
  remainingBalance: number;
  savingsSurplus: number;
  expensePercentage: number;
  liabilityPaymentPercentage: number;
  savingsPercentage: number;
  highestExpenseCategory: { category: string; amount: number } | null;
  dailyExpenseAverage: number;

  salaryDate: number;
  nextSalaryDateFormatted: string;
  daysToNextSalary: number;
  expectedMonthlySalary: number;
  minimumSafetyBalance: number;
  fixedExpensesTotal: number;
  plannedExpensesTotal: number;
  totalExpectedMonthlyExpenses: number;
  remainingFixedExpensesThisMonth: number;
  remainingPlannedExpensesThisMonth: number;
  safeSpendingUntilNextSalary: number;
  dailySafeSpendingLimit: number;
  safeLiabilityCapacity: number;
  smartRecommendation: SmartRecommendationResult;
  moneyHealthScore: 'Good' | 'Needs Attention' | 'Critical';
  moneyHealthReason: string;
  actualVsPlannedCategories: ActualVsPlannedCategory[];
  expectedClosingBalanceForecast: number;
}

// ==========================================
// 1. TRIP EXPENSE MANAGEMENT TYPES (SPLITWISE-STYLE)
// ==========================================

export type TripSplitMethod = 'equal' | 'percentage' | 'exact' | 'shares' | 'selected';

export interface TripParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface TripExpenseShare {
  participantId: string;
  shareAmount: number;
  percentage?: number;
  exactAmount?: number;
  sharesCount?: number;
}

export interface TripExpense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  paidByParticipantId: string;
  splitMethod: TripSplitMethod;
  shares: TripExpenseShare[];
  paymentMethod: PaymentMethod;
  notes?: string;
  isRecordedInPersonal?: boolean;
  createdAt: string;
}

export interface TripSettlement {
  id: string;
  tripId: string;
  fromParticipantId: string;
  toParticipantId: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: 'Completed' | 'Pending';
  isRecordedInPersonal?: boolean;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  budget?: number;
  currency: string;
  coverImage?: string;
  adminParticipantId: string;
  participants: TripParticipant[];
  createdAt: string;
}

export interface MinimalSettlementInstruction {
  fromParticipantId: string;
  fromParticipantName: string;
  toParticipantId: string;
  toParticipantName: string;
  amount: number;
}

export interface ParticipantTripBalance {
  participantId: string;
  participantName: string;
  totalPaid: number;
  totalShare: number;
  netBalance: number; // positive = to receive, negative = owes
}

// ==========================================
// 2. MANAGE HOUSE / PG TYPES (ENHANCED HOUSE LEDGER & CREDIT MODEL)
// ==========================================

export interface HouseMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface HouseExpenseShare {
  memberId: string;
  shareAmount: number;
  percentage?: number;
  exactAmount?: number;
  sharesCount?: number;
}

export type HouseFinancialTreatment = 
  | 'Personal Account Payment' 
  | 'PG / House Income' 
  | 'House Cash / Pool';

export interface AppliedMemberCredit {
  memberId: string;
  creditRecordId?: string;
  amount: number;
}

export interface HouseExpense {
  id: string;
  houseId: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  paidByMemberId: string;
  splitMethod: TripSplitMethod;
  shares: HouseExpenseShare[];
  paymentMethod: PaymentMethod;
  financialTreatment?: HouseFinancialTreatment;
  appliedCredits?: AppliedMemberCredit[];
  notes?: string;
  isRecordedInPersonal?: boolean;
  createdAt: string;
}

export type OverpaymentAction = 
  | 'Save as Advance Credit' 
  | 'Treat as House Income' 
  | 'Refund' 
  | 'Custom Adjustment';

export interface HouseIncome {
  id: string;
  houseId: string;
  title: string;
  amount: number;
  date: string;
  receivedByMemberId: string;
  paidByMemberId: string;
  category: string;
  requiredShare?: number;
  overpaymentAction?: OverpaymentAction;
  advanceCreditGenerated?: number;
  description?: string;
  isRecordedInPersonal?: boolean;
  createdAt: string;
}

export interface HouseSettlement {
  id: string;
  houseId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: 'Completed' | 'Pending';
  isRecordedInPersonal?: boolean;
  createdAt: string;
}

export interface HouseMemberCreditRecord {
  id: string;
  houseId: string;
  memberId: string;
  memberName: string;
  amount: number;
  remainingAmount: number;
  reason: string;
  date: string;
  status: 'Available' | 'Applied' | 'Refunded';
  appliedToExpenseId?: string;
  appliedToExpenseTitle?: string;
  appliedDate?: string;
  createdAt: string;
}

export type HouseAdjustmentType = 'Credit' | 'Outstanding' | 'Refund' | 'Adjustment';

export interface HouseCreditAdjustment {
  id: string;
  houseId: string;
  memberId: string;
  amount: number;
  type: HouseAdjustmentType;
  reason: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface RecurringHouseExpense {
  id: string;
  houseId: string;
  title: string;
  expectedAmount: number;
  category: string;
  frequency: 'Monthly' | 'Weekly';
  dueDateDay: number;
  splitMethod: TripSplitMethod;
  isEnabled: boolean;
}

export interface House {
  id: string;
  name: string;
  address?: string;
  description?: string;
  startDate: string;
  currency: string;
  monthlyBudget?: number;
  ownerMemberId?: string;
  creatorMemberId?: string;
  members: HouseMember[];
  createdAt: string;
}

export interface HouseMemberLedgerEntry {
  memberId: string;
  memberName: string;
  currentShare: number;
  totalPaid: number;
  creditsApplied: number;
  outstandingAmount: number;
  advanceCredit: number;
  netPosition: number;
  status: 'Credit Available' | 'Due' | 'Settled';
  statusLabel: string;
}

export interface FilterState {
  month: string;
  searchQuery: string;
  category: string;
  paymentMethod: string;
  transactionType: string;
  account: string;
  dateRange: {
    start: string;
    end: string;
  };
  liabilityStatus: string;
}
