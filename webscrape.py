from urllib.parse import quote
import urllib.error
from bs4 import BeautifulSoup as bs
from urllib.request import Request, urlopen
import urllib.request
import requests

def get_video(search): 
   newSearch = quote(search)
   url = ("http://www.youtube.com/results?search_query=") + newSearch
   req = urllib.request.Request(url)
   oreq = urlopen(req)
   webpage = oreq.read()
   soup = bs(webpage, 'html.parser')
   vids = soup.find(attrs = { 'class':'yt-uix-tile-link' })
   IDindex = vids['href'].find('=')
   id = vids['href'][IDindex+1:]
   if "channel" in vids['href']:
      id = soup.findAll(attrs={'class': 'yt-uix-tile-link'})[1]['href']
   return 'http://www.youtube.com/embed/' + id

import re
#Greyson Jones
def get_soundclown(songname='workin out jid'):
   songname = songname.replace(" ", "%20")
   searchquery = "https://soundcloud.com/search?q="+songname
   responce = urlopen(urllib.request.Request(searchquery))
   webpage = responce.read().decode('utf-8')
   search_list = []
   link_list = []
   index_list = [m.start() for m in re.finditer('<li><h2><a href', webpage)]
   for index in index_list:#get the line
      query = ""
      while webpage[index-1] != '\"' or webpage[index] != '>':
         query += webpage[index]
         index += 1
      search_list.append(query)

   for search in search_list:
      beginning_quote_index = search.find("\"")+1
      end_quote_index = search.rfind("\"")
      link_extension = search[beginning_quote_index:end_quote_index]
      link_list.append(link_extension)

   valid_index = 0
   for extention in link_list:
      if extention[1:].find("/") > 0:
         return link_list[valid_index]
      valid_index += 1

   return ""
