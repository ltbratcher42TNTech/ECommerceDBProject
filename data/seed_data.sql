-- -------------------------------------------------------
-- Seeding Data for ecommerce_db
-- -------------------------------------------------------
USE ecommerce_db;

-- -------------------------------------------------------
-- Users
-- -------------------------------------------------------
INSERT INTO users (Email, FirstName, LastName)
VALUES
('jane@example.com', 'Jane', 'Doe'),
('bob@example.com', 'Bob', 'Doelling'),
('carol@example.com', 'Carol', 'Smith');

-- -------------------------------------------------------
-- Categories
-- -------------------------------------------------------
INSERT INTO categories (Name)
VALUES
('Electronics'),
('Books'),
('Clothing');

-- -------------------------------------------------------
-- Products
-- -------------------------------------------------------
INSERT INTO products (CategoryID, Name, Price)
VALUES
(1, 'Wireless Mouse', 29.99),
(1, 'Mechanical Keyboard', 89.99),
(2, 'To Kill A Mockingbird', 59.99),
(3, 'Hoodie', 39.99);

-- -------------------------------------------------------
-- Inventory
-- -------------------------------------------------------
INSERT INTO inventory (ProductID, StockQuantity)
VALUES
(1, 100),
(2, 50),
(3, 30),
(4, 75);

-- -------------------------------------------------------
-- Orders
-- -------------------------------------------------------
INSERT INTO orders (UserID, OrderStatus, OrderTotal)
VALUES
(1, 'COMPLETED', 119.98),
(2, 'COMPLETED', 59.99),
(3, 'PENDING', 39.99);

--- -------------------------------------------------------
-- Order Items
-- -------------------------------------------------------
INSERT INTO order_items (OrderID, ProductID, Quantity, UnitPrice)
VALUES
-- Order 1 (Jane)
(1, 1, 1, 29.99),
(1, 2, 1, 89.99),

-- Order 2 (Bob)
(2, 3, 1, 59.99),

-- Order 3 (Carol)
(3, 4, 1, 39.99);

-- -------------------------------------------------------
-- Payments
-- -------------------------------------------------------
INSERT INTO payments (OrderID, PaymentMethod, PaymentStatus, PaidAt)
VALUES
(1, 'CREDIT_CARD', 'PAID', NOW()),
(2, 'PAYPAL', 'PAID', NOW());
