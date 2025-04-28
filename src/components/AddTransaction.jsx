// // src/components/AddTransaction.js
// import React, { useState, useContext } from 'react';
// import { GlobalContext } from '../context/GlobalState';
// import { Header } from './Header';

// export const AddTransaction = () => {
//   const [text, setText] = useState('');
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('');

//   const { addTransaction, categories } = useContext(GlobalContext);

//   const onSubmit = (e) => {
//     e.preventDefault();

//     const newTransaction = {
//       id: Math.floor(Math.random() * 100000000),
//       text,
//       amount: parseFloat(amount),
//       type,
//       category,
//       date: new Date().toISOString(),
//     };

//     // Add the transaction to context
//     addTransaction(newTransaction);

//     // Reset form
//     setText('');
//     setAmount('');
//     setCategory('');
//   };

//   return (
//     <div className="content-wrapper">
//       <Header />
//       <div className="container">
//         <div className="add-transaction-container">
//           <h3>Add New Transaction</h3>
//           <form onSubmit={onSubmit}>
//             <div>
//               <label htmlFor="text">Description</label>
//               <input
//                 type="text"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Enter description..."
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="amount">Amount</label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter amount..."
//                 step="0.01"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="type">Type</label>
//               <select value={type} onChange={(e) => setType(e.target.value)}>
//                 <option value="income">Income</option>
//                 <option value="expense">Expense</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="category">Category</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {(type === 'income' ? categories.income : categories.expense).map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//             <button className="btn" type="submit">
//               Add Transaction
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Header } from './Header';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [file, setFile] = useState(null); // State for file upload
  const [uploadStatus, setUploadStatus] = useState(''); // Feedback for upload

  const { addTransaction, categories,bulkAddTransactions } = useContext(GlobalContext);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
  }, []);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set language
    recognition.continuous = false; // Stop after one phrase
    recognition.interimResults = false; // Only final results

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Recognized text:', transcript);

      // Parse the transcript to distinguish fields
      const parseCommand = (text) => {
        const words = text.split(' ');
        const result = { description: '', amount: '', type: '', category: '' };
        let currentField = null;

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (word === 'amount' && i + 1 < words.length && !result.amount) {
            const nextWord = words[i + 1];
            if (!isNaN(nextWord)) {
              result.amount = nextWord;
              i++; // Skip the number
            }
          } else if (word === 'type' && i + 1 < words.length && !result.type) {
            const nextWord = words[i + 1];
            if (nextWord === 'income' || nextWord === 'expense') {
              result.type = nextWord;
              i++; // Skip the type
            }
          } else if (word === 'category' && i + 1 < words.length && !result.category) {
            const nextWord = words[i + 1];
            if (categories.expense.includes(nextWord) || categories.income.includes(nextWord)) {
              result.category = nextWord;
              i++; // Skip the category
            }
          } else if (!result.description) {
            result.description += (result.description ? ' ' : '') + word;
          }
        }

        return result;
      };

      const parsed = parseCommand(transcript);
      setParsedData(parsed);
      showConfirmation(parsed);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Error during speech recognition. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended.');
    };

    recognition.start();
  };

  const showConfirmation = (data) => {
    if (!data || (!data.description && !data.amount && !data.type && !data.category)) {
      alert('No valid data recognized. Please try again with a command like "grocery amount 250 type expense category food".');
      return;
    }

    const confirmation = window.confirm(
      `Recognized data:\nDescription: ${data.description || 'Not set'}\nAmount: ${data.amount || 'Not set'}\nType: ${data.type || 'Not set'}\nCategory: ${data.category || 'Not set'}\nConfirm to populate fields?`
    );

    if (confirmation) {
      setText(data.description || '');
      setAmount(data.amount || '');
      setType(data.type || 'income');
      setCategory(data.category || '');
    } else {
      setParsedData(null); // Reset if declined
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    };

    addTransaction(newTransaction);

    setText('');
    setAmount('');
    setCategory('');
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/plain') {
      setFile(uploadedFile);
      setUploadStatus('');
    } else {
      setFile(null);
      setUploadStatus('Please upload a valid .txt file.');
    }
  };


  const processFile = async () => {
    if (!file) {
      setUploadStatus('No file selected.');
      return;
    }
  
    setUploadStatus('Processing...');
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const dataLines = lines[0].includes('Description') ? lines.slice(1) : lines;
        const transactions = dataLines.map((line, index) => {
          const [text, amount, type, category, date] = line.split('|').map(item => item.trim());
          if (!text || isNaN(amount) || !['income', 'expense'].includes(type) || !category) {
            throw new Error(`Invalid data at line ${index + 2}: ${line}`);
          }
          const validCategories = type === 'income' ? categories.income : categories.expense;
          if (!validCategories.includes(category)) {
            throw new Error(`Invalid category "${category}" at line ${index + 2}`);
          }
          return {
            text,
            amount: parseFloat(amount),
            type,
            category,
            date: date ? new Date(date).toISOString() : new Date().toISOString(),
          };
        });
  
        await bulkAddTransactions(transactions);
        setUploadStatus(`${transactions.length} transactions added successfully!`);
        setFile(null);
      } catch (error) {
        setUploadStatus(`Error: ${error.message}`);
      }
    };
    reader.onerror = () => {
      setUploadStatus('Error reading the file.');
    };
    reader.readAsText(file);
  };


  return (
    <div className="content-wrapper">
      <Header />
      <div className="container">
        <div className="add-transaction-container">
          <h3>Add New Transaction</h3>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="text">Description</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter description... (or use voice)"
                required
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount... (or use voice)"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {(type === 'income' ? categories.income : categories.expense).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={startListening}
              className="btn mt-4"
              disabled={isListening}
            >
              {isListening ? 'Listening...' : 'Add by Voice'}
            </button>
            <button className="btn mt-2" type="submit">
              Add Transaction
            </button>
          </form>
          {/* Bulk Upload Section */}
          <h3 className="mt-6">Bulk Upload Transactions</h3>
          <div>
            <label htmlFor="fileUpload">Upload Transaction File (.txt)</label>
            <input
              type="file"
              id="fileUpload"
              accept=".txt"
              onChange={handleFileUpload}
            />
            <button
              className="btn mt-2"
              onClick={processFile}
              disabled={!file}
            >
              Process File
            </button>
            {file && <p>Selected file: {file.name}</p>}
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};