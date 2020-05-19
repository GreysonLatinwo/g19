from mysql.connector import MySQLConnection, Error
from dbconfig import Read_dbconfig

def createDatabase(partyID):
    query = "CREATE DATABASE IF NOT EXISTS " + partyID
    print("DataBase ID: " + partyID)
    try:
        db_config = Read_dbconfig()
        conn = MySQLConnection(**db_config)
        cursor = conn.cursor()
        cursor.execute(query)
        cursor.execute("use " + partyID)
        createPrevList(partyID)
        createSongDB(partyID)
        conn.commit()
    except Error as error:
        print(error)

    finally:
        cursor.close() 
        conn.close()

def createPrevList(party):
    query = "Create table if not exists PrevSongList (prevSong varchar(255), record int auto_increment primary key);"
    try:
        db_config = Read_dbconfig()
        conn = MySQLConnection(**db_config)
        cursor = conn.cursor()
        cursor.execute("use " + party)
        cursor.execute(query)
        conn.commit()
    except Error as error:
        print(error)

    finally:
        cursor.close()
        conn.close()

def createSongDB(party):
    query = "Create table if not exists SongList (URL varchar(255) unique, songName varchar(255) unique, songRank int, userDisplayName varchar(255), record int auto_increment primary key);"
    try:
        db_config = Read_dbconfig()
        conn = MySQLConnection(**db_config)
        cursor = conn.cursor()
        cursor.execute("use " + party)
        cursor.execute(query)
        conn.commit()
    except Error as error:
        print(error)

    finally:
        cursor.close()
        conn.close()

def DB_Exists(DB):
    #db_config = Read_dbconfig()
    dbconfig = Read_dbconfig()
    conn = MySQLConnection(**dbconfig)
    cursor = conn.cursor()
    #cursor.execute("use " + DB) 
    # DBs = cursor.execute("SHOW DATABASES LIKE '"+DB+"';")
    # conn.commit()
    #cursor.execute("use " + DB)
    cursor.execute("SHOW DATABASES LIKE '"+DB+"';")
    DBs = cursor.fetchall()
    if(DBs):
        return True
    return False
