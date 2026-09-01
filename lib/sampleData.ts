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
  id: 'user_1',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  currency: 'INR',
  numberFormat: 'indian',
  theme: 'light',
  isMonthlyCarryForwardEnabled: true,
  isInitialSetupCompleted: true,
  createdAt: '2026-01-01T00:00:00Z',
};

export const DEFAULT_FINANCIAL_SETTINGS: FinancialSettings = {
  salaryDate: 5,
  expectedMonthlySalary: 145000,
  minimumSafetyBalance: 5000,
  repaymentStrategy: 'balanced',
};

export const INITIAL_BALANCES: AccountBalance = {
  bankBalance: 50000,
  walletBalance: 5000,
  totalAvailable: 55000,
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

export const INITIAL_RECURRING_FIXED_EXPENSES: RecurringFixedExpense[] = [
  {
    id: 'fix_1',
    userId: 'user_1',
    name: 'Apartment Rent',
    amount: 32000,
    dueDateDay: 2,
    category: 'Rent',
    isEnabled: true,
  },
  {
    id: 'fix_2',
    userId: 'user_1',
    name: 'Society Maintenance',
    amount: 3500,
    dueDateDay: 5,
    category: 'Maintenance',
    isEnabled: true,
  },
  {
    id: 'fix_3',
    userId: 'user_1',
    name: 'Broadband Fiber Internet',
    amount: 1199,
    dueDateDay: 10,
    category: 'Internet',
    isEnabled: true,
  },
  {
    id: 'fix_4',
    userId: 'user_1',
    name: 'Cook & Maid Salary',
    amount: 6000,
    dueDateDay: 1,
    category: 'Maid',
    isEnabled: true,
  },
];

export const INITIAL_PLANNED_BUDGETS: PlannedCategoryBudget[] = [
  { id: 'bud_1', category: 'Groceries', plannedAmount: 15000 },
  { id: 'bud_2', category: 'Food Outings', plannedAmount: 8000 },
  { id: 'bud_3', category: 'Fuel & Commute', plannedAmount: 6000 },
  { id: 'bud_4', category: 'Shopping', plannedAmount: 10000 },
  { id: 'bud_5', category: 'Electricity & Gas', plannedAmount: 5000 },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    userId: 'user_1',
    title: 'Emergency Safety Reserve',
    targetAmount: 150000,
    currentAmount: 85000,
    targetDate: '2026-12-31',
    iconName: 'Shield',
  },
  {
    id: 'goal_2',
    userId: 'user_1',
    title: 'Diwali Family Shopping Fund',
    targetAmount: 50000,
    currentAmount: 20000,
    targetDate: '2026-10-15',
    iconName: 'Gift',
  },
];

export const INITIAL_TRANSFERS: MoneyTransfer[] = [
  {
    id: 'trf_1',
    userId: 'user_1',
    fromAccount: 'Bank',
    toAccount: 'Wallet',
    amount: 5000,
    date: '2026-03-01',
    description: 'ATM Cash Withdrawal for monthly pocket expenses',
    createdAt: '2026-03-01T09:00:00Z',
  },
];

export const INITIAL_INCOMES: Income[] = [
  {
    id: 'inc_1',
    userId: 'user_1',
    title: 'Monthly Salary - TechCorp',
    amount: 145000,
    date: '2026-03-01',
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    receivedIn: 'Bank',
    notes: 'March salary payout deposited to HDFC Bank',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'inc_2',
    userId: 'user_1',
    title: 'Freelance Web Consulting',
    amount: 28000,
    date: '2026-03-12',
    category: 'Freelance',
    paymentMethod: 'UPI',
    receivedIn: 'Bank',
    notes: 'E-commerce UI project milestone 2',
    createdAt: '2026-03-12T14:30:00Z',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    userId: 'user_1',
    title: 'Apartment Rent (3BHK)',
    amount: 32000,
    date: '2026-03-02',
    category: 'Rent',
    paymentMethod: 'Bank Transfer',
    account: 'Bank',
    description: 'Monthly flat rent',
    createdAt: '2026-03-02T11:00:00Z',
  },
];

