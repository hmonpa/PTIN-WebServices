// modelos/vuelo.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.plugin(schema => { schema.options.usePushEach = true });

const vueloSchema = new Schema({
    name: {
	type: String,
	required: true,
	unique: true
    },
    airline: {				
	type: String,
	required: true,
	enum: ['IBERIA', 'Vueling', 'AirEuropa', 'Vilanova Airlines', 'QATAR Airways', 'KLM']		// CAMBIO SPRINT6
	},
    type: {
	type: String,
	enum: ['Salida', 'Llegada']
    },
    from: {
	type: String,
	required: true
    },
    to: {
	type: String,
	required: true,
    },
    boarding_time: {
	type: Date,
    	required: true
    },
    departure_time: {
	type: String,
	required: true
    },
    arrival_time: {
	type: String,
        required: true
    },
    date: {
	type: Date,
	required: true
    },
    gate: {
	name: {
		type: String,
		required: true
	},
	location_x: {			
		type: Number,
		required: true
	},
	location_y: {			
		type: Number,
		required: true
	}
    },				
    state: {				
	type: String,
	enum: ['En hora', 'Cancelado', 'Con retraso'],		
	default: 'En hora'
    }
});

module.exports = mongoose.model('Flight', vueloSchema);
