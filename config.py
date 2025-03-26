import os

DB_USERNAME = "root"
DB_PASSWORD = "yourpassword"
DB_HOST = "localhost"
DB_NAME = "bubble_shooter"

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.urandom(24)
