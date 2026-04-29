import time

from fastapi import HTTPException
import mysql.connector

from app.config import get_settings

settings = get_settings()

config = {
    "user": settings.DB_USER,
    "password": settings.DB_PASSWORD,
    "host": settings.DB_HOST,
    "database": settings.DB_NAME,
    "connection_timeout": 5,
}


def get_db():
    cnx = connect_to_mysql()

    if cnx is None:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    try:
        yield cnx
    finally:
        cnx.close()


def connect_to_mysql(attempts=3, delay=2):
    for i in range(attempts):
        try:
            return mysql.connector.connect(**config)
        except:
            print(f"Failed to establish a connection with the database.  \
                  Trying again... ({i + 1} / {attempts})\n")

            time.sleep(delay**i)

    return None
