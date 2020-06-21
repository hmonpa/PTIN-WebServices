import socketio  # pip install "python-socketio[client]"


class Client:

    def __init__(self, sio, id):
        self.isConnected = False
        self.id = id
        self.sio = sio
        self.sio.emit('id', self.id)

    def update_position(self, lat, lon):
        self.sio.emit('position', (str(lat), str(lon)))

    def update_status(self, status):
        self.sio.emit('status', status)

    def send_notification(self, notify):
        self.sio.emit('notification', notify)

    def send(self, key, msg):
        self.sio.emit(key, msg)

    def disconnect(self):
        self.sio.disconnect()
