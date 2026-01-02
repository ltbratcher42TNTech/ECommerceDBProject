const express = require('express');
const router = express.Router();
const pool = require('../connection');


// GET /api/users
router.get('/', async (req,res,next) => {
    try{
        const [rows] = await pool.query(
            'SELECT UserId, Email, CreatedAt FROM users'
        );
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
})



// GET /api/users/:id
router.get('/:id', async (req,res,next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT UserId, Email, CreatedAt FROM users WHERE UserId = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});



// GET /api/users/:id/orders
router.get('/:id/orders', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      `SELECT OrderID, CreatedAt, OrderTotal, OrderStatus
       FROM orders
       WHERE UserID = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});



// POST /api/users
router.post('/', async (req,res,next) => {
  try {
    const { Email, FirstName, LastName } = req.body;

    if (!Email || !FirstName || !LastName) {
      return res.status(400).json({ error: 'All fields, Email, FirstName, and LastName, are required' });
    }

    const sql = 'INSERT INTO users (Email, FirstName, LastName) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [Email, FirstName, LastName]);

    res.status(201).json({ message: 'User created', UserID: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(err);
  }
});


module.exports = router;