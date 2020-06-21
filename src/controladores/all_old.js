// controladores/all.js
const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const express = require('express');
const app = express();	
const bcrypt = require('bcryptjs');				// Hashing password
var server = require('http').Server(express);
var io = require('socket.io')(server);

// Métodos utilizables dentro de las rutas

const Operator = require('../modelos/operador');      		// Constructor Operador
const Passenger = require('../modelos/pasajero');      		// Constructor Pasajero
const Flight = require('../modelos/vuelo');            		// Constructor Vuelo
const Shop = require('../modelos/tienda');          		// Constructor Tienda
const Node = require('../modelos/nodo');              		// Constructor Nodo
const Stop = require('../modelos/stop');			// Constructor Stop
const Boarding = require('../modelos/boarding_passes');		// Constructor Boarding_passes

module.exports = {
	// Pedir coche
	pedirCoche: async (req,res,next) => {
	    const {idOrigen, idDestino} = req.body;	
	    console.log('Petición de coche para recoger en:', idOrigen, 'y llevar el pasajero a:', idDestino);
	    cotxes["CH0001"].emit('notification', idOrigen + ":" + idDestino); 				// ejemplo de notificación a un solo coche
	    res.status(200).json({message1: 'Recoger pasajero en:', idOrigen, message2: 'y llevar pasajero a:', idDestino});
	},
	// Métodos de operadores
        indexOperador: async (req,res,next) => {                 		// (GET)Módulo index: Controla las rutas iniciales de operadores de la API
            const operador = await Operator.find({});
            res.status(200).json(operador);
        },
        nuevoOperador: async (req,res,next) => {                 		// (POST) Módulo NuevoOperador: Añade un operador a la base de datos
            const nuevoOperador = new Operator(req.body);
            const {id, name, email, birthdate, phone, password, airline} = req.body;
            if (id && name && email && birthdate && phone && password && airline){
                const operador = await nuevoOperador.save();
                res.status(200).json({message: 'Registro correcto'});
            }
            else {
                res.status(500).json({error: 'Operador mal introducido, revise los campos'});
            }
        },
        obtenerOperador: async (req,res,next) => {               		// (GET) Módulo ObtenerOperador: Muestra un operador de la base de datos filtrando por su ID
            const { opId } = req.params;
            const operador = await Operator.findById(opId);
            res.status(200).json(operador);
        },

        // Métodos de pasajeros
        indexPasajero: async (req,res,next) => {                 		// (GET) Módulo index: Controla las rutas iniciales de pasajeros de la API
            if(res.statusCode== 200 || res.statusCode == 220){
                const pasajero = await Passenger.find({});
                res.status(200).json(pasajero);
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        nuevoPasajero: async (req,res,next) => {                 		// (POST) Módulo NuevoPasajero: Añade un pasajero a la base de datos
            const nuevoPasajero = new Passenger(req.body);
            const {id, name, email, birthdate, phone, password, country, city, location_x, location_y, url_image} = req.body;
            if (id && name && email && birthdate && phone && password && country && city && location_x && location_y){
                try {
                    const pasajero = await nuevoPasajero.save();
                    res.status(200).json(pasajero);
		} catch (err) {
			return res.status(500).json({error: 'Pasajero mal introducido, revise los campos'});
                }
            }
            else {
                res.status(500).json({error: 'Faltan datos obligatorios por introducir'});
            }
        },
	loginApp: async(req,res,next) => {
            const id = req.body.id;
            const password = req.body.password;
            const pasajero = await Passenger.findOne({id})
	   .then(passenger => {
			return bcrypt.compare(password, passenger.password);
	    })
	    .then(async function(samePassword) {
       	    	if (!samePassword) {
            		return res.status(401).json({Error: `Contraseña ${password} incorrecta`})
            	}
		else {
			const pasajero = await Passenger.findOne({id});
			return res.status(200).json(pasajero);
		}
	    })
	    .catch(function(error){
 	    	return res.status(401).json({Error: `Usuario ${id} incorrecto`})
      	    });
        },
       //Este es el que usará, añades un gusto y se te unen las tiendas directamente con sus ofertas
        anadirGusto: async (req,res,next) =>{
            const {id, likes} = req.body;
            const pasajero = await Passenger.findOne({id});
            for(var i = 0 ; i < likes.length; ++i){
                pasajero.likes.push(likes[i]);
                const type = likes[i].typelike
                const tiendas = await Shop.find({type});
                for(var j= 0; j < tiendas.length; ++j){
                    const serv ={
                        name: tiendas[j].name,
                        promotions: tiendas[j].promotions
                    }
                    pasajero.likes[pasajero.likes.length-1].newsletter.push(serv);
                }
            }
            const antiguoPasajero = await Passenger.findOneAndUpdate({id}, pasajero);
            res.status(200).json(antiguoPasajero);
        },
        // Pasajero que decide quitar un gusto de su colección
        eliminarGustoPasajero: async (req,res,next)=>{
            const {id, typelike} = req.body;
            const pasajero = await Passenger.findOne({id});
            const elimina = pasajero.likes.findIndex(function(item,i){
                return item.typelike==typelike
            });
            pasajero.likes.splice(elimina,1);
            await Passenger.findOneAndUpdate({id}, pasajero);
            res.status(200).json({mssg: "Se ha eliminado el gusto del pasajero"});
        },
        //Esto es para hacerlo paso por paso, iriía ligado con el anterior pero el de arriba es todo en uno (se puede quitar)
        anadirNoticiasPasajero: async (req, res, next) => {
            const {type, id} = req.body;
            const tiendas = await Shop.find({type});
            const pasajero = await Passenger.findOne({id});
            var indice = 0;
            for(var i = 0, x= new Boolean(false); i< pasajero.likes.length && x == false; i++){
                if(pasajero.likes[i].typelike == type){
                    x = true;
                    indice = i;
                }
            }
            for(var j= 0; j<tiendas.length; ++j){
                const tienda = {
                    name: tiendas[j].name,
                    promotions: tiendas[j].promotions
                }
                pasajero.likes[indice].newsletter.push(tienda);
            }
            const antiguoPasajero = await Passenger.findOneAndUpdate({id}, pasajero);
            res.status(200).json({mssg: "Se han añadido nuevas noticias"})
        },
        movimientoPasajero: async (req,res,next) => {
            const {id, location_x, location_y} = req.body;
            const pasajero = req.body;
            const antiguoPasajero = await Passenger.findOneAndUpdate({id}, pasajero);
            res.status(200).json({mssg:"Posición del pasajero cambiada"});
        },
        obtenerPasajero: async (req,res,next) => {                              // (GET) Módulo ObtenerPsajero: Muestra un pasajero de la base de datos filtrando por su ID
            const { PassId } = req.params;
            const pasajero = await Passenger.findById(PassId);
            res.status(200).json(pasajero);
        },
        eliminarPasajero: async(req,res,next) =>{
            if(res.statusCode == 200){
                const {id} = req.body;
                const pasajero = await Passenger.findOneAndDelete({id});
                res.status(200).json({mssg: "Pasajero eliminado correctamente"})
            }
            else res.status(403).json({Error: "No tienes autorización"})
            
        },
        cambiarImagen: async (req,res,next) =>{
            const {id} = req.body;
            const pass = req.body
            const pasajero = await Passenger.findOneAndUpdate({id}, pass);
            res.status(200).json({mssg: "Imagen modificada correctamente"})
        },
        nuevoAviso: async (req,res,next) => {
            const {name, notices} = req.body;
            const tarjetas = await Boarding.find({})
            const pasajero = await Passenger.find({})
            for (var i=0; i<tarjetas.length; i++){
                if (tarjetas[i].flights == name){
                    const j = pasajero.findIndex(function(item,a){
                        return item.id==tarjetas[i].id_passenger
                    });
                    if(j!=-1){
                        pasajero[j].notices.push(notices);
                        await Passenger.findOneAndUpdate({id:pasajero[j].id}, pasajero[j]);
                    }
                }
                
            }
            res.status(200).json({message: "Aviso enviado correctamente"});
        },
        //Creo que no hace falta.
        reemplazarAviso: async (req,res,next) => {
            const {name, notices} = req.body;
            const tarjetas = await Boarding.find({})
            const pasajero = await Passenger.find({})
            for (var i=0; i<tarjetas.length; i++){
                if (tarjetas[i].flights == name){
                    for (var j=0; j<pasajero.length; j++){
                        if (pasajero[j].id == tarjetas[i].id_passenger){
                            for(var k=0; k<pasajero[j].notices.length; k++){
                                if (pasajero[j].notices[k].id == notices.id){
                                    pasajero[j].notices.splice(k,1)
                                    pasajero[j].notices.push(notices);
                                    await Passenger.findOneAndUpdate({id:pasajero[j].id}, pasajero[j]);
                                }
                            }
                        }
                    }
                }
                
            }
            res.status(200).json(pasajero);
        },
	// Eliminar aviso
	eliminarAviso: async (req,res,next) => {
	const {id, id_notice} = req.body;
	const pasajero = await Passenger.findOne({id});

	const elimina = pasajero.notices.findIndex(function(item,i){
		return item._id == id_notice
	})
	console.log(elimina)
	if(elimina!=-1){
		pasajero.notices.splice(elimina,1);
	}
	await Passenger.findOneAndUpdate({id}, pasajero)
	res.status(200).json({mssg: "Aviso eliminado"})
	},
	// Nuevas peticiones peticiones coches
	/*cocheMasCercano: async(req,res,next) => {
		const {id, location_x, location_y} = req.body;
		const pasajero = await Passenger.findOne({id});
		const coches = await Node.find({})
		var locationx, locationy, minim=100000, result, car;
		for (var i=0; i<coches.length; i++){
			locationx = coches[i].location_x - pasajero.location_x;
			locationy = coches[i].location_y - pasajero.location_y;
			result = locationx + locationy;
			if (result < minim) 
			{
				minim = result			// Coche más cercano
				car = coches[i].id
			}
		}
		res.status(200).json({message: 'Coche enviado más cercano:', car});
	},
	paradaMasCercana: async(req,res,next) => {
		const {id, location_x, location_y} = req.body;
		const pasajero = await Passenger.findOne({id});
		const paradas = await Stop.find({})
		var locationx, locationy, minim=100000, result, paradacercana;
		for (var i=0; i<paradas.length; i++){
			locationx = paradas[i].location_x - pasajero.location_x;
			locationy = paradas[i].location_y - pasajero.location_y;
			result = locationx + locationy;
			if (result < minim) 
			{
				minim = result			// Parada más cercana
				paradacercana = paradas[i].id
			}
		}
		res.status(200).json({message: 'Parada más cercana al pasajero:', paradacercana});
	},
	cocheEnParada: async(req,res,next) => {
		const {id} = req.body;
		const coche = await Node.findOne({id})
		const paradas = await Stop.find({})
		for (var i=0; i<paradas.length;i++){
			if (coche.location_x == paradas[i].location_x && coche.location_y == paradas[i].location_y){
				var status = 4;
				await Node.findOneAndUpdate({ id: coche.id }, {$set:{state: status}})
			}
		}
		if (coche.state == 4) res.status(200).json({message: 'El coche está en la parada'});
		else res.status(200).json({message: 'El coche aún no se encuentra en la parada'});
	},*/
        // Métodos de vuelos
        indexVuelo: async (req,res,next) => {                   		// (GET) Modulo index: Controla las rutas iniciales de vuelos de la API
            if(res.statusCode== 200 || res.statusCode == 210){
                const vuelo = await Flight.find({});
                res.status(200).json(vuelo);
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        nuevoVuelo: async (req,res,next) => {                   		// (POST) Módulo NuevoVuelo: Añade un vuelo a la base de datos
            if(res.statusCode== 200 || res.statusCode==210){
                const nuevoVuelo = new Flight(req.body);
                const {name, airline, from, to, boarding_time, departure_time, arrival_time, date, gate} = req.body;
                if (nuevoVuelo.from == 'Vilanova T2'){
                    nuevoVuelo.type = 'Salida';
                }
                else if (nuevoVuelo.to == 'Vilanova T2'){
                    nuevoVuelo.type = 'Llegada';
                }
                else if (nuevoVuelo.to != 'Vilanova T2' && nuevoVuelo.from != 'Vilanova T2'){
                    return res.status(404).json({error: 'El vuelo introducido no opera en esta terminal'});
                }
                if (name && airline && from && to && boarding_time && departure_time && arrival_time && date && gate){
                        try {
                            const vuelo = await nuevoVuelo.save();
                            res.status(200).json(vuelo);
                        }	
                        catch(error){
                            res.status(404).json({error: "Datos mal introducidos"})
                        }
                    }
                else {
                    return res.status(500).json({error: 'Faltan datos obligatorios por introducir'});
                }
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        // Se puede quitar
        /*nuevoPasajeroVuelo: async (req,res,next) =>{
            
            const {name, passenger} = req.body;
            const vuelo = await Flight.findOne({name});
            vuelo.passengers.push(passenger);
            const antiguovuelo = await Flight.findOneAndUpdate({name}, vuelo);
            res.status(200).json(antiguovuelo);
        },*/
        obtenerVuelo: async (req,res,next) => {                 		// (GET) Módulo ObtenerVuelo: Muestra un vuelo de la base de datos filtrando por su ID
            if(res.statusCode== 200 || res.statusCode==210){
                const { name } = req.body;
                const vuelo = await Flight.findOne({name})
                res.status(200).json(vuelo);
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
	    reemplazarStateVuelo: async (req,res,next) => {            
            if(res.statusCode== 200 || res.statusCode==210){
                const { name } = req.body;
                const vuelo = req.body;
                const antiguoVuelo = await Flight.findOneAndUpdate({name}, vuelo);
                res.status(200).json('Vuelo modificado en la base de datos');
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },	
        eliminarVuelo: async (req,res,next) => {                		// (DELETE) Módulo EliminarVuelo: Elimina un vuelo filtrando por su ID
            if(res.statusCode== 200 || res.statusCode==210){
                const { name } = req.body;
                await Flight.findOneAndRemove({name: name}, function(err, vuelo) {
                    if (err) return res.status(500).send({ message: err });
                    if (!vuelo) return res.status(404).json({Error: 'Vuelo introducido no existe'});
                    else  res.status(200).json('Vuelo eliminado de la base de datos');
                })
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },

	// Métodos de tiendas
        indexTienda: async (req,res,next) => {                  		 // (GET) Modulo index: Controla las rutas iniciales de tiendas de la API
            if(res.statusCode== 200){
                const tienda = await Shop.find({});
                res.status(200).json(tienda);
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        nuevaTienda: async (req,res,next) => {                   		// (POST) Módulo NuevaTienda: Añade una tienda a la base de datos
            if(res.statusCode== 200){
                const nuevaTienda = new Shop(req.body);
                const {id, name, product_name, location_x, location_y, type} = req.body;
                if (id && name && product_name && location_x && location_y && type){
                    try {
                        const tienda = await nuevaTienda.save();
                        const tiendaplus = {name: name};
                        //Esto ocurrirá en caso de añadir una nueva tienda(poco probable puesto que es un negocio nuevo)
                        const pasajeros = await Passenger.find({})
                        for(var i =0; i<pasajeros.length; ++i){
                            for(var j = 0; j < pasajeros[i].likes.length; ++j){
                                if(pasajeros[i].likes[j].typelike == type){
                                    pasajeros[i].likes[j].newsletter.push(tiendaplus);
                                    await Passenger.findOneAndUpdate({id: pasajeros[i].id}, pasajeros[i]);
                                }
                            }
                        }
                        res.status(200).json({message: 'Tienda introducida correctamente'});
                    } catch (err) {
                        return res.status(500).json({error: 'Datos mal introducidos'});	
                    }
                }
                else {
                    res.status(500).json({error: 'Faltan datos obligatorios por introducir'});
                }
            }
            else res.status(403).json({Error: "No tienes autorización"})
            
        },
        obtenerTienda: async (req,res,next) => {                 		// (GET) Módulo ObtenerTienda: Muestra una tienda de la base de datos filtrando por su ID
            if(res.statusCode== 200){
                const { IdShop } = req.params;
                const tienda = await Shop.findById(IdShop);
                res.status(200).json(tienda); 
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        nuevaOfertaTienda: async (req,res,next) =>{
            if(res.statusCode== 200){
                const {name, promotion, type} = req.body;
                const tienda = await Shop.findOne({name});
                tienda.promotions.push(promotion);
                const antiguatienda = await Shop.findOneAndUpdate({name}, tienda);
            // Esto ocurrirá en caso de añadir una nueva oferta de una tienda
                const pasajeros = await Passenger.find({})
                for(var i =0; i<pasajeros.length; ++i){
                    for(var j = 0; j < pasajeros[i].likes.length; ++j){
                        if(pasajeros[i].likes[j].typelike == type){
                        for(var a = 0; a< pasajeros[i].likes[j].newsletter.length; ++a){
                                if(pasajeros[i].likes[j].newsletter[a].name == name){
                                    pasajeros[i].likes[j].newsletter[a].promotions.push(promotion);
                                    await Passenger.findOneAndUpdate({id:pasajeros[i].id}, pasajeros[i]);
                                }
                            }
                        }
                    }
                }
                res.status(200).json(antiguatienda);
            }
            else res.status(403).json({Error: "No tienes autorización"})
            
        },
        //Eliminar una oferta de una tienda
        eliminarOfertaTienda: async (req,res,next) =>{
            if(res.statusCode== 200){
                const {name, promotion} = req.body;
                const tienda = await Shop.findOne({name});
                const elimina = tienda.promotions.findIndex(function(item,i){
                    return item.offer==promotion;
                });
                tienda.promotions.splice(elimina,1);
                await Shop.findOneAndUpdate({name}, tienda);
                //Esto ocurrirá en caso de eliminar una oferta de una tienda
                const pasajeros = await Passenger.find({})
                for(var i =0; i<pasajeros.length; ++i){
                    for(var j = 0; j < pasajeros[i].likes.length; ++j){
                        if(pasajeros[i].likes[j].typelike == tienda.type){
                            for(var a = 0; a< pasajeros[i].likes[j].newsletter.length; ++a){
                                if(pasajeros[i].likes[j].newsletter[a].name == name){
                                    const elimina2 = pasajeros[i].likes[j].newsletter[a].promotions.findIndex(function(item,i){
                                        return item.offer==promotion
                                    });
                                    pasajeros[i].likes[j].newsletter[a].promotions.splice(elimina2,1);
                                    await Passenger.findOneAndUpdate({id:pasajeros[i].id}, pasajeros[i]);
                                }
                            }
                        }
                    }
                }
                res.status(200).json({mssg: "Se ha eliminado una oferta"});
            }
            else res.status(403).json({Error: "No tienes autorización"})
            
        },
        // Eliminar tienda también incluye la eliminación de dicha tienda de los gustos de los clientes. (poco probable eliminar una tienda)
        eliminarTienda: async (req,res,next) => {                		// (DELETE) Módulo EliminarTienda: Elimina una tienda filtrando por su ID
            if(res.statusCode== 200){
                const { name } = req.body;
                await Shop.findOneAndRemove({name}, async function(err, shop) {
                    if (err) return res.status(500).send({ message: err });
                    if (!shop) return res.status(404).json({Error: 'Tienda introducida no existe'});
                    else{
                        const pasajeros = await Passenger.find({})
                        for(var i =0; i<pasajeros.length; ++i){
                            for(var j = 0; j < pasajeros[i].likes.length; ++j){
                                if(pasajeros[i].likes[j].typelike == shop.type){
					const elimina = pasajeros[i].likes[j].newsletter.findIndex(function(item,i){
                                        return item.name==name
				});
				pasajeros[i].likes[j].newsletter.splice(elimina,1);
				await Passenger.findOneAndUpdate({id: pasajeros[i].id}, pasajeros[i]);
				}
			   }
			}
                        res.status(200).json('Tienda eliminada de la base de datos');
                    }
	     });
	}
        else res.status(403).json({Error: "No tienes autorización"})
        },
	// Métodos de nodos
	    indexNodo: async (req,res,next) => {                   	  		// (GET) Modulo index: Controla las rutas iniciales de nodos de la API
            if(res.statusCode== 200 || res.statusCode == 220){
                const nodo = await Node.find({});
            	res.status(200).json(nodo);
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        nuevoNodo: async (req,res,next) => {              			// (POST) Módulo NuevoNodo: Añade un nodo a la base de datos
            if(res.statusCode== 200 || res.statusCode == 220){
                const nuevoNodo = new Node(req.body);
                const {id, location_x, location_y, destination} = req.body;
                if (id && location_x && location_y && destination){
                    try {
                        const nodo = await nuevoNodo.save();
			res.status(200).json({message: 'Nodo introducido correctamente'});
                    } catch (err) {
                        return res.status(500).json({error: 'Datos mal introducidos'});	
                    }
                }
                else {
                    res.status(500).json({Error: 'Faltan datos obligatorios por introducir'});
                }
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        obtenerNodo: async (req,res,next) => {                 			// (GET) Módulo ObtenerNodo: Muestra un nodo de la base de datos filtrando por su ID
            if(res.statusCode== 200 || res.statusCode == 220){
                const { IdNode } = req.params;
                const nodo = await Node.findById(IdNode);
                res.status(200).json(nodo);
            }
            else res.status(403).json({Error: "No tienes autorización"})
            
        },
        reemplazarStateNodo: async (req,res,next) => {            		// (POST) Módulo ReemplazarAdmin: Actualiza los datos de un admin de la base de datos
            if(res.statusCode== 200 || res.statusCode == 220){
                const { id } = req.body;
                const nodo = req.body;
                const antiguoNodo = await Node.findOneAndUpdate({id}, nodo);
		res.status(200).json('Nodo modificado en la base de datos');
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        eliminarNodo: async (req,res,next) => {                			// (DELETE) Módulo EliminarNodo: Elimina una nodo filtrando por su ID
            if (res.statusCode== 200 || res.statusCode == 220){
                const { id } = req.body;
                await Node.findOneAndRemove({id: id}, function(err, nodo) {
                    if (err) return res.status(500).send({ message: err });
                    if (!nodo) return res.status(404).json({Error: 'Nodo introducido no existe'});
                    else res.status(200).json('Nodo eliminado de la base de datos');
                });
            }
            else res.status(403).json({Error: "No tienes autorización"})  
        },
	// Métodos de Stops
        indexStop: async (req,res,next) => {                   	  
		const stop = await Stop.find({});
		res.status(200).json(stop);
        },
        nuevoStop: async (req,res,next) => {                   
                const nuevoStop = new Stop(req.body);
                const {id, location_x, location_y} = req.body;
                if (id && location_x && location_y){	
                    const stop = await nuevoStop.save();
                    res.json(stop);
                }
                else {
                    res.status(500).json({error: 'Error: Parada mal introducida'});
                }
        },
	// Métodos de Boarding_passes 
	indexBoarding: async (req,res,next) => {
		if(res.statusCode == 200 || res.statusCode == 210){
			const boarding = await Boarding.find({});
			res.status(200).json(boarding);
            	}
		else res.status(403).json({Error: "No tienes autorización"})
        },
        nuevaBoarding: async (req,res,next) => {                   
		const nuevaBoarding = new Boarding(req.body);
		const {id_hash, seat, id_passenger, name_passenger, flights} = req.body;
		if (id_hash && seat && id_passenger && name_passenger && flights){
		        const boarding = await nuevaBoarding.save();
                	res.status(200).json(boarding);
		}
		else {
                	res.status(500).json({error: 'Tarjeta de embarque mal introducida'});
            	}
        },
        obtenerBoarding: async (req,res,next) => {                 		// (GET) Módulo ObtenerVuelo: Muestra un vuelo de la base de datos filtrando por su ID
            const { id_passenger } = req.params;
            const board = await Boarding.findOne({id_passenger})
            res.status(200).json(board);
        },
        eliminaBoarding: async (req,res,next) => {                   
            const {id_hash} = req.body
            await Boarding.findOneAndDelete({id_hash: id_hash}, function(err, flight){
                if (err) res.status(404).json({Error: "Se ha prducido un error"})
                if (!flight) res.status(500).json({Error: "La tarjeta de embarque introducida no existe"});
                else {
                   	res.status(200).json({mssg: "Tarjeta de embarque eliminada correctamente"}) 
                }
            })
        }
};
