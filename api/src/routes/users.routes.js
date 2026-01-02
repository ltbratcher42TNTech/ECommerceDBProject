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

module.exports = router;