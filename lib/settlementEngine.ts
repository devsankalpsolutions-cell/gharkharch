import {
  TripExpense,
  TripSettlement,
  TripParticipant,
  ParticipantTripBalance,
  MinimalSettlementInstruction,
  TripSplitMethod,
  HouseExpense,
  HouseIncome,
  HouseSettlement,
  HouseMember,
  HouseMemberCreditRecord,
  HouseCreditAdjustment,
  HouseMemberLedgerEntry,
} from './types';

/**
 * Calculates exact share distribution for an expense given a split method
 */
export function calculateSplitShares(
  totalAmount: number,
  splitMethod: TripSplitMethod,
  personIds: string[],
  customInputs?: {
    percentages?: Record<string, number>;
    exactAmounts?: Record<string, number>;
    sharesCounts?: Record<string, number>;
  }
): { participantId: string; shareAmount: number }[] {
  if (personIds.length === 0 || totalAmount <= 0) return [];

  const count = personIds.length;

  if (splitMethod === 'equal' || splitMethod === 'selected') {
    const baseShare = Math.floor((totalAmount / count) * 100) / 100;
    const remainder = Math.round((totalAmount - baseShare * count) * 100) / 100;

    return personIds.map((id, index) => ({
      participantId: id,
      shareAmount: index === 0 ? Math.round((baseShare + remainder) * 100) / 100 : baseShare,
    }));
  }

  if (splitMethod === 'percentage' && customInputs?.percentages) {
    let totalAssigned = 0;
    const shares = personIds.map((id, index) => {
      const pct = customInputs.percentages?.[id] || 0;
      let share = Math.round(((totalAmount * pct) / 100) * 100) / 100;
      if (index === count - 1) {
        share = Math.round((totalAmount - totalAssigned) * 100) / 100;
      }
      totalAssigned += share;
      return { participantId: id, shareAmount: Math.max(0, share) };
    });
    return shares;
  }

  if (splitMethod === 'exact' && customInputs?.exactAmounts) {
    return personIds.map(id => ({
      participantId: id,
      shareAmount: customInputs.exactAmounts?.[id] || 0,
    }));
  }

  if (splitMethod === 'shares' && customInputs?.sharesCounts) {
    const totalSharesCount = personIds.reduce(
      (acc, id) => acc + (customInputs.sharesCounts?.[id] || 1),
      0
    );

    if (totalSharesCount <= 0) return personIds.map(id => ({ participantId: id, shareAmount: 0 }));

    let totalAssigned = 0;
    return personIds.map((id, index) => {
      const sCount = customInputs.sharesCounts?.[id] || 1;
      let share = Math.round(((totalAmount * sCount) / totalSharesCount) * 100) / 100;
      if (index === count - 1) {
        share = Math.round((totalAmount - totalAssigned) * 100) / 100;
      }
      totalAssigned += share;
      return { participantId: id, shareAmount: Math.max(0, share) };
    });
  }

  const base = Math.round((totalAmount / count) * 100) / 100;
  return personIds.map(id => ({ participantId: id, shareAmount: base }));
}

/**
 * Computes net balances for all trip participants (Splitwise-style)
 */
export function calculateTripParticipantBalances(
  participants: TripParticipant[],
  expenses: TripExpense[],
  settlements: TripSettlement[]
): ParticipantTripBalance[] {
  const map: Record<
    string,
    { name: string; totalPaid: number; totalShare: number; netBalance: number }
  > = {};

  participants.forEach(p => {
    map[p.id] = { name: p.name, totalPaid: 0, totalShare: 0, netBalance: 0 };
  });

  expenses.forEach(exp => {
    if (map[exp.paidByParticipantId]) {
      map[exp.paidByParticipantId].totalPaid += exp.amount;
    }

    exp.shares.forEach(sh => {
      if (map[sh.participantId]) {
        map[sh.participantId].totalShare += sh.shareAmount;
      }
    });
  });

  Object.keys(map).forEach(id => {
    map[id].netBalance = map[id].totalPaid - map[id].totalShare;
  });

  settlements.forEach(st => {
    if (st.status === 'Completed') {
      if (map[st.fromParticipantId]) {
        map[st.fromParticipantId].netBalance += st.amount;
      }
      if (map[st.toParticipantId]) {
        map[st.toParticipantId].netBalance -= st.amount;
      }
    }
  });

  return Object.entries(map).map(([id, data]) => ({
    participantId: id,
    participantName: data.name,
    totalPaid: data.totalPaid,
    totalShare: data.totalShare,
    netBalance: Math.round(data.netBalance * 100) / 100,
  }));
}

/**
 * ENHANCED HOUSE LEDGER & ADVANCE CREDIT SYSTEM
 * Calculates comprehensive ledger entries for house members:
 * - Current Share
 * - Total Paid
 * - Credits Applied
 * - Outstanding Amount
 * - Advance Credit (Belongs ONLY to the member who overpaid)
 * - Net Position (For house manager / reimbursement tracking)
 */
