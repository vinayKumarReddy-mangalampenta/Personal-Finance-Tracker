import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Dashboard = ({ transactions, totalSpending }) => {
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);
  
  // Calculate monthly spending
  const monthlySpending = useMemo(() => {
    return transactions
      .filter(transaction => {
        const transactionDate = parseISO(transaction.date);
        return isWithinInterval(transactionDate, { 
          start: firstDayOfMonth, 
          end: lastDayOfMonth 
        });
      })
      .reduce((total, transaction) => total + Number(transaction.amount), 0);
  }, [transactions, firstDayOfMonth, lastDayOfMonth]);
  
  // Calculate average transaction amount
  const averageAmount = useMemo(() => {
    if (transactions.length === 0) return 0;
    return totalSpending / transactions.length;
  }, [transactions, totalSpending]);
  
  // Get largest expense
  const largestExpense = useMemo(() => {
    if (transactions.length === 0) return null;
    return transactions.reduce((max, transaction) => 
      Number(transaction.amount) > Number(max.amount) ? transaction : max
    );
  }, [transactions]);
  
  // Get most frequent category
  const mostFrequentCategory = useMemo(() => {
    if (transactions.length === 0) return null;
    
    const categoryCounts = {};
    transactions.forEach(transaction => {
      const category = transaction.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    let maxCategory = null;
    let maxCount = 0;
    
    for (const category in categoryCounts) {
      if (categoryCounts[category] > maxCount) {
        maxCount = categoryCounts[category];
        maxCategory = category;
      }
    }
    
    return { name: maxCategory, count: maxCount };
  }, [transactions]);
  
  const monthName = format(today, 'MMMM yyyy');
  
  return (
    <div className="card animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Monthly Spending */}
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium">{monthName} Spending</p>
              <p className="text-2xl font-bold text-primary-900">${monthlySpending.toFixed(2)}</p>
            </div>
            <div className="bg-primary-100 p-2 rounded-full">
              <DollarSign size={20} className="text-primary-700" />
            </div>
          </div>
        </div>
        
        {/* Total Spending */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Total Spending</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpending.toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">
              <DollarSign size={20} className="text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Average Transaction */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Avg. Transaction</p>
              <p className="text-2xl font-bold text-gray-900">${averageAmount.toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">
              <TrendingUp size={20} className="text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Most Common Category */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Top Category</p>
              <p className="text-2xl font-bold text-gray-900">
                {mostFrequentCategory ? mostFrequentCategory.name : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">
              <PieChart size={20} className="text-gray-700" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Largest Expense */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Largest Expense</h3>
          {largestExpense ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-semibold text-gray-900">
                  ${largestExpense.amount.toFixed(2)}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                  {largestExpense.category}
                </span>
              </div>
              <p className="text-sm text-gray-600">{largestExpense.description || 'No description'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(parseISO(largestExpense.date), 'MMMM d, yyyy')}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No transactions recorded</p>
          )}
        </div>
        
        {/* Recent Activity Summary */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="font-medium">${monthlySpending.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Top Category</span>
              <span className="font-medium">
                {mostFrequentCategory ? mostFrequentCategory.name : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Transactions</span>
              <span className="font-medium">{transactions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;