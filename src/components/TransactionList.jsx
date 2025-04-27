import React, { useState, useMemo } from 'react';
import { Trash2, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const TransactionList = ({ transactions, categories, deleteTransaction, filterTransactions }) => {
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  
  // Apply filters
  const filteredTransactions = useMemo(() => {
    return filterTransactions(
      filters.category,
      {
        startDate: filters.startDate,
        endDate: filters.endDate
      }
    );
  }, [filterTransactions, filters]);
  
  // Apply sorting
  const sortedTransactions = useMemo(() => {
    const { key, direction } = sortConfig;
    return [...filteredTransactions].sort((a, b) => {
      if (key === 'amount') {
        return direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (key === 'date') {
        return direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else {
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
  }, [filteredTransactions, sortConfig]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: ''
    });
  };
  
  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <span className="text-sm text-gray-500">{sortedTransactions.length} transactions</span>
      </div>
      
      {/* Filters */}
      <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-500" />
          <h3 className="font-medium">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category-filter"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} className="inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} className="inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
        </div>
        
        {(filters.category || filters.startDate || filters.endDate) && (
          <button 
            onClick={clearFilters}
            className="mt-3 text-sm text-primary-600 hover:text-primary-800"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      {/* Transaction table */}
      <div className="overflow-x-auto">
        {sortedTransactions.length > 0 ? (
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {format(parseISO(transaction.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {transaction.description || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-danger-500 hover:text-danger-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions found. 
            {(filters.category || filters.startDate || filters.endDate) && (
              <span> Try adjusting your filters.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;