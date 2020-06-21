// modelos/operador.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const crypto = require('cryptojs');

const operadorSchema = new Schema({
    id: {			// DNI
	type: String,
	required: true,
	unique: true
    },			
    name: {		
	type: String,
	required: true
    },
    email: {		
	type: String,
	required: true,
	unique: true
    },
    birthdate: {		
	type: Date,
	required: true
    },
    phone: {		
	type: String,
	required: true,
	unique: true
    },
    password: {		
	type: String,
	required: true,
	select: false		// Contraseña oculta desde cliente web
    },	
    airline: {		
	type: String,
	required: true
    }
});
/*
operadorSchema.pre('save', function(next) {
	let operador = this;
	if (!operador.isModified('password')) return next()

	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(operador.password, salt, null, (err, hash) => {
			if (err) return next(err)

			operador.password = hash;
			next();
		})
	})
});*/

module.exports = mongoose.model('Operator', operadorSchema);
