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



// POST /api/products (THIS IS MY MAJOR ENDPOINT)
router.post('/', async (req,res,next) => {
  const { userId, items, payment } = req.body

  // First, validate
  if (!userID || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' })
  }

  const connection = await pool.getConnection

  try {
    await connection.beginTransaction();

    // Next, we validate that user exists
    const [userRows] = await connection.query(
      'SELECT UserID FROM users WHERE UserID = ?',
      [userId]
    );

    if (userRows.length === 0) {
      throw new Error('User does not exist');
    }

    // Now we validate products and inventory
    for (const item of items) {
      const [productRows] = await connection.query(
        `
        SELECT p.ProductID, i.StockQuantity
        FROM products p
        JOIN inventory i ON p.ProductID = i.ProductID
        WHERE p.ProductID = ?
        `,
        [item.productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product ${item.productId} does not exist`);
      }

      if (productRows[0].StockQuantity < item.quantity) {
        throw new Error( `Insufficient stock quantity for product ${item/productId}`);
      }
    }

    // Now we insert the order as we have validated everything
    const [orderResult] = await connection.query(
      'INSERT INTO orders (UserID, OrderStatus) VALUES (?, ?)',
      [userId, 'PENDING']
    );

    const orderId = orderResult.insertId;

    // Insert order items and subsequently update inventory accordingly
    for (const item of items) {
      // Get Unity Price
      const[[product]] = await connection.query(
        'SELECT Price FROM products WHERE ProductID = ?',
        [item.productId]
      );

      await connection.query(
        `
        INSERT INTO order_items (OrderID, ProductID, StockQuantity, UnitPrice)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.productId, item.quantity, product.Price]
      );

      await connection.query(
        `
        UPDATE inventory
        SET StockQuantity = StockQuantity - ?
        WHERE ProductID = ?
        `,
        [item.quantity, item.productId]
      );
    }

    // Insert the payment (optinal)
    if (payment?.method) {
      await connection.query(
        `
        INSERT INTO payments (OrderID, PaymentMethod, CreatedAt)
        VALUES (?, ?, NOW())
        `,
        [orderId, payment.method]
      );
    }

    // Commit it
    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      OrderID: orderId
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    connection.release();
  }
});


module.exports = router;
