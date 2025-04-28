const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const multer = require('multer');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert('./service-account.json'),
});

// Configure multer for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory before saving to DB
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Database connection
const db = mysql.createPool({
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_DATABASE,
  port: process.env.VITE_DB_PORT
});

// Test database connection
db.getConnection()
  .then(() => console.log('Connected to MySQL'))
  .catch((err) => console.error('Database connection error:', err));



// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid; // Firebase UID
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


// Helper function to format ISO date to MySQL DATETIME
const formatDateForMySQL = (isoDate) => {
  const date = new Date(isoDate);
  return date.toISOString().slice(0, 19).replace('T', ' '); // e.g., "2025-04-06 05:44:58"
};

// Get user settings
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT display_name, photo, preferred_currency, dark_mode FROM users WHERE user_id = ?',
      [req.userId]
    );
    if (rows.length === 0) {
      await db.execute(
        'INSERT INTO users (user_id, display_name, preferred_currency, dark_mode) VALUES (?, ?, ?, ?)',
        [req.userId, null, 'USD', false]
      );
      return res.json({ display_name: null, photo: null, preferred_currency: 'INR', dark_mode: false });
    }
    // Convert photo BLOB to base64 for frontend
    const user = rows[0];
    if (user.photo) {
      user.photo = Buffer.from(user.photo).toString('base64');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Update user settings
app.put('/api/users/me', verifyToken, upload.single('photo'), async (req, res) => {
  const { display_name, preferred_currency, dark_mode } = req.body;
  const photo = req.file ? req.file.buffer : null; // Get file buffer from multer
  try {
    const [result] = await db.execute(
      'INSERT INTO users (user_id, display_name, photo, preferred_currency, dark_mode) ' +
      'VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ' +
      'display_name = VALUES(display_name), photo = VALUES(photo), ' +
      'preferred_currency = VALUES(preferred_currency), dark_mode = VALUES(dark_mode)',
      [req.userId, display_name || null, photo, preferred_currency || 'INR', dark_mode === 'true']
    );
    const response = { user_id: req.userId, display_name, preferred_currency, dark_mode: dark_mode === 'true' };
    if (photo) {
      response.photo = photo.toString('base64'); // Return base64 for immediate frontend use
    }
    res.json(response);
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Get all budgets for the authenticated user
app.get('/api/budgets', verifyToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = 'SELECT * FROM budgets WHERE user_id = ?';
    const params = [req.userId];

    if (month !== undefined && year !== undefined) {
      query += ' AND month = ? AND year = ?';
      params.push(parseInt(month), parseInt(year));
    }

    const [rows] = await db.execute(query, params);
    const formattedRows = rows.map(row => ({
      ...row,
      month: Number(row.month),
      year: Number(row.year),
      amount: Number(row.amount),
    }));
    
    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Set or update a budget
app.post('/api/budgets', verifyToken, async (req, res) => {
  const { category, amount, month, year } = req.body;
  if (!category || amount === undefined || month === undefined || year === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [existing] = await db.execute(
      'SELECT id FROM budgets WHERE user_id = ? AND category = ? AND month = ? AND year = ?',
      [req.userId, category, month, year]
    );

    if (existing.length > 0) {
      // Update existing budget
      await db.execute(
        'UPDATE budgets SET amount = ? WHERE id = ?',
        [amount, existing[0].id]
      );
      res.json({ id: existing[0].id, user_id: req.user.uid, category, amount, month, year });
    } else {
      // Insert new budget
      const [result] = await db.execute(
        'INSERT INTO budgets (user_id, category, amount, month, year) VALUES (?, ?, ?, ?, ?)',
        [req.userId, category, amount, month, year]
      );
      res.status(201).json({ id: result.insertId, user_id: req.user.uid, category, amount, month, year });
    }
  } catch (error) {
    console.error('Error setting budget:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a budget (optional)
app.delete('/api/budgets/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM budgets WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Server error' });
  }
});





// API Endpoints
// Get all transactions for the authenticated user
app.get('/api/transactions', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM transactions WHERE user_id = ?', [req.userId]);
    const formattedRows = rows.map(row => ({
      ...row,
      amount: Number(row.amount), // Ensure amount is a number
    }));
    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a transaction
app.post('/api/transactions', verifyToken, async (req, res) => {
  const { text, amount, type, category, date } = req.body;
  const mysqlDate = formatDateForMySQL(date);
  try {
    const [result] = await db.query(
      'INSERT INTO transactions (text, amount, type, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [text, parseFloat(amount), type, category, mysqlDate, req.userId]
    );
    const newTransaction = {
      id: result.insertId,
      text,
      amount: Number(amount),
      type,
      category,
      date: mysqlDate,
      user_id: req.userId,
    };
    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a transaction
app.delete('/api/transactions/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all group expenses for the authenticated user
app.get('/api/group-expenses', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, group_name, member_name, amount, created_at FROM group_expenses WHERE user_id = ?',
      [req.userId]
    );
    const formattedRows = rows.map(row => ({
      ...row,
      amount: Number(row.amount),
      created_at: row.created_at.toISOString(),
    }));
    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching group expenses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new group expense
app.post('/api/group-expenses', verifyToken, async (req, res) => {
  const { group_name, member_name, amount } = req.body;
  if (!group_name || !member_name || amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO group_expenses (user_id, group_name, member_name, amount) VALUES (?, ?, ?, ?)',
      [req.userId, group_name, member_name, parseFloat(amount)]
    );
    res.status(201).json({
      id: result.insertId,
      user_id: req.userId,
      group_name,
      member_name,
      amount: parseFloat(amount),
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding group expense:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a group expense
app.delete('/api/group-expenses/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM group_expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found or not authorized' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting group expense:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Add a bulk transaction endpoint
app.post('/api/transactions/bulk', verifyToken, async (req, res) => {
  const transactions = req.body.transactions; // Expect an array of transactions
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return res.status(400).json({ error: 'Transactions array is required' });
  }

  try {
    const values = transactions.map(t => [
      t.text,
      parseFloat(t.amount),
      t.type,
      t.category,
      formatDateForMySQL(t.date),
      req.userId,
    ]);

    const query = `
      INSERT INTO transactions (text, amount, type, category, date, user_id)
      VALUES ?
    `;
    const [result] = await db.query(query, [values]);

    const insertedIds = Array.from({ length: result.affectedRows }, (_, i) => result.insertId + i);
    const response = transactions.map((t, i) => ({
      id: insertedIds[i],
      text: t.text,
      amount: Number(t.amount),
      type: t.type,
      category: t.category,
      date: formatDateForMySQL(t.date),
      user_id: req.userId,
    }));

    res.status(201).json(response);
  } catch (err) {
    console.error('Error adding bulk transactions:', err);
    res.status(500).json({ error: err.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});