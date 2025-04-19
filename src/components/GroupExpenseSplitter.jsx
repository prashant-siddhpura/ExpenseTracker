import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';
import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const GroupExpenseSplitter = () => {
  const { userSettings } = useContext(GlobalContext);
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [amount, setAmount] = useState('');
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [error, setError] = useState('');

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'USD': default: return '$';
    }
  };
  const currencySymbol = getCurrencySymbol(userSettings.preferred_currency);

  // Fetch group expenses on mount and after deletion
  useEffect(() => {
    const fetchGroupExpenses = async () => {
      try {
        const token = await getIdToken(auth.currentUser);
        const response = await axios.get('http://localhost:5000/api/group-expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupExpenses(response.data);
      } catch (err) {
        console.error('Error fetching group expenses:', err);
        setError('Failed to load group expenses.');
      }
    };
    if (auth.currentUser) fetchGroupExpenses();
  }, []);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || !memberName || !amount || amount <= 0) {
      setError('Please fill all fields with valid values.');
      return;
    }
    try {
      const token = await getIdToken(auth.currentUser);
      const response = await axios.post(
        'http://localhost:5000/api/group-expenses',
        { group_name: groupName, member_name: memberName, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupExpenses([...groupExpenses, response.data]);
      setMemberName('');
      setAmount('');
      setError('');
    } catch (err) {
      console.error('Error adding group expense:', err);
      setError('Failed to add expense.');
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const token = await getIdToken(auth.currentUser);
      await axios.delete(`http://localhost:5000/api/group-expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupExpenses(groupExpenses.filter((exp) => exp.id !== id));
      setError('');
    } catch (err) {
      console.error('Error deleting group expense:', err);
      setError('Failed to delete expense.');
    }
  };

  // Calculate splits for a group
  const calculateSplits = (groupName) => {
    const group = groupExpenses.filter((exp) => exp.group_name === groupName);
    if (group.length === 0) return null;

    const totalAmount = group.reduce((sum, exp) => sum + exp.amount, 0);
    const members = [...new Set(group.map((exp) => exp.member_name))];
    const perPerson = totalAmount / members.length;

    const balances = members.map((member) => {
      const paid = group
        .filter((exp) => exp.member_name === member)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { member, balance: paid - perPerson };
    });

    const debts = [];
    const creditors = balances.filter((b) => b.balance > 0);
    const debtors = balances.filter((b) => b.balance < 0);

    debtors.forEach((debtor) => {
      let amountOwed = Math.abs(debtor.balance);
      creditors.forEach((creditor) => {
        if (amountOwed <= 0) return;
        const amountToPay = Math.min(amountOwed, creditor.balance);
        if (amountToPay > 0) {
          debts.push({
            from: debtor.member,
            to: creditor.member,
            amount: amountToPay.toFixed(2),
          });
          amountOwed -= amountToPay;
          creditor.balance -= amountToPay;
        }
      });
    });

    return { totalAmount: totalAmount.toFixed(2), debts, members, contributions: group };
  };

  // Group expenses by group_name
  const groupedExpenses = groupExpenses.reduce((acc, exp) => {
    acc[exp.group_name] = acc[exp.group_name] || [];
    acc[exp.group_name].push(exp);
    return acc;
  }, {});

  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="budget-management-container">
          <h3>Add Group Expense</h3>
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Dinner with Friends"
                required
              />
            </div>
            <div>
              <label htmlFor="memberName">Member Name</label>
              <input
                type="text"
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter member name..."
                required
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                step="0.01"
                required
              />
            </div>
            <button className="btn" type="submit">
              Add Expense
            </button>
          </form>

          <h3 className="mt-6">Group Expense Splits</h3>
          {Object.keys(groupedExpenses).length === 0 ? (
            <p className="text-gray-500 italic">No group expenses added yet.</p>
          ) : (
            Object.keys(groupedExpenses).map((groupName) => {
              const split = calculateSplits(groupName);
              if (!split) return null;
              return (
                <div key={groupName} className="mt-4">
                  <h4>{groupName}</h4>
                  <p>Total: {currencySymbol}{split.totalAmount}</p>
                  <p>Members: {split.members.join(', ')}</p>

                  <h5 className="mt-2">Contributions:</h5>
                  <ul className="list">
                    {split.contributions.map((contribution) => (
                      <li key={contribution.id} className="budget-item flex justify-between items-center">
                        <span>{contribution.member_name}</span>
                        <span>{currencySymbol}{contribution.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleDelete(contribution.id)}
                          className="delete-btn ml-2"
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>

                  <h5 className="mt-2">Debts:</h5>
                  {split.debts.length === 0 ? (
                    <p className="text-gray-500 italic">All settled!</p>
                  ) : (
                    <ul className="list">
                      {split.debts.map((debt, index) => (
                        <li key={index} className="budget-item">
                          <span>{debt.from} owes {debt.to}</span>
                          <span>{currencySymbol}{debt.amount}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};