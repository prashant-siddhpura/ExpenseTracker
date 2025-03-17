// src/components/Home.js
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Header } from './Header';
import { Balance } from './Balance';
import { IncomeExpenses } from './IncomeExpenses';

export const Home = () => {
  const { transactions } = useContext(GlobalContext);
  const totalTransactions = transactions.length;

  return (
    <div className="content-wrapper">
      <Header />
      <div className="container">
        <Balance />
        <IncomeExpenses />
        <div className="text-center">
          <h4>Total Transactions</h4>
          <p className="text-2xl font-semibold">{totalTransactions}</p>
        </div>
      </div>
    </div>
  );
};