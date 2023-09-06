const asyncMiddleware = require("../middleware/asyncMiddleware");
const Label = require("../model/Mysql/Label");
const Todo = require("../model/Mysql/Todo");
const Todo_Label = require("../model/Mysql/Todo_Label");
const ErrorResponse = require("../responses/ErrorResponse");

const getLabel = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const labelList = await Label.findAll({ where: { userId: user.id } });

  res.json({
    success: true,
    data: labelList,
  });
});

const addLabel = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { name } = req.body;

  await Label.create({ name, userId: user.id });
  const newLabelList = await Label.findAll({ where: { userId: user.id } });

  res.status(201).json({
    success: true,
    data: newLabelList,
    message: "Created label successfully",
  });
});

const deleteLabel = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  await Label.destroy({ where: { id, userId: user.id } });
  await Todo_Label.destroy({ where: { labelId: id, userId: user.id } });

  const newLabelList = await Label.findAll({ where: { userId: user.id } });

  res.json({
    success: true,
    data: newLabelList,
    message: "Deleted label successfuly",
  });
});

const updateLabel = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const user = req.user;

  await Label.update({ name }, { where: { id, userId: user.id } });

  const newLabelList = await Label.findAll({ where: { userId: user.id } });

  res.json({
    success: true,
    data: newLabelList,
    message: "Updated label successfuly",
  });
});

//-------------------------------------------------------------------------

const getTodoLabel = asyncMiddleware(async (req, res, next) => {
  const { labelId } = req.params;
  const user = req.user;

  const todo_label = await Todo_Label.findAll({
    where: { labelId, userId: user.id },
    include: [Todo],
  });

  const todoList = todo_label.map((val) => val.Todo);
  res.json({
    success: true,
    data: todoList,
  });
});

const addTodoLabel = asyncMiddleware(async (req, res, next) => {
  const { todoId, labelId } = req.body;
  const user = req.user;

  const todo = await Todo.findOne({ where: { id: todoId, userId: user.id } });
  if (!todo) {
    throw new ErrorResponse(401, "Unauthorize");
  }

  const label = await Label.findOne({
    where: { id: labelId, userId: user.id },
  });
  if (!label) {
    throw new ErrorResponse(401, "Unauthorize");
  }

  await Todo_Label.create({ todoId, labelId, userId: user.id });

  res.status(201).json({
    success: true,
    message: "Add todo-label successfuly",
  });
});

const deleteTodoLabel = asyncMiddleware(async (req, res, next) => {
  const { todoId, labelId } = req.params;
  const user = req.user;

  const todo = await Todo.findOne({ where: { id: todoId, userId: user.id } });
  if (!todo) {
    console.log("vo day");
    throw new ErrorResponse(401, "Unauthorize");
  }

  const label = await Label.findOne({
    where: { id: labelId, userId: user.id },
  });

  if (!label) {
    throw new ErrorResponse(401, "Unauthorize");
  }

  const result = await Todo_Label.destroy({
    where: { todoId, labelId, userId: user.id },
  });

  res.json({
    success: true,
    message: "Delete todo-label successfuly",
  });
});

module.exports = {
  getLabel,
  addLabel,
  deleteLabel,
  updateLabel,
  getTodoLabel,
  addTodoLabel,
  deleteTodoLabel,
};
