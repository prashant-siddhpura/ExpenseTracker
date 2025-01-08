import React ,{useContext}from 'react';
import globalContext from '../context/globalContext';

export const Transaction = ({transaction}) => {
    const sign = transaction.amount < 0 ? '-' : '+';
    const {deleteTransaction} = useContext(globalContext);

  return (
    <div>
        <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
        {transaction.text} <span>{sign}₹{Math.abs(transaction.amount)}</span>
        <button onClick={() => deleteTransaction(transaction.id)} className="delete-btn">x</button>

            </li>
    </div>
  )
}
