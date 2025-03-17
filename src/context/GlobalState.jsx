// src/context/GlobalState.js
import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';

const initialState = {
  transactions: JSON.parse(localStorage.getItem('transactions')) || [],
  categories: {
    income: ['Salary', 'Freelance', 'Investment', 'Other'],
    expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'],
  },
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  function deleteTransaction(id) {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id,
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: transaction,
    });
  }

  function setSelectedMonth(month) {
    dispatch({
      type: 'SET_SELECTED_MONTH',
      payload: month,
    });
  }

  function setSelectedYear(year) {
    dispatch({
      type: 'SET_SELECTED_YEAR',
      payload: year,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        categories: state.categories,
        selectedMonth: state.selectedMonth,
        selectedYear: state.selectedYear,
        deleteTransaction,
        addTransaction,
        setSelectedMonth,
        setSelectedYear,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};