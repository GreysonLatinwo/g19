import sys
import socket
import time
import webscrape
import random
import connect2
import dbconfig
import insertion
import query
import Startup

ServerList = []
running = True
code = False


class server:
    def __init__(self, serverid):
        self.SpotifyAccessToken = ''
        self.partyID = serverid 
        print("Party Started. ID to join is: " + str(self.partyID))
    #Greyson Jones
    def client_handle(self, Username, command='', commandData=''):
        DataBasePartyId = "D" + str(self.partyID)
        if command == "song":
            songLink = webscrape.get_soundclown(commandData)
            #songLink = webscrape.get_video(commandData)
            if songLink: 
                insertion.insertSong(str(DataBasePartyId), 'https://soundcloud.com' + songLink, songLink[1:].replace('/', '_'), "1", Username)
        elif command == "rsong":
            query.DeleteSong(str(DataBasePartyId), commandData.split(" ")[0])
        elif command == "nextsong":
            song_list = query.getSongOrder(DataBasePartyId, 1)
            song = query.pop(str(DataBasePartyId))
            insertion.insertPrevSong(str(DataBasePartyId), song_list[0])
        elif command == "vote":#command
            song = commandData.split("=")
            if(int(song[1]) > 0):
                curr_song_vote_count = query.getSongOrder(str(DataBasePartyId), 2)[0]
                next_song_vote_count = query.getSongOrder(str(DataBasePartyId), 2)[1]+1
                curr_topsong = query.getSongOrder(str(DataBasePartyId), 1)[0]
                query.upVote(str(DataBasePartyId), song[0], song[1])
                
                if(curr_song_vote_count <= next_song_vote_count):
                    query.upVote(str(DataBasePartyId), curr_topsong, str(next_song_vote_count-curr_song_vote_count))
            else:
                query.downVote(str(DataBasePartyId), song[0], song[1])
        elif command == 'disconnect':
            query.deleteDatabase(str(DataBasePartyId))
            return
        return self.send_data(str(DataBasePartyId)) 


    def send_data(self, DataBasePartyId):
        url_list     = query.getSongOrder(DataBasePartyId, 0)
        song_list    = query.getSongOrder(DataBasePartyId, 1)
        vote_list    = query.getSongOrder(DataBasePartyId, 2)
        usermap_list = query.getSongOrder(DataBasePartyId, 3)
        
        que = ""
        if(song_list):
            length = len(song_list)
        else:
            return ' '
        for i in range(length) :
            que += song_list[i].replace(" ", "_") + " " + str(vote_list[i]) + " " + str(usermap_list[i].replace(" ", "_")) + " " + str(url_list[i])
            if(i < length-1):
                que += "\n"
        if len(que) == 0: 
            return ""
        print("Data: "+que+"\n\n")
        return que

 
#PartyID hashID name Adam Brandt_song yes indeed  
#hashID name host
def server_controller(userType, PartyID='', Username='', command='', commandData=''):
    global ServerList
    if userType == "host":
        PartyID = random.randint(0, 1000000)
        if not Startup.DB_Exists("D"+str(PartyID)):
            NewServer = server(PartyID)
            Startup.createDatabase("D"+str(PartyID))
            ServerList.append(NewServer)
        return str(PartyID)
    elif userType == "client":
        code = False
        for i in ServerList:
            if(i.partyID == int(PartyID)):
                if command == 'disconnect':
                    i.client_handle(Username=Username, command=command, commandData=commandData)
                    del i
                    return
                else:
                    PartyData = i.client_handle(Username=Username, command=command, commandData=commandData)
                if command:
                    if PartyData:
                        return str(PartyData)
                    else:
                        return 
                code = True
                print("Success")
                return 'true'
        if(not code) :
            if Startup.DB_Exists("D"+str(PartyID)):
                NewServer = server(int(PartyID))
                ServerList.append(NewServer)
                return 'true'
            print("Invalid Code: "+str(PartyID))
            return ''
    else:
        print("Error in sent data")
        return 'error'
