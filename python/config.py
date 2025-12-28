import os
from dotenv import load_dotenv

load_dotenv()  # Loads stuff from .env into the environment, keeping data safe and secure

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')