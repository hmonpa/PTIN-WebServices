// rutas/all.js 
// Todas las rutas irán aquí
const express = require('express');
const api = express.Router();

const auth = require('../middlewares/auth');

const adminCtrl = require('../controladores/admin');
const operadorCtrl = require('../controladores/all');
const vueloCtrl = require('../controladores/all');
const nodoCtrl = require('../controladores/all');
const pasajeroCtrl = require('../controladores/all');
const tiendaCtrl = require('../controladores/all');
const stopCtrl = require('../controladores/all');
const boardingCtrl = require('../controladores/all');
const jwt = require("jsonwebtoken");
const config = require("../config/config")


// Administradores
api.get('/administrators', adminCtrl.indexAdmin);             		// Ver todos los admins (si los hay)
api.post('/administrators', adminCtrl.nuevoAdmin);            		// Añadir un nuevo administrador
api.get('/administrators/:adminId', adminCtrl.obtenerAdmin);     	// Ver un admin en concreto por su ID
api.put('/administrators/:adminId', adminCtrl.reemplazarAdmin);  	// Actualizar un administrador en concreto por su ID
api.delete('/administrators/eliminar', adminCtrl.eliminarAdmin); 	// Eliminar un admin por su ID
api.post('/login', adminCtrl.login);

// Rutas para hacer pruebas
api.get('/test', function(req,res){
	res.json('Prueba: Acceso concedido a ruta pública');
})

api.get('/privateAn', auth, function(req,res){
	if(res.statusCode == 200){
		res.send({mssg: "Eres el jefe del aeropuerto"})
	}
	else if(res.statusCode == 210){
		res.json({job: "Controlador vuelos"})
	}
	else if(res.statusCode == 220){
		res.json({job: "Controlador coches"})
	}
});

// Operadores
api.get('/operators', operadorCtrl.indexOperador);                        
api.post('/operators', operadorCtrl.nuevoOperador);                       
api.get('/operators/:opId', operadorCtrl.obtenerOperador);    
 
// Vuelos
api.get('/flights', vueloCtrl.indexVuelo);                        
api.post('/flights', vueloCtrl.nuevoVuelo);                       
api.post('/flightsOne', vueloCtrl.obtenerVuelo);
api.put('/flights', vueloCtrl.reemplazarStateVuelo);                
api.delete('/flights', vueloCtrl.eliminarVuelo);               	

// Nodos (Coches)
api.get('/nodes', nodoCtrl.indexNodo);                        
api.post('/nodes', nodoCtrl.nuevoNodo);
api.put('/nodes', nodoCtrl.reemplazarStateNodo);                       
api.get('/nodes/:IdNode', nodoCtrl.obtenerNodo);              
api.delete('/nodes', nodoCtrl.eliminarNodo);   


// Pasajeros
api.get('/passengers', pasajeroCtrl.indexPasajero);                      
api.post('/passengers', pasajeroCtrl.nuevoPasajero);                       
api.get('/passengers/:PassId', pasajeroCtrl.obtenerPasajero);	
api.put('/passengers', pasajeroCtrl.anadirGusto);
api.put('/passengersNotices', pasajeroCtrl.anadirNoticiasPasajero);
api.put('/passengersImage', pasajeroCtrl.cambiarImagen);
api.put('/passengersLocation', pasajeroCtrl.movimientoPasajero);
api.delete('/passengersDeleteLike', pasajeroCtrl.eliminarGustoPasajero);
api.delete('/passengers', pasajeroCtrl.eliminarPasajero);
api.put('/passengersAds', pasajeroCtrl.nuevoAviso);
api.put('/passengersChangeAds', pasajeroCtrl.reemplazarAviso);
api.delete('/passengersDeleteAds', pasajeroCtrl.eliminarAviso);
api.post('/loginapp', pasajeroCtrl.loginApp);


//api.post('/cochemascercano', pasajeroCtrl.cocheMasCercano);
api.post('/pedircoche', nodoCtrl.pedirCoche);
//api.post('/proximaparada', pasajeroCtrl.paradaMasCercana);
//api.post('/cocheenparada', nodoCtrl.cocheEnParada);

// Tiendas
api.get('/shops', tiendaCtrl.indexTienda);                        
api.post('/shops', tiendaCtrl.nuevaTienda);                      
api.get('/shops/:IdShop', tiendaCtrl.obtenerTienda);              
api.delete('/shops', tiendaCtrl.eliminarTienda);
api.put('/shops', tiendaCtrl.nuevaOfertaTienda);
api.delete('/shopsElimina', tiendaCtrl.eliminarOfertaTienda);

// Stops (Paradas)
api.get('/stops', stopCtrl.indexStop);                        
api.post('/stops', stopCtrl.nuevoStop); 

// Boarding_passes (Tarjetas de embarque)
api.get('/boarding_passes', boardingCtrl.indexBoarding);
api.post('/boarding_passes', boardingCtrl.nuevaBoarding);
api.get('/boarding_passesOne/:id_passenger', boardingCtrl.obtenerBoarding);                         
api.delete('/boarding_passes', boardingCtrl.eliminaBoarding);

module.exports = api; 
