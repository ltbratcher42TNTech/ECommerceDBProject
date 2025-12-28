-- -------------------------------------------------------
-- Creating the Analytics Queries for ecommerce_db
-- -------------------------------------------------------
USE ecommerce_db;

-- -------------------------------------------------------
-- 1. Total Revenue (uses only completed orders)
-- -------------------------------------------------------
SELECT 
	SUM(OrderTotal) AS total_revenue
FROM orders
WHERE OrderStatus = 'COMPLETED';

-- -------------------------------------------------------
-- 2. Revenue ordered by month
-- -------------------------------------------------------
SELECT 
    DATE_FORMAT(CreatedAt, '%Y-%m') AS month,
    SUM(OrderTotal) AS total_revenue
FROM orders
WHERE OrderStatus = 'COMPLETED'
GROUP BY month
ORDER BY month;

-- -------------------------------------------------------
-- 3. Top customers sorted by total spent
-- -------------------------------------------------------
SELECT
	u.UserID,
    u.Email,
    SUM(o.OrderTotal) AS total_spent
FROM users u 
JOIN orders o ON u.UserID = o.UserID
WHERE o.OrderStatus = 'COMPLETED'
GROUP BY u.UserID, u.Email
ORDER BY total_spent DESC;

-- -------------------------------------------------------
-- 4. Top-Selling Products (by quantity)
-- -------------------------------------------------------
SELECT
    p.ProductID,
    p.Name AS product_name,
    SUM(oi.Quantity) AS total_units_sold
FROM products p
JOIN order_items oi ON p.ProductID = oi.ProductID
JOIN orders o ON oi.OrderID = o.OrderID
WHERE o.OrderStatus = 'COMPLETED'
GROUP BY p.ProductID, p.Name
ORDER BY total_units_sold DESC;

-- -------------------------------------------------------
-- 5. Revenue Created by Product
-- -------------------------------------------------------
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

-- -------------------------------------------------------
-- 6. Revenue by Category
-- -------------------------------------------------------
SELECT
    c.CategoryID,
    c.Name AS category_name,
    SUM(oi.Quantity * oi.UnitPrice) AS category_revenue
FROM categories c
JOIN products p ON c.CategoryID = p.CategoryID
JOIN order_items oi ON p.ProductID = oi.ProductID
JOIN orders o ON oi.OrderID = o.OrderID
WHERE o.OrderStatus = 'COMPLETED'
GROUP BY c.CategoryID, c.Name
ORDER BY category_revenue DESC;

-- -------------------------------------------------------
-- 7. Average value of orders
-- -------------------------------------------------------
SELECT 
	AVG(OrderTotal) AS average_order_value
FROM orders
WHERE OrderStatus = 'COMPLETED';

-- -------------------------------------------------------
-- 8. Orders per user
-- -------------------------------------------------------
SELECT
	u.UserID,
    u.Email,
    COUNT(o.OrderID) AS total_orders
FROM users u
LEFT JOIN orders o ON u.UserID = o.UserID -- so zero orders still show
GROUP BY u.UserID, u.Email
ORDER BY total_orders DESC;

-- -------------------------------------------------------
-- 9. Alert for low inventory
-- -------------------------------------------------------
SELECT
    p.ProductID,
    p.Name AS product_name,
    i.StockQuantity
FROM inventory i
JOIN products p ON i.ProductID = p.ProductID
WHERE i.StockQuantity < 20
ORDER BY i.StockQuantity ASC;
 

-- -------------------------------------------------------
-- 10. Orders without payments
-- -------------------------------------------------------
SELECT
	o.OrderID,
    o.UserID,
    o.OrderStatus,
    o.CreatedAt,
    u.FirstName AS first_name,
    u.LastName AS last_name
FROM orders o
LEFT JOIN payments p ON o.OrderID = p.OrderID
JOIN users u ON o.UserID = u.UserID
WHERE p.PaymentID IS NULL;