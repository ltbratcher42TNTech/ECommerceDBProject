-- -------------------------------------------------------
-- Add Indexes on FKs and Frequently Queried Columns
-- -------------------------------------------------------

-- Index on products.CategoryID for quicker product category lookups
CREATE INDEX idx_products_category ON products(CategoryID);

-- Was going to place one for inventory.ProductID but it is already a PK, so it implicitly has an index
-- no extra index needed

-- Index on orders.UserID to quickly get user orders
CREATE INDEX idx_orders_user ON orders(UserID);

-- Index on order_items.OrderID to speed up order item retrieval by order
CREATE INDEX idx_orderitems_order ON order_items(OrderID);

-- Index on order_items.ProductID to speed up product-based queries in order items
CREATE INDEX idx_orderitems_product ON order_items(ProductID);

-- Was also going place an index on payments.OrderID but again, indexed due to it's unique constraint
-- no extra index needed

-- Index on orders.CreatedAt for time-based queries
CREATE INDEX idx_orders_createdat ON orders(CreatedAt);

-- Optional: Index on users.Email for fast user lookup by email, a rather useful function
CREATE INDEX idx_users_email ON users(Email);
