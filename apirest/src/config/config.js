// config/config.js
// Fichero de configuración
const express = require("express");				// Framework de NODE, crea nuestra estructura del servidor
const app = express();
const mongoose = require('mongoose');
  			
module.exports = {
	SECRET_TOKEN: 'miclavesecreta'
}

app.set('json spaces', 2);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);		

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';		// Variable de entorno de desarrollo