export const INITIAL_LIABILITIES: Liability[] = [
  {
    id: 'lia_1',
    userId: 'user_1',
    name: 'HDFC Credit Card',
    type: 'Credit Card',
    totalAmount: 45000,
    paidAmount: 15000,
    remainingAmount: 30000,
    monthlyEmi: 15000,
    dueDate: '2026-03-15',
    priority: 'High',
    status: 'Active',
    notes: 'Monthly statement bill',
    createdAt: '2026-02-15T10:00:00Z',
    payments: [],
  },
];

// ==========================================
// INITIAL SAMPLE TRIPS DATA
// ==========================================

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip_1',
    name: 'Goa Beach Weekend Trip 2026',
    destination: 'Baga & Calangute, Goa',
    startDate: '2026-09-10',
    endDate: '2026-09-14',
    description: 'Annual college gang reunion trip to North Goa beaches',
    budget: 50000,
    currency: 'INR',
    adminParticipantId: 'part_me',
    participants: [
      { id: 'part_me', name: 'Rajesh (Me)', email: 'rajesh@example.com', phone: '+91 98201 12345' },
      { id: 'part_jenisha', name: 'Jenisha', email: 'jenisha@example.com', phone: '+91 98202 23456' },
      { id: 'part_didi', name: 'Didi (Priya)', email: 'priya@example.com', phone: '+91 98203 34567' },
      { id: 'part_rahul', name: 'Rahul', email: 'rahul@example.com', phone: '+91 98204 45678' },
    ],
    createdAt: '2026-08-20T10:00:00Z',
  },
];

export const INITIAL_TRIP_EXPENSES: TripExpense[] = [
  {
    id: 'tripexp_1',
    tripId: 'trip_1',
    title: 'Beach Resort Hotel Booking (3 Nights)',
    amount: 8000,
    date: '2026-09-10',
    category: 'Hotel',
    paidByParticipantId: 'part_me',
    splitMethod: 'equal',
    shares: [
      { participantId: 'part_me', shareAmount: 2000 },
      { participantId: 'part_jenisha', shareAmount: 2000 },
      { participantId: 'part_didi', shareAmount: 2000 },
      { participantId: 'part_rahul', shareAmount: 2000 },
    ],
    paymentMethod: 'UPI',
    notes: 'Taj Holiday Village Villa booking',
    createdAt: '2026-09-10T11:00:00Z',
  },
];

export const INITIAL_TRIP_SETTLEMENTS: TripSettlement[] = [];

// ==========================================
// INITIAL SAMPLE HOUSE / PG DATA (REAListic PG MANAGED BY JENISHA)
// ==========================================

export const INITIAL_HOUSES: House[] = [
  {
    id: 'house_1',
    name: 'ABC Girls PG / Flat 402',
    address: 'Greenwoods CHS, Baner, Pune',
    description: '6 Member Shared PG Apartment Managed by Jenisha',
    startDate: '2026-09-01',
    currency: 'INR',
    monthlyBudget: 34000,
    creatorMemberId: 'mem_jenisha',
    members: [
      { id: 'mem_jenisha', name: 'Jenisha (Manager)', email: 'jenisha@example.com', phone: '+91 98201 11111' },
      { id: 'mem_dhrupi', name: 'Dhrupi', email: 'dhrupi@example.com', phone: '+91 98202 22222' },
      { id: 'mem_pooja', name: 'Pooja', email: 'pooja@example.com', phone: '+91 98203 33333' },
      { id: 'mem_bhumisha', name: 'Bhumisha', email: 'bhumisha@example.com', phone: '+91 98204 44444' },
      { id: 'mem_priya', name: 'Priya', email: 'priya@example.com', phone: '+91 98205 55555' },
      { id: 'mem_me', name: 'Rajesh (Me)', email: 'rajesh@example.com', phone: '+91 98206 66666' },
    ],
    createdAt: '2026-09-01T10:00:00Z',
  },
];

