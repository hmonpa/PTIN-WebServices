// modelos/admin.js
const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');;
SALT_WORK_FACTOR = 10;

const adminSchema = new Schema({
    id: {		// DNI
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
    password: {		
	type: String,
	required: true,
			// Contraseña oculta desde cliente web
    },
    job: {
	type: String,
	required: true,
	enum: ['Jefe', 'Controlador vuelos', 'Controlador coches']	// CAMBIO SPRINT5
    }
});

adminSchema.pre('save', function(next){
	var admin = this;
	if (!admin.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
		if (err) return next(err);
		
		bcrypt.hash(admin.password, salt, function(err,hash){
			if(err) return next(err);
			admin.password = hash;
			next();
		});
	});
});

adminSchema.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) return cb(err);
		cb (null, isMatch);
	});
};

const Administrator = module.exports = mongoose.model('Administrator', adminSchema);
