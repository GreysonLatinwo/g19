#import readHTML
from httpServer import BaseHTTPRequestHandler
import httpServer as SimpleHTTPServer
import httpServer as BaseHTTPServer
import socketserver as SocketServer

import socket
import sys

PORT = 8080

#handles each request from the client
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

class ThreadingSimpleServer(SocketServer.ThreadingMixIn,BaseHTTPServer.HTTPServer):
    pass

server = ThreadingSimpleServer(('', PORT), Handler)
print("Serving HTTP on 0.0.0.0 port",PORT,"...")


try:
    while 1:
        sys.stdout.flush()
        server.handle_request()
except KeyboardInterrupt:
    print("Finished")
#client code name  yes indeed
#host name