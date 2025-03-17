// src/App.js
import React, { useContext } from "react";
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

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/monthly" element={<MonthlyReport />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/history" element={<TransactionList />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
};
export default App;
