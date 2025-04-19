// import React, { useContext } from 'react';
// import { GlobalContext } from '../context/GlobalState';
// import { Balance } from './Balance';
// import { IncomeExpenses } from './IncomeExpenses';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

// export const Home = () => {
//   const { transactions, budgets, selectedMonth, selectedYear, userSettings } = useContext(GlobalContext);
//   const totalTransactions = transactions.length;

//   const getCurrencySymbol = (currency) => {
//     switch (currency) {
//       case 'INR': return '₹';
//       case 'EUR': return '€';
//       case 'USD': default: return '$';
//     }
//   };

//   const spentByCategory = transactions.reduce((acc, t) => {
//     const date = new Date(t.date);
//     if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
//       acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
//     }
//     return acc;
//   }, {});
  
//   const currentBudgets = budgets.filter(
//     (b) => b.month === selectedMonth && b.year === selectedYear
//   );
  
//   const budgetStatus = currentBudgets.map(budget => {
//     const spent = spentByCategory[budget.category] || 0;
//     const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
//     return { ...budget,spent: Math.abs(spent), percentage: Math.min(percentage, 100) };
//   });

//   const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

//   return (
//     <div className="content-wrapper">
//       <div className="container">
//         <Balance />
//         <IncomeExpenses />
//         <div className="text-center">
//           <h4>Total Transactions</h4>
//           <p className="text-2xl font-semibold">{totalTransactions}</p>
//         </div>
//         {budgetStatus.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {budgetStatus.map((status) => (
//               <div key={status.id} className="p-4 bg-slate-700 rounded-lg shadow-md">
//                 <h4 className="text-md font-medium">{status.category}</h4>
//                 <div className="w-24 h-24 mx-auto mt-2">
//                   <CircularProgressbar
//                     value={status.percentage}
//                     text={`${status.percentage.toFixed(1)}%`}
//                     styles={{
//                       path: { stroke: status.percentage > 80 ? '#ef4444' : '#22c55e' },
//                       text: { fill: '#ffffff', fontSize: '16px' },
//                     }}
//                   />
//                 </div>
//                 <p className="mt-2 text-center">Budget: {currencySymbol}{status.amount.toFixed(2)}</p>
//                 <p className="text-center">Spent: {currencySymbol}{status.spent.toFixed(2)}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// src/components/Home.jsx
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Balance } from './Balance';
import { IncomeExpenses } from './IncomeExpenses';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Home = () => {
  const { transactions, budgets, selectedMonth, selectedYear, userSettings } = useContext(GlobalContext);
  const totalTransactions = transactions.length;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };
  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

  // Filter transactions for the selected month and year
  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  // Calculate income and expenses
  const income = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const expenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // Category-wise expense data for pie chart
  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
  const categories = Object.keys(expenseByCategory);
  const categoryAmounts = Object.values(expenseByCategory);

  // Pie chart data
  const pieData = {
    labels: categories.length > 0 ? categories : ['No Expenses'],
    datasets: [
      {
        data: categoryAmounts.length > 0 ? categoryAmounts : [1],
        backgroundColor: [
          '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6',
          '#ec4899', '#10b981', '#6366f1', '#f97316', '#14b8a6',
        ],
        borderColor: '#374151',
        borderWidth: 1,
      },
    ],
  };
  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#f9fafb', font: { family: 'Poppins', size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${currencySymbol}${context.raw.toFixed(2)}`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Bar chart data for income vs. expenses
  const barData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: `${months[selectedMonth]} ${selectedYear}`,
        data: [income, expenses],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#22c55e', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#f9fafb',
          callback: (value) => `${currencySymbol}${value}`,
        },
        grid: { color: '#6b7280' },
      },
      x: {
        ticks: { color: '#f9fafb' },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#f9fafb', font: { family: 'Poppins', size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${currencySymbol}${context.raw.toFixed(2)}`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Budget status
  const currentBudgets = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );
  const budgetStatus = currentBudgets.map((budget) => {
    const spent = expenseByCategory[budget.category] || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { ...budget, spent, percentage: Math.min(percentage, 100) };
  });

  return (
    <div className="content-wrapper">
      <div className="container">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Dashboard - {months[selectedMonth]} {selectedYear}
        </h2>
      {/* Total Transactions */}
      <div className="text-center mt-6">
          <h4 className="text-lg font-medium">Total Transactions</h4>
          <p className="text-2xl font-semibold">{totalTransactions}</p>
      </div>

      

        {/* Balance and Income/Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Balance />
          <IncomeExpenses />
        </div>
          
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart: Expense by Category */}
          <div className="bg-slate-700 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-center mb-4">Expenses by Category</h3>
            <div className="relative h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Bar Chart: Income vs. Expenses */}
          <div className="bg-slate-700 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-center mb-4">Income vs. Expenses</h3>
            <div className="relative h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-slate-700 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-center mb-4">Budget Progress</h3>
          {budgetStatus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetStatus.map((status) => (
                <div key={status.id} className="flex flex-col items-center">
                  <div className="w-24 h-24 mb-2">
                    <CircularProgressbar
                      value={status.percentage}
                      text={`${status.percentage.toFixed(1)}%`}
                      styles={buildStyles({
                        pathColor: status.percentage > 80 ? '#ef4444' : '#22c55e',
                        textColor: '#f9fafb',
                        trailColor: '#6b7280',
                        textSize: '16px',
                      })}
                    />
                  </div>
                  <h4 className="text-md font-medium">{status.category}</h4>
                  <p className="text-sm text-gray-400">
                    Budget: {currencySymbol}{status.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Spent: {currencySymbol}{status.spent.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">
              No budgets set for this month.
            </p>
          )}
        </div>
      
        
      </div>
    </div>
  );
};