export function calculateHouseMemberLedgers(
  members: HouseMember[],
  expenses: HouseExpense[],
  incomes: HouseIncome[],
  settlements: HouseSettlement[],
  creditRecords: HouseMemberCreditRecord[] = [],
  adjustments: HouseCreditAdjustment[] = []
): HouseMemberLedgerEntry[] {
  const map: Record<
    string,
    {
      name: string;
      currentShare: number;
      totalPaid: number;
      creditsApplied: number;
      advanceCredit: number;
    }
  > = {};

  members.forEach(m => {
    map[m.id] = {
      name: m.name,
      currentShare: 0,
      totalPaid: 0,
      creditsApplied: 0,
      advanceCredit: 0,
    };
  });

  // 1. Calculate Consumption Share & Expenses Paid
  expenses.forEach(exp => {
    // Expense paid by member
    if (map[exp.paidByMemberId]) {
      map[exp.paidByMemberId].totalPaid += exp.amount;
    }

    // Shares allocated to members
    exp.shares.forEach(sh => {
      if (map[sh.memberId]) {
        map[sh.memberId].currentShare += sh.shareAmount;
      }
    });

    // Track applied credits
    if (exp.appliedCredits) {
      exp.appliedCredits.forEach(ac => {
        if (map[ac.memberId]) {
          map[ac.memberId].creditsApplied += ac.amount;
        }
      });
    }
  });

  // 2. Track House Income Contributions Paid by Members
  incomes.forEach(inc => {
    const payerId = inc.paidByMemberId || inc.receivedByMemberId;
    if (map[payerId]) {
      map[payerId].totalPaid += inc.amount;
    }
  });

  // 3. Track Settlements (repayments) between members
  settlements.forEach(st => {
    if (st.status === 'Completed') {
      if (map[st.fromMemberId]) {
        map[st.fromMemberId].totalPaid += st.amount;
      }
      if (map[st.toMemberId]) {
        map[st.toMemberId].totalPaid -= st.amount;
      }
    }
  });

  // 4. Calculate Available Advance Credit per member
  creditRecords.forEach(cr => {
    if (map[cr.memberId] && cr.status === 'Available') {
      map[cr.memberId].advanceCredit += cr.remainingAmount;
    }
  });

  // Adjustments (Credit / Refund / Adjustment)
  adjustments.forEach(adj => {
    if (map[adj.memberId]) {
      if (adj.type === 'Credit') {
        map[adj.memberId].advanceCredit += adj.amount;
      } else if (adj.type === 'Refund') {
        map[adj.memberId].advanceCredit = Math.max(0, map[adj.memberId].advanceCredit - adj.amount);
      }
    }
  });

  // Build Final Ledger Entries
  return members.map(m => {
    const data = map[m.id] || {
      name: m.name,
      currentShare: 0,
      totalPaid: 0,
      creditsApplied: 0,
      advanceCredit: 0,
    };

    const roundedShare = Math.round(data.currentShare * 100) / 100;
    const roundedPaid = Math.round(data.totalPaid * 100) / 100;
    const roundedApplied = Math.round(data.creditsApplied * 100) / 100;
    const roundedCredit = Math.round(data.advanceCredit * 100) / 100;

    // Calculate Outstanding (Underpayment)
    const totalEffectivePayment = roundedPaid + roundedApplied;
    let outstandingAmount = 0;

    if (totalEffectivePayment < roundedShare) {
      outstandingAmount = Math.round((roundedShare - totalEffectivePayment) * 100) / 100;
    }

    // Auto-detect Overpayment credit if not recorded as credit record yet
    let finalAdvanceCredit = roundedCredit;
    if (totalEffectivePayment > roundedShare && finalAdvanceCredit === 0) {
      finalAdvanceCredit = Math.round((totalEffectivePayment - roundedShare) * 100) / 100;
    }

    // Net Position: Positive = to receive (manager out-of-pocket), Negative = owes
    const netPosition = Math.round((roundedPaid - roundedShare) * 100) / 100;

    let status: 'Credit Available' | 'Due' | 'Settled' = 'Settled';
    let statusLabel = 'Settled';

    if (finalAdvanceCredit > 0) {
      status = 'Credit Available';
      statusLabel = `₹${finalAdvanceCredit.toLocaleString('en-IN')} Advance Credit`;
    } else if (outstandingAmount > 0) {
      status = 'Due';
      statusLabel = `₹${outstandingAmount.toLocaleString('en-IN')} Due`;
    }

    return {
      memberId: m.id,
      memberName: m.name,
      currentShare: roundedShare,
      totalPaid: roundedPaid,
      creditsApplied: roundedApplied,
      outstandingAmount,
      advanceCredit: finalAdvanceCredit,
      netPosition,
      status,
      statusLabel,
    };
  });
}

/**
 * Splitwise-Style Minimal Debt Settlement Engine
 * Minimizes total transaction count using greedy matching
 */
export function minimizeDebtSettlements(
  balances: { participantId: string; participantName: string; netBalance: number }[]
): MinimalSettlementInstruction[] {
  const debtors = balances
    .filter(b => b.netBalance < -0.01)
    .map(b => ({ ...b, amountOwed: Math.abs(b.netBalance) }))
    .sort((a, b) => b.amountOwed - a.amountOwed);

  const creditors = balances
    .filter(b => b.netBalance > 0.01)
    .map(b => ({ ...b, amountToReceive: b.netBalance }))
    .sort((a, b) => b.amountToReceive - a.amountToReceive);

  const instructions: MinimalSettlementInstruction[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settlementAmount = Math.min(debtor.amountOwed, creditor.amountToReceive);
    const roundedAmount = Math.round(settlementAmount * 100) / 100;

    if (roundedAmount > 0) {
      instructions.push({
        fromParticipantId: debtor.participantId,
        fromParticipantName: debtor.participantName,
        toParticipantId: creditor.participantId,
        toParticipantName: creditor.participantName,
        amount: roundedAmount,
      });
    }

    debtor.amountOwed -= settlementAmount;
    creditor.amountToReceive -= settlementAmount;

    if (debtor.amountOwed < 0.01) i++;
    if (creditor.amountToReceive < 0.01) j++;
  }

  return instructions;
}
