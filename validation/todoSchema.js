const Joi = require('joi');

const title = Joi.string().min(1).max(1000).allow('', null);
const content = Joi.string().min(1).max(20000);
const pin = Joi.boolean();
const reminder = Joi.date().allow(null);
const color = Joi.string();
const archive = Joi.boolean();

const addTodoSchema = Joi.object({
  title,
  content: content.required(),
  pin,
  reminder,
  color,
  archive,
});

const udpateTodoSchema = Joi.object({
  title,
  content,
  pin,
  reminder,
  color,
  archive,
});

module.exports = { addTodoSchema, udpateTodoSchema };
