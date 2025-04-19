// src/components/Transaction.js
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Transaction = ({ transaction }) => {
  const { deleteTransaction ,userSettings } = useContext(GlobalContext);

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };

  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);
  return (
    <li className={transaction.type === 'expense' ? 'minus' : 'plus'}>
      <div className="flex-1">
        <span className="font-medium">{transaction.text}</span>
        <span className="text-sm text-gray-500 ml-2">({transaction.category})</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-gray-700 font-medium">
        {currencySymbol}{Math.abs(transaction.amount).toFixed(2)}
        </span>
        <button
          onClick={() => deleteTransaction(transaction.id)}
          className="delete-btn"
        >
          x
        </button>
      </div>
    </li>
  );
};