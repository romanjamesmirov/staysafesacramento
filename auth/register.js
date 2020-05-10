const Joi = require('@hapi/joi');

module.exports = data => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(256).required(),
		username: Joi.string().min(2).max(256).required(),
		password: Joi.string().min(8).max(1024).required(),
		have: Joi.array().required(),
		need: Joi.array().required()
	});
	return schema.validate(data);
};