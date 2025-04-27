import { useState, useEffect, useMemo, useCallback } from 'react';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load transactions from localStorage on initial render
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        // Set sample data if no transactions exist
        const sampleData = [
          { id: '1', amount: 120.50, category: 'Food', description: 'Grocery shopping', date: '2024-04-01' },
          { id: '2', amount: 42.99, category: 'Entertainment', description: 'Movie tickets', date: '2024-04-03' },
          { id: '3', amount: 500, category: 'Housing', description: 'Rent payment', date: '2024-04-05' },
          { id: '4', amount: 60, category: 'Transportation', description: 'Gas', date: '2024-04-08' },
          { id: '5', amount: 25.99, category: 'Food', description: 'Dinner', date: '2024-04-10' },
        ];
        setTransactions(sampleData);
        localStorage.setItem('transactions', JSON.stringify(sampleData));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  // Add a new transaction
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  }, []);

  // Delete a transaction
  const deleteTransaction = useCallback((id) => {
    setTransactions(prevTransactions => 
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  }, []);

  // Get total spending
  const totalSpending = useMemo(() => {
    return transactions.reduce((total, transaction) => total + Number(transaction.amount), 0);
  }, [transactions]);

  // Get spending by category
  const spendingByCategory = useMemo(() => {
    const categoryMap = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category;
      const amount = Number(transaction.amount);
      
      if (categoryMap[category]) {
        categoryMap[category] += amount;
      } else {
        categoryMap[category] = amount;
      }
    });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [transactions]);

  // Get spending over time (by date)
  const spendingOverTime = useMemo(() => {
    const dateMap = {};
    
    transactions.forEach(transaction => {
      const date = transaction.date;
      const amount = Number(transaction.amount);
      
      if (dateMap[date]) {
        dateMap[date] += amount;
      } else {
        dateMap[date] = amount;
      }
    });
    
    return Object.entries(dateMap)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Filter transactions by category and date range
  const filterTransactions = useCallback((category, dateRange) => {
    return transactions.filter(transaction => {
      const categoryMatch = !category || transaction.category === category;
      const dateMatch = !dateRange.startDate || !dateRange.endDate || 
        (transaction.date >= dateRange.startDate && transaction.date <= dateRange.endDate);
      
      return categoryMatch && dateMatch;
    });
  }, [transactions]);

  // Get all unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(transactions.map(t => t.category));
    return Array.from(uniqueCategories);
  }, [transactions]);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    totalSpending,
    spendingByCategory,
    spendingOverTime,
    filterTransactions,
    categories,
  };
};

export default useTransactions;