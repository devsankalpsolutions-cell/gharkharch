import {
  Liability,
  Expense,
  RecurringFixedExpense,
  PlannedCategoryBudget,
  FinancialSettings,
  SmartRecommendationResult,
  ActualVsPlannedCategory,
  LiabilityPriority,
} from './types';

/**
 * Calculates next salary date and countdown days
 */
export function calculateNextSalaryDate(
  salaryDateDay: number = 5,
  currentDate: Date = new Date(2026, 8, 2) // Default reference Sept 2, 2026
): { nextSalaryDate: Date; formattedDate: string; daysRemaining: number } {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Try current month's salary date first
  let nextDate = new Date(year, month, salaryDateDay);

  // If today is past current month's salary date, move to next month
  if (currentDate.getTime() > nextDate.getTime()) {
    nextDate = new Date(year, month + 1, salaryDateDay);
  }

  const diffTime = nextDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(nextDate);

  return { nextSalaryDate: nextDate, formattedDate, daysRemaining };
}

/**
 * Calculates Actual vs Planned expenses per category
 */
export function calculateActualVsPlanned(
  expenses: Expense[],
  plannedBudgets: PlannedCategoryBudget[],
  selectedMonth: string
): ActualVsPlannedCategory[] {
  const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  const actualMap: Record<string, number> = {};
  monthExpenses.forEach(exp => {
    actualMap[exp.category] = (actualMap[exp.category] || 0) + exp.amount;
  });

  return plannedBudgets.map(budget => {
    const actual = actualMap[budget.category] || 0;
    const remaining = budget.plannedAmount - actual;

    let status: 'Under Plan' | 'On Plan' | 'Over Plan' = 'Under Plan';
    if (actual > budget.plannedAmount) {
      status = 'Over Plan';
    } else if (actual >= budget.plannedAmount * 0.9) {
      status = 'On Plan';
    }

    return {
      category: budget.category,
      plannedAmount: budget.plannedAmount,
      actualAmount: actual,
      remainingAmount: remaining,
      status,
    };
  });
}

/**
 * Smart Liability Repayment Advisor & Strategy Engine
 */
export function calculateSmartLiabilityRecommendation(
  totalAvailable: number,
  remainingFixedExpenses: number,
  remainingPlannedExpenses: number,
  minimumSafetyBalance: number,
  liabilities: Liability[],
  strategy: 'balanced' | 'quick_win' | 'largest_first' = 'balanced'
): SmartRecommendationResult {
  // Formula: Safe Capacity = Total Available - Remaining Fixed - Remaining Planned - Safety Reserve
  const safeLiabilityCapacity = Math.max(
    0,
    totalAvailable - remainingFixedExpenses - remainingPlannedExpenses - minimumSafetyBalance
  );

  // Active pending liabilities
  const pendingLiabilities = liabilities.filter(
    l => l.status === 'Active' || l.status === 'Overdue'
  );

  const totalRemainingLiabilities = pendingLiabilities.reduce(
    (acc, curr) => acc + (curr.totalAmount - curr.paidAmount),
    0
  );

  const totalRecommended = Math.min(safeLiabilityCapacity, totalRemainingLiabilities);

  if (pendingLiabilities.length === 0 || totalRecommended <= 0) {
    return {
      safeLiabilityCapacity,
      totalRecommended: 0,
      explanation:
        safeLiabilityCapacity <= 0
          ? `Your total available money (₹${totalAvailable.toLocaleString('en-IN')}) is required for your remaining monthly expenses (₹${(remainingFixedExpenses + remainingPlannedExpenses).toLocaleString('en-IN')}) and safety reserve (₹${minimumSafetyBalance.toLocaleString('en-IN')}). Recommended liability payment is ₹0 this cycle to ensure safety.`
          : 'You currently have zero active pending liabilities!',
      distributions: [],
    };
  }

  // Copy liabilities for sorting
  let sorted = [...pendingLiabilities];

  if (strategy === 'quick_win') {
    // Smallest remaining principal first
    sorted.sort((a, b) => (a.totalAmount - a.paidAmount) - (b.totalAmount - b.paidAmount));
  } else if (strategy === 'largest_first') {
    // Largest remaining principal first
    sorted.sort((a, b) => (b.totalAmount - b.paidAmount) - (a.totalAmount - a.paidAmount));
  } else {
    // Balanced strategy (default) - prioritize High priority first, then pro-rata
    sorted.sort((a, b) => {
      const pOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
      const pA = pOrder[a.priority || 'Medium'];
      const pB = pOrder[b.priority || 'Medium'];
      return pA - pB;
    });
  }

  let pool = totalRecommended;
  const distributions = sorted.map(lia => {
    const remaining = Math.max(0, lia.totalAmount - lia.paidAmount);
    let rec = 0;

    if (strategy === 'quick_win' || strategy === 'largest_first') {
      rec = Math.min(pool, remaining);
      pool -= rec;
    } else {
      // Balanced pro-rata
      if (totalRemainingLiabilities > 0) {
        const share = (remaining / totalRemainingLiabilities) * totalRecommended;
        rec = Math.min(pool, Math.round(share));
        pool -= rec;
      }
    }

    return {
      liabilityId: lia.id,
      liabilityName: lia.name,
      remainingAmount: remaining,
      recommendedAmount: rec,
      priority: lia.priority || ('Medium' as LiabilityPriority),
    };
  });

  const strategyName =
    strategy === 'quick_win'
      ? 'Quick Win (smallest first)'
      : strategy === 'largest_first'
      ? 'Largest Loan First'
      : 'Balanced Distribution';

  const explanation = `Based on your available balance of ₹${totalAvailable.toLocaleString('en-IN')}, remaining expenses of ₹${(remainingFixedExpenses + remainingPlannedExpenses).toLocaleString('en-IN')}, and safety reserve of ₹${minimumSafetyBalance.toLocaleString('en-IN')}, you can safely allocate up to ₹${totalRecommended.toLocaleString('en-IN')} toward liabilities using the ${strategyName} strategy.`;

  return {
    safeLiabilityCapacity,
    totalRecommended,
    explanation,
    distributions,
  };
}

/**
 * Money Health Score & Reason generator
 */
export function calculateMoneyHealthScore(
  totalAvailable: number,
  minimumSafetyBalance: number,
  remainingFixedExpenses: number,
  overBudgetCategoriesCount: number
): { score: 'Good' | 'Needs Attention' | 'Critical'; reason: string } {
  if (totalAvailable < minimumSafetyBalance) {
    return {
      score: 'Critical',
      reason: `Your available money (₹${totalAvailable.toLocaleString('en-IN')}) is below your minimum safety reserve (₹${minimumSafetyBalance.toLocaleString('en-IN')}). Avoid optional spending.`,
    };
  }

  if (totalAvailable < remainingFixedExpenses + minimumSafetyBalance || overBudgetCategoriesCount > 2) {
    return {
      score: 'Needs Attention',
      reason: `You have ₹${remainingFixedExpenses.toLocaleString('en-IN')} in remaining fixed bills due this month. Monitor spending closely.`,
    };
  }

  return {
    score: 'Good',
    reason: `Your liquidity is healthy with your ₹${minimumSafetyBalance.toLocaleString('en-IN')} emergency reserve protected and expenses covered.`,
  };
}
