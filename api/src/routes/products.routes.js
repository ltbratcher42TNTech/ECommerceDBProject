const express = require('express');
const router = express.Router();
const pool = require('../connection');



// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        p.ProductID, p.Name, p.Price,
        c.CategoryID, c.Name AS CategoryName,
        i.StockQuantity
      FROM products p
      JOIN categories c ON p.CategoryID = c.CategoryID
      JOIN inventory i ON p.ProductID = i.ProductID
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});



// POST /api/products
router.post('/', async (req, res, next) => {
  const { name, categoryId, price, initialStock } = req.body;

  if (!name || !categoryId || !price || initialStock === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, categoryId, price, initialStock' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // This verifies if the category exists
    const [categoryRows] = await connection.query('SELECT CategoryID FROM categories WHERE CategoryID = ?', [categoryId]);
    if (categoryRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Invalid categoryId' });
    }

    // Insert product
    const [productResult] = await connection.query(
      'INSERT INTO products (Name, CategoryID, Price) VALUES (?, ?, ?)',
      [name, categoryId, price]
    );

    // Insert in inventory
    await connection.query(
      'INSERT INTO inventory (ProductID, StockQuantity) VALUES (?, ?)',
      [productResult.insertId, initialStock]
    );

    await connection.commit();

    res.status(201).json({ message: 'Product created', ProductID: productResult.insertId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    next(err);
  } finally {
    connection.release();
  }
});

module.exports = router;
