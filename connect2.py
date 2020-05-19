"""used MySQLConnection object to connect to we_vibe database"""
from mysql.connector import MySQLConnection, Error
from dbconfig import Read_dbconfig


def connect():
    """Connect to the database"""
    db_config = Read_dbconfig()
    conn = None
    try:
        print("Connecting to MySQL database...")
        conn = MySQLConnection(**db_config)
        if conn.is_connected():
            print("Connection established.")
        else:
            print("Connection Failed")
    except Error as error:
        print(error)

    finally:
        if conn is not None and conn.is_connected():
            conn.close()
            print("Connection Closed.")

if __name__ == '__main__':
    connect()

""" 
    connect to database using connect() function and MySQLConnection object. Both create a connect to the 
    database
"""