export const INITIAL_HOUSE_EXPENSES: HouseExpense[] = [
  {
    id: 'housedexp_1',
    houseId: 'house_1',
    title: 'Monthly Flat Rent',
    amount: 20000,
    date: '2026-09-01',
    category: 'Rent',
    paidByMemberId: 'mem_jenisha',
    splitMethod: 'equal',
    shares: [
      { memberId: 'mem_jenisha', shareAmount: 3333.33 },
      { memberId: 'mem_dhrupi', shareAmount: 3333.33 },
      { memberId: 'mem_pooja', shareAmount: 3333.33 },
      { memberId: 'mem_bhumisha', shareAmount: 3333.33 },
      { memberId: 'mem_priya', shareAmount: 3333.33 },
      { memberId: 'mem_me', shareAmount: 3333.35 },
    ],
    paymentMethod: 'Bank Transfer',
    financialTreatment: 'Personal Account Payment',
    notes: 'Jenisha paid total rent ₹20,000 from her personal bank account',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'housedexp_2',
    houseId: 'house_1',
    title: 'Electricity & Power Bill',
    amount: 5016, // 6 x 836 = 5016
    date: '2026-09-05',
    category: 'Electricity',
    paidByMemberId: 'mem_jenisha',
    splitMethod: 'equal',
    shares: [
      { memberId: 'mem_jenisha', shareAmount: 836 },
      { memberId: 'mem_dhrupi', shareAmount: 836 },
      { memberId: 'mem_pooja', shareAmount: 836 },
      { memberId: 'mem_bhumisha', shareAmount: 836 },
      { memberId: 'mem_priya', shareAmount: 836 },
      { memberId: 'mem_me', shareAmount: 836 },
    ],
    paymentMethod: 'UPI',
    financialTreatment: 'Personal Account Payment',
    notes: 'Electricity bill paid by Jenisha (₹836 per person share)',
    createdAt: '2026-09-05T11:00:00Z',
  },
];

export const INITIAL_HOUSE_INCOMES: HouseIncome[] = [
  {
    id: 'houseinc_1',
    houseId: 'house_1',
    title: 'Dhrupi Monthly PG Contribution Overpayment',
    amount: 1000,
    date: '2026-09-05',
    receivedByMemberId: 'mem_jenisha',
    paidByMemberId: 'mem_dhrupi',
    category: 'Monthly PG Contribution',
    requiredShare: 836,
    overpaymentAction: 'Save as Advance Credit',
    advanceCreditGenerated: 164,
    description: 'Dhrupi paid ₹1,000 for electricity share of ₹836. Generating ₹164 Advance Credit for Dhrupi.',
    createdAt: '2026-09-05T14:00:00Z',
  },
  {
    id: 'houseinc_2',
    houseId: 'house_1',
    title: 'Pooja Partial Rent Payment',
    amount: 700,
    date: '2026-09-06',
    receivedByMemberId: 'mem_jenisha',
    paidByMemberId: 'mem_pooja',
    category: 'Monthly PG Contribution',
    requiredShare: 836,
    description: 'Pooja paid ₹700 (Required ₹836). Remaining ₹136 marked as Outstanding Due.',
    createdAt: '2026-09-06T16:00:00Z',
  },
];

export const INITIAL_HOUSE_CREDIT_RECORDS: HouseMemberCreditRecord[] = [
  {
    id: 'cred_1',
    houseId: 'house_1',
    memberId: 'mem_dhrupi',
    memberName: 'Dhrupi',
    amount: 164,
    remainingAmount: 164,
    reason: 'September PG Contribution Overpayment',
    date: '2026-09-05',
    status: 'Available',
    createdAt: '2026-09-05T14:00:00Z',
  },
];

export const INITIAL_HOUSE_ADJUSTMENTS: HouseCreditAdjustment[] = [];

export const INITIAL_HOUSE_SETTLEMENTS: HouseSettlement[] = [];

export const INITIAL_RECURRING_HOUSE_EXPENSES: RecurringHouseExpense[] = [
  {
    id: 'rechouse_1',
    houseId: 'house_1',
    title: 'Monthly Flat Rent',
    expectedAmount: 20000,
    category: 'Rent',
    frequency: 'Monthly',
    dueDateDay: 1,
    splitMethod: 'equal',
    isEnabled: true,
  },
  {
    id: 'rechouse_2',
    houseId: 'house_1',
    title: 'Electricity Power Bill',
    expectedAmount: 5000,
    category: 'Electricity',
    frequency: 'Monthly',
    dueDateDay: 5,
    splitMethod: 'equal',
    isEnabled: true,
  },
  {
    id: 'rechouse_3',
    houseId: 'house_1',
    title: 'Groceries & Kitchen Stock',
    expectedAmount: 8000,
    category: 'Groceries',
    frequency: 'Monthly',
    dueDateDay: 10,
    splitMethod: 'equal',
    isEnabled: true,
  },
];
