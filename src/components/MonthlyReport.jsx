// src/components/MonthlyReport.js
import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Transaction } from "./Transaction";

export const MonthlyReport = () => {
  const {
    transactions,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    budgets,
    userSettings,
    isLoading,
  } = useContext(GlobalContext);

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

 


  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const isMatch =
      transactionDate.getMonth() === selectedMonth &&
      transactionDate.getFullYear() === selectedYear;
    
    return isMatch;
  });
 
  
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };

  // Log expense transactions before reducing
  const expenseTransactions = filteredTransactions.filter((t) => t.type === "expense");
 

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0)
    .toFixed(2);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0)
    .toFixed(2);

  const balance = (parseFloat(income) - parseFloat(expense)).toFixed(2);
  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
 
  // const categorySpending = filteredTransactions
  //   .filter((t) => t.type === "expense")
  //   .reduce((acc, t) => {
  //     acc[t.category] = (acc[t.category]) + Number(t.amount);
  //     return acc;
  //   }, {});

  const categorySpending = expenseTransactions.reduce((acc, t) => {
    const category = t.category;
    const amount = Number(t.amount);
   
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const currentBudgets = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );

 



  
  return (
    // <>
    //   <div className="flex justify-center mb-6">
    //     <div className="flex space-x-4">
    //       <div>
    //         <label htmlFor="month" className="block mb-1 font-medium">
    //           Month
    //         </label>
    //         <select
    //           id="month"
    //           value={selectedMonth}
    //           onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
    //           className="border rounded p-2"
    //         >
    //           {months.map((month, index) => (
    //             <option key={index} value={index}>
    //               {month}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       <div>
    //         <label htmlFor="year" className="block mb-1 font-medium">
    //           Year
    //         </label>
    //         <select
    //           id="year"
    //           value={selectedYear}
    //           onChange={(e) => setSelectedYear(parseInt(e.target.value))}
    //           className="border rounded p-2"
    //         >
    //           {years.map((year) => (
    //             <option key={year} value={year}>
    //               {year}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="text-center">
    //     <h4>Monthly Balance</h4>
    //     <h1 className="text-4xl font-semibold text-gray-800">${balance}</h1>
    //   </div>

    //   <div className="inc-exp-container">
    //     <div>
    //       <h4>Income</h4>
    //       <p className="money plus">${income}</p>
    //     </div>
    //     <div>
    //       <h4>Expense</h4>
    //       <p className="money minus">${expense}</p>
    //     </div>
    //   </div>

    //   <h3>Transactions for {months[selectedMonth]} {selectedYear}</h3>
    //   {filteredTransactions.length === 0 ? (
    //     <p className="text-gray-500 italic">
    //       No transactions for this month.
    //     </p>
    //   ) : (
    //     <ul className="list">
    //       {filteredTransactions.map((transaction) => (
    //         <Transaction key={transaction.id} transaction={transaction} />
    //       ))}
    //     </ul>
    //   )}
    // </>
    //below is latest __________________________________________________
    // <div className="content-wrapper">

    //   <div className="container">
    //     <div className="monthly-report-container">
    //       <div className="flex justify-center mb-6">
    //         <div className="flex space-x-4">
    //           <div>
    //             <label htmlFor="month" className="block mb-1 font-medium">
    //               Month
    //             </label>
    //             <select
    //               id="month"
    //               value={selectedMonth}
    //               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
    //             >
    //               {months.map((month, index) => (
    //                 <option key={index} value={index}>
    //                   {month}
    //                 </option>
    //               ))}
    //             </select>
    //           </div>
    //           <div>
    //             <label htmlFor="year" className="block mb-1 font-medium">
    //               Year
    //             </label>
    //             <select
    //               id="year"
    //               value={selectedYear}
    //               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
    //             >
    //               {years.map((year) => (
    //                 <option key={year} value={year}>
    //                   {year}
    //                 </option>
    //               ))}
    //             </select>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="text-center">
    //         <h4>Monthly Balance</h4>
    //         <h1>${balance}</h1>
    //       </div>

    //       <div className="inc-exp-container">
    //         <div>
    //           <h4>Income</h4>
    //           <p className="money plus">${income}</p>
    //         </div>
    //         <div>
    //           <h4>Expense</h4>
    //           <p className="money minus">${expense}</p>
    //         </div>
    //       </div>

    //       <h3>Transactions for {months[selectedMonth]} {selectedYear}</h3>
    //       {filteredTransactions.length === 0 ? (
    //         <p className="text-gray-500 italic">
    //           No transactions for this month.
    //         </p>
    //       ) : (
    //         <ul className="list">
    //           {filteredTransactions.map((transaction) => (
    //             <Transaction key={transaction.id} transaction={transaction} />
    //           ))}
    //         </ul>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="content-wrapper">
      <div className="container">
        <div className="monthly-report-container">
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
            <h1>{currencySymbol}{balance}</h1>
          </div>

          <div className="inc-exp-container">
            <div>
              <h4>Income</h4>
              <p className="money plus">{currencySymbol}{income}</p>
            </div>
            <div>
              <h4>Expense</h4>
              <p className="money minus">{currencySymbol}{expense}</p>
            </div>
          </div>

          <h3>Budget Progress</h3>
          {currentBudgets.length === 0 ? (
            <p className="text-gray-500 italic">
              No budgets set for this month.
            </p>
          ) : (
            <ul className="list">
              {currentBudgets.map((budget) => {
                const spent = categorySpending[budget.category] || 0 ;
                
                const remaining = Number(budget.amount) - spent;
                const progress =Number(budget.amount) > 0 ? Math.min((spent / Number(budget.amount)) * 100, 100) : 0;
                return (
                  <li key={budget.id} className="budget-progress-item">
                    <div>
                      <span>{budget.category}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({currencySymbol}{spent.toFixed(2)} / {currencySymbol}{Number(budget.amount).toFixed(2)})
                     
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: progress > 100 ? "#ef4444" : "#22c55e",
                        }}
                      ></div>
                    </div>
                    <span>{currencySymbol}{remaining.toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          )}

          <h3>
            Transactions for {months[selectedMonth]} {selectedYear}
          </h3>
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
        </div>
      </div>
    </div>
  );
};
