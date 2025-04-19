import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const IncomeExpenses = () => {
  const { transactions, userSettings } = useContext(GlobalContext);

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0)
    .toFixed(2);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0)
    .toFixed(2);

  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

  return (
    <div className="inc-exp-container">
      <div>
        <h4>Income</h4>
        <p className="money plus">{currencySymbol}{income}</p>
      </div>
      <div>
        <h4>Expense</h4>
        <p className="money minus">{currencySymbol}{expense}</p>
      </div>
    </div>
  );
};