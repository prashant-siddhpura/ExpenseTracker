// src/components/TransactionList.js
import React, { useContext } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';
import { Header } from './Header';

export const TransactionList = () => {
  const { transactions } = useContext(GlobalContext);

  return (
    <div className="content-wrapper">
      <Header />
      <div className="container">
        <h3 style={{marginTop: "20px"}}>History</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 italic">No transactions yet.</p>
        ) : (
          <ul className="list">
            {transactions.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};