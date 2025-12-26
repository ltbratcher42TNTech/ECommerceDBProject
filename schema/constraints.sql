-- -------------------------------------------------------
-- Add Foreign Key Constraints for Products
-- -------------------------------------------------------
ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID);


-- -------------------------------------------------------
-- Add Foreign Key Constraints for Inventory
-- -------------------------------------------------------
ALTER TABLE inventory
ADD CONSTRAINT fk_inventory_product
FOREIGN KEY (ProductID) REFERENCES products(ProductID);


-- -------------------------------------------------------
-- Add Foreign Key Constraints for Orders
-- -------------------------------------------------------
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (UserID) REFERENCES users(UserID);


-- -------------------------------------------------------
-- Add Foreign Key Constraints for order_items
-- -------------------------------------------------------
ALTER TABLE order_items
ADD CONSTRAINT fk_orderitems_order
FOREIGN KEY (OrderID) REFERENCES orders(OrderID);

ALTER TABLE order_items
ADD CONSTRAINT fk_orderitems_product
FOREIGN KEY (ProductID) REFERENCES products(ProductID);


-- -------------------------------------------------------
-- Add Foreign Key Constraints for Payments
-- -------------------------------------------------------
ALTER TABLE payments
ADD CONSTRAINT fk_payments_order
FOREIGN KEY (OrderID) REFERENCES orders(OrderID);

-- -------------------------------------------------------
-- Add Constraints to check for negatives
-- -------------------------------------------------------
ALTER TABLE inventory
ADD CONSTRAINT chk_inventory_stock_nonnegative CHECK (StockQuantity >= 0);

ALTER TABLE order_items
ADD CONSTRAINT chk_orderitems_quantity_positive CHECK (Quantity > 0);

ALTER TABLE products
ADD CONSTRAINT chk_products_price_nonnegative CHECK (Price >= 0);

ALTER TABLE orders
ADD CONSTRAINT chk_orders_total_nonnegative CHECK (OrderTotal >= 0);
