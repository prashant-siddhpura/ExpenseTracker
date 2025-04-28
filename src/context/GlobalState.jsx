import React, { createContext, useReducer, useEffect,useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { getIdToken } from "firebase/auth";
import AppReducer from "./AppReducer";

const initialState = {
  transactions: [],
  categories: {
    income: [
      "Salary",
      "Freelance",
      "Investment",
      "Other",
      "Bonus",
      "Gifts",
      "Rental Income",
      "Side Hustle",
      "Dividends",
      "Refunds",
    ],
    expense: [
      "Food",
      "Transport",
      "Entertainment",
      "Bills",
      "Shopping",
      "Other",
      "Rent",
      "Utilities",
      "Insurance",
      "Healthcare",
      "Education",
      "Travel",
      "Subscriptions",
      "Debt Repayment",
      "Charity",
    ],
  },
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  budgets: [],
  userSettings: {
    display_name: null,
    photo_url: null,
    preferred_currency: "INR",
    dark_mode: false,
  },
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Apply dark mode on state change
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      state.userSettings.dark_mode
    );
  }, [state.userSettings.dark_mode]);


// Fetch data on mount and when user changes
useEffect(() => {
  const fetchAllData = async () => {
    setIsLoading(true);
    if (auth.currentUser) {
      
      try {
        const token = await getIdToken(auth.currentUser);
        // Fetch transactions
        const transactionsResponse = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsResponse.data || [] });

      //  fetch budget
        const budgetsResponse = await axios.get('http://localhost:5000/api/budgets', {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: state.selectedMonth, year: state.selectedYear },
        });
        
        dispatch({ type: 'SET_BUDGETS', payload: budgetsResponse.data || [] });

        //  fetch user settings
        const settingsResponse = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        dispatch({ type: 'SET_USER_SETTINGS', payload: settingsResponse.data });
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
        dispatch({ type: 'SET_BUDGETS', payload: [] });
        dispatch({ type: 'SET_USER_SETTINGS', payload: initialState.userSettings });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No authenticated user, skipping fetch.');
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      dispatch({ type: 'SET_BUDGETS', payload: [] });
      setIsLoading(false);
    }
  };
  
  fetchAllData(); // Run on mount
  const unsubscribe = auth.onAuthStateChanged((user) => {
    
    if (user) fetchAllData();
    else {
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      dispatch({ type: 'SET_BUDGETS', payload: [] });
      setIsLoading(false);
    }
  });
  return () => unsubscribe();
}, [state.selectedMonth, state.selectedYear]); // Re-fetch when month or year changes

if (isLoading) {
  return <div className="content-wrapper"><div className="container"><p>Loading...</p></div></div>;
}


async function addTransaction(transaction) {
  try {
    const token = await getIdToken(auth.currentUser);
    const response = await axios.post(
      "http://localhost:5000/api/transactions",
      {
        ...transaction,
        date: new Date().toISOString(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "ADD_TRANSACTION", payload: response.data });
  } catch (err) {
    console.error("Error adding transaction:", err);
  }
}

async function bulkAddTransactions(transactions) {
  try {
    const token = await getIdToken(auth.currentUser);
    const response = await axios.post(
      "http://localhost:5000/api/transactions/bulk",
      { transactions },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    response.data.forEach(transaction => {
      dispatch({ type: "ADD_TRANSACTION", payload: transaction });
    });
  } catch (err) {
    console.error("Error adding bulk transactions:", err);
    throw err;
  }
}


async function deleteTransaction(id) {
  const token = await getIdToken(auth.currentUser);
  await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch({ type: "DELETE_TRANSACTION", payload: id });
}




  async function deleteBudget(id) {
    try {
      const token = await getIdToken(auth.currentUser);
      await axios.delete(`http://localhost:5000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "DELETE_BUDGET", payload: id });
    } catch (err) {
      console.error(
        "Error deleting budget:",
        err.response ? err.response.data : err.message
      );
    }
  }



  async function setBudget(category, amount, month, year) {
    try {
      const token = await getIdToken(auth.currentUser);
      const response = await axios.post(
        "http://localhost:5000/api/budgets",
        { category, amount, month, year },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "ADD_BUDGET", payload: response.data });
      // Re-fetch budgets for the current month/year
      const fetchResponse = await axios.get(
        "http://localhost:5000/api/budgets",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: state.selectedMonth, year: state.selectedYear },
        }
      );
      const budgetsData = Array.isArray(fetchResponse.data)
        ? fetchResponse.data
        : [];
      
      dispatch({ type: "SET_BUDGETS", payload: budgetsData });
    } catch (err) {
      console.error(
        "Error setting budget:",
        err.response ? err.response.data : err.message
      );
    }
  }

  async function updateUserSettings(settings) {
    try {
      const token = await getIdToken(auth.currentUser);
      const response = await axios.put(
        "http://localhost:5000/api/users/me",
        settings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
        );
        dispatch({ type: "SET_USER_SETTINGS", payload: response.data });
        // Apply dark mode immediately
        document.documentElement.classList.toggle(
          "dark",
          response.data.dark_mode
        );
      } catch (err) {
        console.error("Error updating user settings:", err);
      }
    }


  function setSelectedMonth(month) {
    dispatch({
      type: "SET_SELECTED_MONTH",
      payload: month,
    });
  }

  function setSelectedYear(year) {
    dispatch({
      type: "SET_SELECTED_YEAR",
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
        budgets: state.budgets,
        userSettings: state.userSettings,
        isLoading,
        bulkAddTransactions,
        updateUserSettings,
        deleteTransaction,
        addTransaction,
        setBudget,
        deleteBudget,
        setSelectedMonth,
        setSelectedYear,
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
