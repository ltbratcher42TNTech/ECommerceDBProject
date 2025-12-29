# E-Commerce Database & Analytics System

## Overview
This project implements a relational database system for a simplified, yet not too simple, e-commerce platform. 
The database is designed to support both **transactional workloads** (for example, stuff like orders, payments, inventory updates)
and **analytical queries** (with queries for trends like revenue trends, customer behavior).

The primary focus of this project is on **schema design**, **data integrity**, **query performance**, and **scalability**, rather than front-end functionality. In fact, in it's current state, it's essentially only backend, with possibility for a front-end in the future, hence why I mentioned scalability

---

## Problem Statement
Modern e-commerce systems must efficiently handle high volumes of transactional data whilst enabling meaningful business analytics. Poor designs of schema or lack of optimization can lead to data inconsistency, referential integrity issues, and slow queries as data volume grows. Furthermore, in worst cases, it can even lead to bad or inaccurate data, rather than just inconsistent.

The goal of this project is to design and implement a **normalized** relational database that:
1. Enforces data integrity
2. Accurately models real-world e-commerce relationships
3. Scales logically as data size and query complexity increase
4. Supports common analytical queries which could be used by businesses

---

## Schema Design Summary
The database schema is normalized and models the core properties involved in an e-commerce workflow, including:

- Users
- Categories
- Products
- Inventory
- Orders
- Order Items
- Payments

Key design decisions include:
- Use of a junction table (`order_items`) to model the many-to-many relationship between orders and products, showing good use of normal form
- Separation of inventory data from product metadata
- Explicit foreign key constraints to enforce referential integrity
- Use of surrogate primary keys for scalability and indexing efficiency

---

## Entity-Relationship Diagram
![ER Diagram](ER_diagram.png)

---

## Data Generation (Python)
A Python data generator is used to populate the database with realistic **AND** relationally valid data. The generator respects all foreign key dependencies and business rules by inserting data in dependency order.

### Generated Data Includes:
- Users with realistic names and emails (created using both faker and a specific format for unique emails which relate to names)
- Categorized products with unique model identifiers
- Inventory records for every product
- Orders linked to users
- Order items linked to both orders and products
- Optional payment records per order, as some might be pending payment

The product catalog is separated into its own module to improve **modularity**, **readability**, and **maintainability** of the data generation logic.

---

## Sample Analytics Queries
The database supports analytical queries such as:
- Total and monthly revenue
- Top customers by lifetime spend
- Best-selling products by quantity
- Revenue by category
- Average order value
- Low-inventory alerts
- Orders without associated payments

All queries are written using standard SQL and they also leverage joins, aggregations, and grouping operations for functional analytical queries.

---

## Project Structure
ECommerceDBProject/
|–– schema/
| |–– create_tables.sql
| |–– constraints.sql
| |–– indexes.sql
|
|–– data/
| |–– seed_data.sql
|
|–– scripts/
| |–– analytics.sql
│ |–– reset_db.sql
|
|–– python/
| |–– db.py
| |–– data_generator.py
| |–– product_catalog.py
|
|–– images/
| |––ER_diagram
|–– .gitignore
|–– README.md


---

## Tech Stack
- MySQL / MariaDB
- SQL
- Python (data generation)
- Faker (selective use for realistic data)
- MySQL Workbench
- Git / GitHub

---

## Future Work
Planned extensions to this project in the near future include:
- RESTful API using Node.js and Express
- CRUD endpoints for core entities
- Optional desktop UI for interaction and visualization

---

## Summary
This project demonstrates a strong foundation in **relational database design**, **backend data modeling**, and **analytical querying**, reflecting patterns used in real-world e-commerce systems.
