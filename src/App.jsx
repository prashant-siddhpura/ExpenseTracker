// src/App.js
import React, { useContext } from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';
import { Sidebar } from './components/Sidebar';
import { MonthlyReport } from './components/MonthlyReport';
import { GlobalProvider, GlobalContext } from './context/GlobalState';

function App() {
  const { viewMode } = useContext(GlobalContext);

  return (
    <GlobalProvider>
      <div className="relative">
        <Sidebar />
        <div className="content-wrapper">
          <Header />
          <div className="container py-0">
            {viewMode === 'home' ? (
              <>
                <Balance />
                <IncomeExpenses />
                <div className="grid-container mt-6">
                  <div>
                    <TransactionList />
                  </div>
                  <div className="add-transaction-container">
                    <AddTransaction />
                  </div>
                </div>
              </>
            ) : (
              <MonthlyReport />
            )}
          </div>
        </div>
      </div>
    </GlobalProvider>
  );
}

export default App;