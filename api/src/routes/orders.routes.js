const express = require('express');
const router = express.Router();
const pool = require('../connection');

// POST /api/orders (THIS IS MY MAJOR ENDPOINT)
router.post('/', async (req,res,next) => {
  const { userId, items, payment } = req.body

  // First, validate
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' })
  }

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction();
    let orderTotal = 0;

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
        SELECT p.ProductID, p.Price, i.StockQuantity
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
        throw new Error( `Insufficient stock quantity for product ${item.productId}`);
      }
      
      orderTotal += productRows[0].Price * item.quantity;
    }

    // Now we insert the order as we have validated everything
    const [orderResult] = await connection.query(
      'INSERT INTO orders (UserID, OrderStatus, OrderTotal) VALUES (?, ?, ?)',
      [userId, 'PENDING', orderTotal]
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
        INSERT INTO order_items (OrderID, ProductID, Quantity, UnitPrice)
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
        INSERT INTO payments (OrderID, PaymentMethod, PaymentStatus, PaidAt)
        VALUES (?, ?, ?, NOW())
        `,
        [orderId, payment.method, 'PENDING']
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