import React, {useContext}from 'react'
import globalContext from '../context/globalContext';
export const Balance = () => {
  const {transactions} = useContext(globalContext);
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  return (
    <>
     <h4>Balance</h4>
     <h1 >₹{total}</h1>
    </>
  )
}
