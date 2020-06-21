// servicios/index.js

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config/config');

function createToken (admin) {
	const payload = {
		sub: admin.job,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix(),	// 30 días de duración
	}
	return jwt.encode(payload, config.SECRET_TOKEN);
}

module.exports = {
	createToken
}
