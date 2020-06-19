// modelos/boarding_passes.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardingSchema = new Schema({
    id_hash: {		
	type: String,
	required: true,
	unique: true
    }, 		
    seat: {		
	type: String,
	required: true
    },
    name_passenger: {
	type: String,
	required: true
    },
    id_passenger: {		
	type: String,
	required: true,
	unique: true
    },
    flights: {		
	type: String,
	required: true
    }
});

module.exports = mongoose.model('Boarding_pass', boardingSchema);
