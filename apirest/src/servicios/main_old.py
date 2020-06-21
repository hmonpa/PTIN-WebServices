from socketclient import Client
from random import randrange
import socketio
import time

sio = None
try:
    #ssl_verify = False
    sio = socketio.Client(ssl_verify=False)
    sio.connect("https://localhost:3003")
except socketio.exceptions.ConnectionError:
    print('[ERROR] Server is off')

@sio.event
def notification(data):
    print('[INFO] Notification: ', data)


@sio.event
def message(data):
    print('[INFO] Message: ', data)


@sio.event
def bad_status(data):
    print('[ERROR] Bad status:', data)


@sio.event
def bad_notify(data):
    print('[ERROR] Bad notify:', data)


@sio.event
def connect():
    socket.isConnected = True
    socket.send('id', socket.id)
    print("[INFO] Connected!")


@sio.event
def connect_error():
    print("[ERROR] The connection failed!")


@sio.event
def disconnect():
    socket.isConnected = False
    print("[INFO] Disconnected!")


socket = Client(sio, "CH0001")

running = True
while running:
    option = input(' -pres q to exit \n -pres p update position \n -pres s to update status\n')
    if option == 'q':
        running = False
    elif option == 'p':
        socket.update_position(randrange(10), randrange(10))
    elif option == 's':
        socket.update_status(randrange(3))


socket.disconnect()

print('END')

