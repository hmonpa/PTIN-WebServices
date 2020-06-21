from socketclient import Client
import socketio
import csv
from random import randrange
import threading
import time


def toni(car_id):
    sio = None
    try:
        sio = socketio.Client(ssl_verify=False)
        sio.connect('http://localhost:3003/')
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

    socket = Client(sio, car_id)

    pos = randrange(469)
    with open('cami.csv', 'r') as file:
        reader = list(csv.reader(file))
        for i in range(pos, len(reader), 2):
            row = reader[i]
            socket.update_position(int(row[0]), int(row[1][1:]))
            time.sleep(3)

        for i in range(0, len(reader), 2):
            row = reader[i]
            socket.update_position(int(row[0]), int(row[1][1:]))
            time.sleep(3)

    socket.disconnect()

    print('End car ', car_id)


threads = list()
for index in range(1, 6):
    car = threading.Thread(target=toni, args=("CH000" + str(index),), daemon=True)
    threads.append(car)
    car.start()

for thread in threads:
    thread.join()

print("Main End")
