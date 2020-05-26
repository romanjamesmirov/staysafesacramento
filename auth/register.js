const Joi = require('@hapi/joi');

module.exports = data => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(256).required(),
		username: Joi.string().min(2).max(256).required(),
		password: Joi.string().min(8).max(1024).required(),
		have: Joi.array().required(), // Question: 
		need: Joi.array().required() // require at least one supply? 
		// also check for dupes in both arrays. in fact, validate that the arrays don't contain anything else but our supplies
	});
	return schema.validate(data);
};