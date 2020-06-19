const express = require('express');
// Socket por HTTP
var server = require('http').Server(express);
var io = require('socket.io')(server);

const mongoose = require('mongoose');
const Node = require('../modelos/nodo');			// Módulo coches


/* Socket por HTTPS
const fs = require('fs');
const express = require('express');
const sleep = require('sleep');

const mongoose = require('mongoose');
const Node = require('../modelos/nodo');			// Módulo coches

var https = require('https');
var server = https.createServer({
    key: fs.readFileSync('/home/hector/Escritorio/ProyectoVIA/SPRINT4/APIRest/src/servicios/key.pem'),
    cert: fs.readFileSync('/home/hector/Escritorio/ProyectoVIA/SPRINT4/APIRest/src/servicios/cert.pem')
},express);
var io = require('socket.io')(server);
*/

global.cotxes = {};

server.listen(3003, function() {
	console.log('\nWebSocket corriendo en el puerto 3003');
    	//console.log('\nWebSocket corriendo en https://localhost:3003');
	console.log('_____________________________________________\n');
});

io.on('connection', function(socket) {
    console.log('Un coche se ha conectado');			// Mensaje en API
    socket.emit('message', "Bienvenido al WebSocket");		// Mensaje en WebSocket

    // Mensaje inicial donde el coche indica su ID
    socket.on('id', (id) => {
        console.log('Id del coche: ' + id);
        socket.id = id;
        cotxes[id] = socket;
    });

    // Mensaje que recibe las posiciones X e Y de cada coche y las va actualizando en base de datos
    socket.on('position', async (location_x, location_y) => {
		//console.log('prueba de posicion.')
		await Node.findOneAndUpdate({ id: socket.id }, {$set:{location_x: location_x, location_y: location_y}}, (err, nodo) => {
			if (err) console.log("error");
			console.log('Posición del coche '+socket.id+': ' + location_x + " - " + location_y);
		});
    });

    // Mensaje que recibe el estado de cada coche y lo actualiza en base de datos
    socket.on('status', async (msg) => {
        const status = Number(msg);
        if (status <= 4 && status >= 0) {					// Coche dentro de rango
		await Node.findOneAndUpdate({ id: socket.id }, {$set:{state: status}}, (err, nodo) => {
			if (err) console.log("error");
			console.log('Status del coche '+socket.id+': ' + status);	
		});
		
        }else {
            console.log('Bad status');
            socket.emit('bad_status', "El status no es correcto");		// Coche fuera de rango
        }
    });
    // -- Por el momento no está utilizandose ---
    socket.on('notification', (msg) => {
        if (msg === 'llest' || msg === 'anant' || msg === 'error') {
            console.log('Notificación del coche '+socket.id+': ' + msg);
        }else {
            console.log('Bad notify');
            socket.emit('bad_notify', "La notificación no es correcta");
        }
    });
    // Cuando un coche se desconecta desaparece de la lista
    socket.on('disconnect', (reason) => {
        console.log('Coche '+socket.id+' desconectado');
        delete cotxes[socket.id]
    });

});

const api = express.Router();

//api.post('/pedircoche', nodoCtrl.pedirCoche);
// cotxes["12341"].emit('message', "Benvingut al WebSocket"); // ejemplo de mensaje normal, no sirve para nada
//cotxes["CH0001"].emit('notification', idOrigen + ":" + idDestino);  // Notificación a un solo coche
