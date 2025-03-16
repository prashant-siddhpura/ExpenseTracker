// src/components/MonthlyReport.js
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Transaction } from './Transaction';

export const MonthlyReport = () => {
  const {
    transactions,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  } = useContext(GlobalContext);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === selectedMonth &&
      transactionDate.getFullYear() === selectedYear
    );
  });

  const income = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  const expense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  const balance = (parseFloat(income) - parseFloat(expense)).toFixed(2);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="month" className="block mb-1 font-medium">
              Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border rounded p-2"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block mb-1 font-medium">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border rounded p-2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h4>Monthly Balance</h4>
        <h1 className="text-4xl font-semibold text-gray-800">${balance}</h1>
      </div>

      <div className="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p className="money plus">${income}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p className="money minus">${expense}</p>
        </div>
      </div>

      <h3>Transactions for {months[selectedMonth]} {selectedYear}</h3>
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 italic">
          No transactions for this month.
        </p>
      ) : (
        <ul className="list">
          {filteredTransactions.map((transaction) => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}
    </>
  );
};