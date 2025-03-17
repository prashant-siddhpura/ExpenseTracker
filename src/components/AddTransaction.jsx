// src/components/AddTransaction.js
import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Header } from './Header';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');

  const { addTransaction, categories } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    };

    console.log('Adding transaction:', newTransaction);
    addTransaction(newTransaction);
    setText('');
    setAmount('');
    setCategory('');
  };

  return (
    <div className="content-wrapper">
      <Header />
      <div className="container">
        <div className="add-transaction-container">
          <h3>Add New Transaction</h3>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="text">Description</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter description..."
                required
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {(type === 'income' ? categories.income : categories.expense).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button className="btn">Add Transaction</button>
          </form>
        </div>
      </div>
    </div>
  );
};