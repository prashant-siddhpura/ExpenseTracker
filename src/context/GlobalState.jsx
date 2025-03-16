// src/context/GlobalState.js
import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';

const initialState = {
  transactions: JSON.parse(localStorage.getItem('transactions')) || [],
  categories: {
    income: ['Salary', 'Freelance', 'Investment', 'Other'],
    expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'],
  },
  viewMode: 'home', // "home" or "monthly"
  selectedMonth: new Date().getMonth(), // 0-11 (January is 0)
  selectedYear: new Date().getFullYear(), // Current year
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

  function setViewMode(mode) {
    dispatch({
      type: 'SET_VIEW_MODE',
      payload: mode,
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
        viewMode: state.viewMode,
        selectedMonth: state.selectedMonth,
        selectedYear: state.selectedYear,
        deleteTransaction,
        addTransaction,
        setViewMode,
        setSelectedMonth,
        setSelectedYear,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};