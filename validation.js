const Joi = require('@hapi/joi');

module.exports.registerValidation = data => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(256).required(),
		username: Joi.string().min(2).max(256).required(),
		password: Joi.string().min(8).max(1024).required()
	});
	return schema.validate(data);
}

module.exports.loginValidation = data => {
	const schema = Joi.object({
		username: Joi.string().min(2).max(256).required(),
		password: Joi.string().min(8).max(1024).required()
	});
	return schema.validate(data);
}