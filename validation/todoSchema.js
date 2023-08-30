const Joi = require("joi");

const title = Joi.string().min(1).max(20000);
const content = Joi.string().min(1).max(1000);
const pin = Joi.boolean();
const reminder = Joi.date();
const color = Joi.string();

const addTodoSchema = Joi.object({
  title,
  content: content.required(),
  pin,
  reminder,
  color,
});

const udpateTodoSchema = Joi.object({
  title,
  content,
  pin,
  reminder,
  color,
});

module.exports = { addTodoSchema, udpateTodoSchema };
