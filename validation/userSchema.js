const Joi = require('joi');

const email = Joi.string().email().required();
const password = Joi.string().min(1).required();

const registerSchema = Joi.object({
  username: Joi.string().min(4).max(20).required(),
  email,
  password,
});

const loginShema = Joi.object({
  email,
  password,
});

module.exports = { registerSchema, loginShema };
