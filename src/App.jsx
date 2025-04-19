// src/App.js
import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Balance } from "./components/Balance";
import { IncomeExpenses } from "./components/IncomeExpenses";
import { TransactionList } from "./components/TransactionList";
import { AddTransaction } from "./components/AddTransaction";
import { Sidebar } from "./components/Sidebar";
import { MonthlyReport } from "./components/MonthlyReport";
import { GlobalProvider, GlobalContext } from "./context/GlobalState";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { BudgetManagement } from "./components/BudgetManagement";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { Settings } from "./components/Settings";
import { GroupExpenseSplitter } from "./components/GroupExpenseSplitter";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <GlobalProvider>
      <Router>
        <div className="flex">
          {user && <Sidebar />}
          <div className="content-wrapper">
            {user && <Header />}
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Login setUser={setUser} />}
              />
              <Route
                path="/monthly"
                element={user ? <MonthlyReport /> : <Login setUser={setUser} />}
              />
              <Route
                path="/budget"
                element={
                  user ? <BudgetManagement /> : <Login setUser={setUser} />
                }
              />
              <Route
                path="/add-transaction"
                element={
                  user ? <AddTransaction /> : <Login setUser={setUser} />
                }
              />
              <Route
                path="/history"
                element={
                  user ? <TransactionList /> : <Login setUser={setUser} />
                }
              />
              <Route
                path="/settings"
                element={user ? <Settings /> : <Login setUser={setUser} />}
              />
              <Route
                path="/group-expenses"
                element={
                  user ? <GroupExpenseSplitter /> : <Login setUser={setUser} />
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </GlobalProvider>
  );
};
export default App;
