'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, formatMonthYear } from '@/lib/formatters';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const DONUT_COLORS = [
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#64748B', // Slate
];

export const FinancialCharts: React.FC = () => {
  const { incomes, expenses, liabilities, selectedMonth, metrics } = useFinance();
  const { user } = useAuth();
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // 1. Expense Category Breakdown
  const monthExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categoryPieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const totalExpenseVal = categoryPieData.reduce((a, b) => a + b.value, 0);

  // Calculate Pie Slices (SVG SVG Donut)
  let cumulativeAngle = 0;
  const pieSlices = categoryPieData.map((item, index) => {
    const percentage = totalExpenseVal > 0 ? item.value / totalExpenseVal : 0;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // SVG Arc coordinates
    const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180);
    const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData =
      angle >= 360
        ? 'M 50, 10 A 40,40 0 1 1 49.99,10 Z'
        : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      ...item,
      percentage: (percentage * 100).toFixed(1),
      color: DONUT_COLORS[index % DONUT_COLORS.length],
      pathData,
    };
  });

  // 2. Multi-month Financial Comparison Bar Data
  const monthsList = ['2026-01', '2026-02', '2026-03', '2026-04'];
  const trendData = monthsList.map(mKey => {
    const inc = incomes.filter(i => i.date.startsWith(mKey)).reduce((acc, c) => acc + c.amount, 0);
    const exp = expenses.filter(e => e.date.startsWith(mKey)).reduce((acc, c) => acc + c.amount, 0);

    let emi = 0;
    liabilities.forEach(l => {
      l.payments?.forEach(p => {
        if (p.date.startsWith(mKey)) emi += p.amount;
      });
    });

    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      new Date(parseInt(mKey.split('-')[0]), parseInt(mKey.split('-')[1]) - 1, 1)
    );

    return {
      key: mKey,
      month: monthName,
      Income: inc,
      Expenses: exp,
      EMIs: emi,
      isSelected: mKey === selectedMonth,
    };
  });

  const maxVal = Math.max(
    ...trendData.flatMap(d => [d.Income, d.Expenses, d.EMIs]),
    150000
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Visual Chart 1: Income vs Expense vs EMI Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Financial Overview</span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Inflow vs Outflow Comparison
              </h4>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Q1 2026
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 pt-6 flex items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {trendData.map(d => {
              const incHeight = (d.Income / maxVal) * 100;
              const expHeight = (d.Expenses / maxVal) * 100;
              const emiHeight = (d.EMIs / maxVal) * 100;

              return (
                <div
                  key={d.key}
                  className={`flex-1 flex flex-col items-center gap-2 h-full justify-end group ${
                    d.isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-full flex items-end justify-center gap-1 h-full px-1">
                    {/* Income Bar */}
                    <div
                      className="w-1/3 bg-emerald-500 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-400 relative"
                      style={{ height: `${Math.max(4, incHeight)}%` }}
                      title={`Income: ${formatCurrency(d.Income, currency, formatStyle)}`}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-1/3 bg-rose-500 rounded-t-lg transition-all duration-500 group-hover:bg-rose-400 relative"
                      style={{ height: `${Math.max(4, expHeight)}%` }}
                      title={`Expense: ${formatCurrency(d.Expenses, currency, formatStyle)}`}
                    />
                    {/* EMI Bar */}
                    <div
                      className="w-1/3 bg-amber-500 rounded-t-lg transition-all duration-500 group-hover:bg-amber-400 relative"
                      style={{ height: `${Math.max(4, emiHeight)}%` }}
                      title={`EMIs: ${formatCurrency(d.EMIs, currency, formatStyle)}`}
                    />
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      d.isSelected
                        ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-4'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-rose-500" />
            <span className="text-slate-700 dark:text-slate-300">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-amber-500" />
            <span className="text-slate-700 dark:text-slate-300">EMI Payments</span>
          </div>
        </div>
      </div>

      {/* Visual Chart 2: Category Expense Breakdown Donut */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
                <PieIcon className="w-4 h-4" />
                <span>Spending Distribution</span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Expense Categories ({formatMonthYear(selectedMonth)})
              </h4>
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
              {formatCurrency(totalExpenseVal, currency, formatStyle)}
            </span>
          </div>

          {pieSlices.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No expenses logged for {formatMonthYear(selectedMonth)}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              {/* Interactive SVG Donut */}
              <div className="relative w-44 h-44 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {pieSlices.map((slice, i) => (
                    <path
                      key={slice.name}
                      d={slice.pathData}
                      fill={slice.color}
                      onMouseEnter={() => setHoveredSlice(i)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                    />
                  ))}
                  {/* Inner Cutout Hole */}
                  <circle cx="50" cy="50" r="26" fill="currentColor" className="text-white dark:text-slate-900" />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {hoveredSlice !== null ? pieSlices[hoveredSlice]?.name : 'Total'}
                  </span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {hoveredSlice !== null
                      ? `${pieSlices[hoveredSlice]?.percentage}%`
                      : formatCurrency(totalExpenseVal, currency, formatStyle)}
                  </span>
                </div>
              </div>

              {/* Category Legend list */}
              <div className="flex-1 space-y-2 max-h-48 overflow-y-auto w-full pr-1">
                {pieSlices.map((slice, idx) => (
                  <div
                    key={slice.name}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center justify-between text-xs p-1.5 rounded-xl cursor-pointer transition-colors ${
                      hoveredSlice === idx ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {slice.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(slice.value, currency, formatStyle)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">({slice.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
