import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Housing',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Personal',
  'Education',
  'Shopping',
  'Other'
];

const TransactionForm = ({ addTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.amount || !formData.category || !formData.date) {
      setError('Please fill out all required fields');
      return;
    }
    
    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Add transaction
    addTransaction({
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Reset form
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
      
      {showSuccess && (
        <div className="bg-success-500 text-white p-2 rounded-md mb-4 animate-slide-up">
          Transaction added successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-danger-500 text-white p-2 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($) <span className="text-danger-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="input"
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-danger-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            placeholder="What was this expense for?"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-danger-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input"
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
          <PlusCircle size={18} />
          <span>Add Transaction</span>
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;