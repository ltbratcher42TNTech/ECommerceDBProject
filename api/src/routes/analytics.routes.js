const express = require('express');
const router = express.Router();
const pool = require('../connection');

/*
=========================================================
The purpose of this file is to show SOME, not all, of
my analytics queries as Node.JS endpoints, all GET
=========================================================
*/

// GET /api/analytics/total-revenue
router.get('/total-revenue', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT SUM(OrderTotal) AS total_revenue
      FROM orders
      WHERE OrderStatus = 'COMPLETED'
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch total revenue' });
  }
});


// GET /api/analytics/monthly-revenue
router.get('/monthly-revenue', async (req,res,next) => {
    const [rows] = await pool.query(
        `
        SELECT 
            DATE_FORMAT(CreatedAt, '%Y-%m') AS month,
            SUM(OrderTotal) AS total_revenue
        FROM orders
        WHERE OrderStatus = 'COMPLETED'
        GROUP BY month
        ORDER BY month;
        `
    );
    res.json(rows);
});


// GET /api/analytics/top-customers
router.get('/top-customers', async (req,res,next) => {
    const [rows] = await pool.query(
        `
        SELECT
            u.UserID,
            u.Email,
            SUM(o.OrderTotal) AS total_spent
        FROM users u 
        JOIN orders o ON u.UserID = o.UserID
        WHERE o.OrderStatus = 'COMPLETED'
        GROUP BY u.UserID, u.Email
        ORDER BY total_spent DESC;
        `
    );
    res.json(rows);
});


// GET /api/analytics/top-products
router.get('/top-products', async (req,res,next) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.ProductID,
      p.Name AS product_name,
      SUM(oi.Quantity) AS total_units_sold
    FROM products p
    JOIN order_items oi ON p.ProductID = oi.ProductID
    JOIN orders o ON oi.OrderID = o.OrderID
    WHERE o.OrderStatus = 'COMPLETED'
    GROUP BY p.ProductID, p.Name
    ORDER BY total_units_sold DESC
    `
    );
    res.json(rows);
});


// GET /api/analytics/revenue-by-product
router.get('/revenue-by-product', async (req,res,next) => {
  const [rows] = await pool.query(
    `
    SELECT
        p.ProductID,
        p.Name AS product_name,
        SUM(oi.Quantity * oi.UnitPrice) AS product_revenue
    FROM products p 
    JOIN order_items oi ON p.ProductID = oi.ProductID
    JOIN orders o ON oi.OrderID = o.OrderID
    WHERE o.OrderStatus = 'COMPLETED'
    GROUP BY p.ProductID, p.Name
    ORDER BY product_revenue DESC;
    `
    );
    res.json(rows);
});


module.exports = router;
