// modelos/stop.js
const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;

const stopSchema = new Schema({			// Paradas de coches
    id: {		
	type: String,
	required: true,
	unique: true
    }, 		
    location_x: {
	type: Number,
	required: true
    },
    location_y: {
	type: Number,
	required: true
    }
});

module.exports = mongoose.model('Stop', stopSchema);
