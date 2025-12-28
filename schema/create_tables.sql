-- Create Database ecommerce_db
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- -----------------------
-- Users
-- -----------------------
CREATE TABLE users (
	UserID INT UNSIGNED AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID),
    UNIQUE (Email)
);


-- -----------------------
-- Categories
-- -----------------------
CREATE TABLE categories (
	CategoryID INT UNSIGNED AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    PRIMARY KEY (CategoryID),
    UNIQUE (Name)
);


-- -----------------------
-- Products
-- -----------------------
CREATE TABLE products (
	ProductID INT UNSIGNED AUTO_INCREMENT,
    CategoryID INT UNSIGNED NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ProductID)
); 

-- -----------------------
-- Inventory
-- -----------------------
CREATE TABLE inventory (
	ProductID INT UNSIGNED, 
    StockQuantity INT NOT NULL,
    PRIMARY KEY (ProductID)
); 

-- -----------------------
-- Orders
-- -----------------------
CREATE TABLE orders (
	OrderID INT UNSIGNED AUTO_INCREMENT,
    UserID INT UNSIGNED NOT NULL,
    OrderStatus VARCHAR(50) NOT NULL,
    OrderTotal DECIMAL (12, 2) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (OrderID)
); 

-- -----------------------
-- Order Items
-- -----------------------
CREATE TABLE order_items (
	OrderItemID INT UNSIGNED AUTO_INCREMENT,
    OrderID INT UNSIGNED NOT NULL,
    ProductID INT UNSIGNED NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY(OrderItemID)
); 

-- -----------------------
-- Payments
-- -----------------------
CREATE TABLE payments (
	PaymentID INT UNSIGNED AUTO_INCREMENT,
    OrderID INT UNSIGNED NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,
    PaymentStatus VARCHAR(50) NOT NULL,
    PaidAt DATETIME,
    PRIMARY KEY (PaymentID),
    Unique (OrderID)
); 

