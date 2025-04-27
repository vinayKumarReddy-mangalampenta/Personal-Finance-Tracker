import React from 'react';
import { Wallet } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import Charts from './components/Charts';
import useTransactions from './hooks/useTransactions';

function App() {
  const {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    totalSpending,
    spendingByCategory,
    spendingOverTime,
    filterTransactions,
    categories,
  } = useTransactions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-700">Loading your financial data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Wallet size={24} className="mr-2" />
            <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm addTransaction={addTransaction} />
          </div>

          {/* Right Column - Dashboard & Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Dashboard 
              transactions={transactions} 
              totalSpending={totalSpending} 
            />
            
            <Charts 
              spendingByCategory={spendingByCategory} 
              spendingOverTime={spendingOverTime} 
            />
          </div>
        </div>

        {/* Transaction List */}
        <div className="mt-8">
          <TransactionList 
            transactions={transactions}
            categories={categories}
            deleteTransaction={deleteTransaction}
            filterTransactions={filterTransactions}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Personal Finance Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;