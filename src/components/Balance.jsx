// src/components/Balance.js
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Balance = () => {
  const { transactions,userSettings } = useContext(GlobalContext);

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };

  // Calculate income
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  // Calculate expenses
  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  // Balance is income minus expenses
  const total = (income - expenses).toFixed(2);
  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

  return (
    <div className="text-center">
      <h4>Your Balance</h4>
      <h1 className="text-4xl font-semibold dark:text-white balance-total">
      {currencySymbol}{total}
      </h1>
    </div>
  );
};