from mysql.connector import MySQLConnection, Error
from dbconfig import Read_dbconfig


def insertSong(database, URL, songName, songRank, userDisplayName):
    try:
        db_config = Read_dbconfig()
        conn = MySQLConnection(**db_config)
        cursor = conn.cursor()
        cursor.execute("use " + database)
        cursor.execute("insert into SongList (URL, songName, songRank, userDisplayName) \n" +
                       "select '" + URL + "', '" + songName + "', '" + songRank + "', '" +userDisplayName+"' \n" +
                       "Where NOT exists (select URL from SongList where URL = '" + URL + "');")
        conn.commit()
    except Error as error:
        print(error)
    finally:
        cursor.close()
        conn.close()

def insertPrevSong(database, songName):
    try:
        db_config = Read_dbconfig()
        conn = MySQLConnection(**db_config)
        cursor = conn.cursor()
        cursor.execute("use " + database)
        cursor.execute("insert into PrevSongList (prevSong)\n" +
                       "select '" + songName + "'\n" +
                       "where not exists (select prevSong from PrevSongList where prevSong = '" + songName + "');")
        conn.commit()
    except Error as error:
        print(error)
    finally:
        cursor.close()
        conn.close()