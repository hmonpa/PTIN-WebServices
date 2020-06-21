// middlewares/auth.js

const servicios = require('../servicios/index');
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const moment = require('moment')

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());

async function isAuth (req, res, next) {
    const token = req.headers['miclavesecreta']
    if (!token) {
        return res.status(403).json({Error:"Acceso denegado, acude a los ingenieros y consigue un Token"});
    }
    else {
	// Payload
        const payload = jwt.decode(token, config.SECRET_TOKEN);
        jwt.verify(token, config.SECRET_TOKEN, (err, admin) => {
            if (payload.exp <= moment().unix()) {
                return res.status(500).json({Error: "El token ha expirado"})
            }
            if (err) {
                return res.status(401).json({Error: "No tienes acceso"})
            }
            else {
                if (payload.sub != "Jefe"){
                    if (payload.sub == "Controlador vuelos"){
                        res.status(210)
                    }
                    else {
                        res.status(220)
                    }
                }
                else {
                    res.status(200)
                }
                next();
            }
        });
    }
}

module.exports = isAuth;
