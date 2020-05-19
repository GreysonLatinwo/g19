from mysql.connector import MySQLConnection, Error
from dbconfig import Read_dbconfig

#pop stack
#queue trackID, Name, and rank
def pop(database):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database)
        cursor.execute("select URL, songName, songRank, userDisplayName from SongList where songRank = (select max(SongList.songRank) from SongList);")
        out = str(cursor.fetchall())
        cursor.execute("select record from SongList where songRank = (select max(SongList.songRank) from SongList);")
        record = str(cursor.fetchall())
        toDelete = record[2:record.index(',')]
        cursor.execute("DELETE FROM SongList where record = " + toDelete + ";")
        conn.commit()
        return out
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()
#print(pop("testing"))
#output: [('123', 'Last Call', 8)]

def DeleteSong(database, songName):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database)
        cursor.execute("select record from SongList where songName = '" + songName + "';")
        record = str(cursor.fetchall())
        length = len(record)
        toDelete = record[2:length - 3]
        cursor.execute("DELETE FROM SongList where record = " + toDelete + ";")
        conn.commit()
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()



#0 --> url
#1 --> song name
#2 --> rank
#3 --> userDisplayName
from enum import Enum
class Index(Enum):
    URL = 0
    SONGNAME = 1
    VOTE = 2
    USERNAME = 3
def getSongOrder(database, Mode: Index):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database)
        cursor.execute("SELECT * FROM SongList ORDER BY songRank DESC;")
        row = [item[Mode] for item in cursor.fetchall()]
        return row
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()
#output: ['Money in the Grave', 'Metropolis', 'Ordinary Day']


#return an array of users by the rank of their song ex. song rank 10, 5, 2 --> joe, bo, toe
def getSongOrderUser(database):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database)
        cursor.execute("select userDisplayName from SongList where record in (select record from song order by songRank DESC);")
        row = [item[0] for item in cursor.fetchall()]
        return row
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()
#output: ['Money in the Grave', 'Metropolis', 'Ordinary Day']

def upVote(database, songName, upvote):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database + ";")
        cursor.execute("update SongList set songRank = songRank + "+upvote+" where songName = " + "'" + songName + "'" + ";")
        conn.commit()
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()



def downVote(database, songName, downvote):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database + ";")
        cursor.execute("update SongList set songRank = songRank + "+downvote+" where songName = " + "'" + songName + "'" + ";")
        conn.commit()
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

def deleteDatabase(database):
    try:
        dbconfig = Read_dbconfig()
        conn = MySQLConnection(**dbconfig)
        cursor = conn.cursor()
        cursor.execute("use " + database + ";")
        cursor.execute("DROP DATABASE IF EXISTS " + database + ";")
        conn.commit()
    except Error as e:
        print(e)
    finally:
        cursor.close()
        conn.close()