// controladores/admin.js
const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const Administrator = require('../modelos/admin');
const bcrypt = require('bcryptjs');        					// Hashing password	  
const servicio = require('../servicios');
const config = require('../config/config.js')
const jwt = require('jsonwebtoken');


async function login (req,res) {
	console.log("login in") //by Heri
    const id = req.body.id;
    const password = req.body.password;
    await Administrator.findOne({id})
    .then (admin => {	 
    	console.log("Comparando, mongoOK") //by Heri
	return bcrypt.compare(password, admin.password);
    })
    .then(async function(samePassword) {
    console.log("algo mal") //by Heri
        if (!samePassword) {
             return res.status(401).json({Error: `Contraseña ${password} incorrecta`})
        }
	else {
		var admin = await Administrator.findOne({id})
        	return res.status(200).json({
			message: 'Login correcto',
			token: servicio.createToken(admin)
        	})
	}
    })
    .catch(function(error){
	return res.status(401).json({Error: `Usuario ${id} incorrecto`})
    });

}

module.exports = {
	login,
        indexAdmin: async (req,res,next) => {					// (GET) Módulo index: Controla las rutas iniciales de administradores de la API
            if(res.statusCode== 200){
                const admin = await Administrator.find({});
                res.json(admin);
            }
            else res.status(403).json({Error: "No tienes autorización"})			
        },
        nuevoAdmin: async (req,res,next) => {             // (POST) Módulo NuevoAdmin: Añade un administrador a la base de datos
            if(res.statusCode== 200){
                const nuevoAdmin = new Administrator(req.body);
                const {id, name, email, password, job} = req.body;
		
            	if (id && name && email && password && job){
                	try {
                        const admin = await nuevoAdmin.save();
                        res.json({message: 'Registro correcto'});
                    } catch (err) {
                            return res.status(500).json({error: 'Administrador mal introducido, revise los campos'});	
                    }
                }
                else {
                        res.status(500).json({error: 'Faltan datos obligatorios por introducir'});
                    }
                }
            else res.status(403).json({Error: "No tienes autorización"})
            
        },
        obtenerAdmin: async (req,res,next) => {               // (GET) Módulo ObtenerAdmin: Muestra un administrador de la base de datos filtrando por su ID
            if(res.statusCode == 200){
                const { adminId } = req.params;
                const admin = await Administrator.findById(adminId);
                res.json(admin);
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        reemplazarAdmin: async (req,res,next) => {            // (POST) Módulo ReemplazarAdmin: Actualiza los datos de un admin de la base de datos
            if(res.statusCode== 200){
                const { adminId } = req.params;
                const nuevoAdmin = req.body;
                const antiguoAdmin = await Administrator.findByIdAndUpdate(adminId, nuevoAdmin);
                res.json('Administrador modificado en la base de datos');
            }
            else res.status(403).json({Error: "No tienes autorización"})
        },
        eliminarAdmin: async (req,res,next) => {       // (DELETE) Módulo EliminarAdmin: Elimina un administrador de la base de datos
            if(res.statusCode== 200){
                const {id, name, job} = req.body;
                if(job == "Jefe"){
                    return res.status(500).json({Error: "No puedes eliminarte a ti mismo"})
                }
                await Administrator.findOneAndRemove({id: id, name: name, job: job}, function(err, admin) {
                    if (err) return res.status(500).send({ message: err });
                    if (!admin) return res.status(404).json({Error: 'El administrador introducido no existe'});
                    else res.json('Administrador eliminado de la base de datos');
                });
            }
            else res.status(403).json({Error: "	No tienes autorización"})
        },
}
