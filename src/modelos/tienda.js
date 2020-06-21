// modelos/tienda.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promoSchema = new Schema({
   offer: {
	type: String
   }
});

const tiendaSchema = new Schema({
   id: {
	type: String,
	required: true,
	unique: true
   },
   name: {
	type: String,
	required: true
   },
   product_name: {
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
   },
   type: {
	type: String,
	required: true,
	enum: ['Restauración', 'Ropa', 'Ocio', 'DutyFree', 'Otros']
   },
   url_image: {
	type: String
   },
   promotions: [promoSchema]
});

module.exports = mongoose.model('Shop', tiendaSchema);
