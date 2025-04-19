import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const BudgetManagement = () => {
  const { categories, budgets, setBudget,deleteBudget, selectedMonth, selectedYear , userSettings} = useContext(GlobalContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory && budgetAmount) {
      setBudget(selectedCategory, parseFloat(budgetAmount), selectedMonth, selectedYear); // Convert to float
      setBudgetAmount('');
      setSelectedCategory('');
    }
  };

  const handleDelete = (id) => {
    deleteBudget(id);
  };

  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

  const currentBudgets = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );

  return (
    <div className="content-wrapper">
    <div className="container">
      <div className="budget-management-container">
        <h3>Set Budget for {months[selectedMonth]} {selectedYear}</h3>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.expense.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budgetAmount">Budget Amount</label>
            <input
              type="number"
              id="budgetAmount"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="Enter budget amount..."
              step="0.01"
              required
            />
          </div>
          <button className="btn" type="submit">
            Set Budget
          </button>
        </form>

        <h3 className="mt-6">Current Budgets for {months[selectedMonth]} {selectedYear}</h3>
        {currentBudgets.length === 0 ? (
          <p className="text-gray-500 italic">No budgets set yet.</p>
        ) : (
          <ul className="list">
            {currentBudgets.map((budget) => (
              <li key={budget.id} className="budget-item">
                <span>{budget.category}</span>
                <div className="flex items-center space-x-3">
                  <span>{currencySymbol}{budget.amount.toFixed(2)}</span>
                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="delete-btn"
                  >
                    x
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
  );
};