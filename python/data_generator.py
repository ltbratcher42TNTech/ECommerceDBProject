import random
from faker import faker

from db import create_connection, close_connection
from product_catalog import PRODUCT_CATALOG

fake = faker()

# ---------- USERS ----------
def generate_users(conn, count=10):
    cursor = conn.cursor()
    for _ in range(count):
        first_name = fake.first_name().lower()
        last_name = fake.last_name().lower()
        email = f"{first_name}.{last_name}{random.randint(1, 99)}@example.com"
        cursor.execute("""
            INSERT INTO users (Email, FirstName, LastName, CreatedAt)
            VALUES (%s, %s, %s, NOW())
        """, (email, first_name.capitalize(), last_name.capitalize()))
    conn.commit()
    cursor.close()
    print(f"{count} users inserted.")

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
# logic should be that it will iteratively go through product catalog and appends a model number
# to each one, helps keep stuff unique and explains price differences. Then it will generate a price
# and an inventory stock quantity. It will then get product id and insert inventory. Finally, it
# will commit, close cursor, and return


