from db import create_connection, close_connection

conn = create_connection()

if conn:
    # Maybe fetch the current DB version or something simple
    cursor = conn.cursor()
    cursor.execute("SELECT VERSION();")
    version = cursor.fetchone()
    print(f"Database version: {version[0]}")

    cursor.close()
    close_connection(conn)
