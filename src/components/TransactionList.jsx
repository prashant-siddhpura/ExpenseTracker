// src/components/TransactionList.js
import React, { useContext, useCallback } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';
import { Header } from './Header';
import { writeFile, utils } from 'xlsx';
import { saveAs } from 'file-saver';

export const TransactionList = () => {
  const { transactions } = useContext(GlobalContext);

  const downloadExcel = useCallback(() => {
    console.log('downloadExcel called');

    // Format transactions with IST date
    const formattedTransactions = transactions.map((transaction) => {
      const date = new Date(transaction.date); // Parse ISO date
      const istDate = date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', // IST timezone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use AM/PM
      });

      // Convert "DD/MM/YYYY, HH:MM:SS AM/PM" to "YYYY-MM-DD HH:MM AM/PM"
      const [datePart, timePart] = istDate.split(', ');
      const [day, month, year] = datePart.split('/');
      // Keep hours and minutes, remove seconds, preserve AM/PM
      const formattedTime = timePart.replace(/:(\d{2})\s/, ' '); // Remove seconds but keep minutes
      const formattedDate = `${year}-${month}-${day} ${formattedTime}`;

      return {
        ...transaction,
        date: formattedDate, // Replace original ISO date with formatted IST date
      };
    });

    // Generate Excel file
    const ws = utils.json_to_sheet(formattedTransactions);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Transactions');
    const excelBuffer = writeFile(wb, 'Transactions.xlsx', { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `Transactions_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`;
    saveAs(excelBlob, fileName);
  }, [transactions]);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleDownload = debounce(downloadExcel, 300);

  return (
    <div className="content-wrapper">
      <Header />
      <div className="container">
        <h3 style={{marginTop: "20px" ,textAlign:"center" ,fontWeight:"600",fontSize:"25px"}}>History</h3>
        <button onClick={handleDownload} className="btn mb-4">
          Download Excel
        </button>
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