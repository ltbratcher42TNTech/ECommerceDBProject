import random
from faker import Faker

from db import create_connection, close_connection
from product_catalog import PRODUCT_CATALOG

fake = Faker()

# ---------- USERS ----------
def generate_users(conn, count=10):
    cursor = conn.cursor()
    user_ids = []

    for _ in range(count):
        first_name = fake.first_name().lower()
        last_name = fake.last_name().lower()
        email = f"{first_name}.{last_name}{random.randint(1, 9999)}@example.com"

        cursor.execute("""
            INSERT INTO users (Email, FirstName, LastName, CreatedAt)
            VALUES (%s, %s, %s, NOW())
        """, (email, first_name.capitalize(), last_name.capitalize()))

        user_ids.append(cursor.lastrowid)

    conn.commit()
    cursor.close()
    print(f"{count} users inserted.")
    return user_ids


# ---------- CATEGORIES ----------
def generate_categories(conn):
    cursor = conn.cursor()
    category_ids = {}

    for category in PRODUCT_CATALOG.keys():
        cursor.execute("""
            INSERT INTO categories (Name)
            VALUES (%s)
            ON DUPLICATE KEY UPDATE Name = Name
        """, (category,))

    cursor.execute("SELECT CategoryID, Name FROM categories")
    for cid, name in cursor.fetchall():
        category_ids[name] = cid

    conn.commit()
    cursor.close()
    return category_ids

# ---------- PRODUCTS AND INVENTORY ----------
def generate_products_and_inventory(conn, category_ids):
    cursor = conn.cursor()
    product_ids = []

    for category, products in PRODUCT_CATALOG.items():
        for product in products:
            name = f"{product} Model {random.randint(1000, 9999)}"
            price = round(random.uniform(8, 120), 2)
            stock = random.randint(20, 80)

            cursor.execute("""
                INSERT INTO products (CategoryID, Name, Price, CreatedAt)
                VALUES (%s, %s, %s, NOW())
            """, (category_ids[category], name, price))

            product_id = cursor.lastrowid
            product_ids.append(product_id)

            cursor.execute("""
                INSERT INTO inventory (ProductID, StockQuantity)
                VALUES (%s, %s)
            """, (product_id, stock))

    conn.commit()
    cursor.close()
    return product_ids


# ---------- ORDERS, ITEMS, PAYMENTS ----------
def generate_orders(conn, user_ids, product_ids, order_count=40):
    cursor = conn.cursor()

    for _ in range(order_count):
        user_id = random.choice(user_ids)
        status = random.choice(["COMPLETED", "PENDING"])

        cursor.execute("""
            INSERT INTO orders (UserID, OrderStatus, OrderTotal, CreatedAt)
            VALUES (%s, %s, 0, NOW())
        """, (user_id, status))

        order_id = cursor.lastrowid
        order_total = 0

        items = random.sample(product_ids, random.randint(1, 4))

        for product_id in items:
            cursor.execute("""
                SELECT Price FROM products WHERE ProductID = %s
            """, (product_id,))
            price = cursor.fetchone()[0]

            cursor.execute("""
                SELECT StockQuantity FROM inventory WHERE ProductID = %s
            """, (product_id,))
            stock = cursor.fetchone()[0]

            if stock <= 0:
                continue

            quantity = random.randint(1, min(3, stock))

            cursor.execute("""
                INSERT INTO order_items (OrderID, ProductID, Quantity, UnitPrice)
                VALUES (%s, %s, %s, %s)
            """, (order_id, product_id, quantity, price))

            cursor.execute("""
                UPDATE inventory
                SET StockQuantity = StockQuantity - %s
                WHERE ProductID = %s
            """, (quantity, product_id))

            order_total += quantity * price

        cursor.execute("""
            UPDATE orders
            SET OrderTotal = %s
            WHERE OrderID = %s
        """, (round(order_total, 2), order_id))

        if status == "COMPLETED":
            cursor.execute("""
                INSERT INTO payments (OrderID, PaymentMethod, PaymentStatus, PaidAt)
                VALUES (%s, 'Credit Card', 'PAID', NOW())
            """, (order_id,))

    conn.commit()
    cursor.close()


# ---------- MAIN ----------
def main():
    conn = create_connection()
    if not conn:
        print("Failed to connect to database.")
        return

    user_ids = generate_users(conn)
    category_ids = generate_categories(conn)
    product_ids = generate_products_and_inventory(conn, category_ids)
    generate_orders(conn, user_ids, product_ids)

    close_connection(conn)
    print("Database seeded successfully.")


if __name__ == "__main__":
    main()