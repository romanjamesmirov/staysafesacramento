const Joi = require('@hapi/joi');

module.exports = data => {
	const schema = Joi.object({
		username: Joi.string().min(2).max(256).required(),
		password: Joi.string().min(8).max(1024).required()
	});
	return schema.validate(data);
};