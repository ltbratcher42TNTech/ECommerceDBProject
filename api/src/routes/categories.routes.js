const express = require('express');
const router = express.Router();
const pool = require('../connection');



// GET /api/categories
router.get('/', async (req,res,next) => {
    try {
        const [rows] = await pool.query(
            'SELECT CategoryID, Name FROM categories'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;