const asyncMiddleware = require("../middleware/asyncMiddleware");
const Todo = require("../model/Mysql/Todo");

const getTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const todoList = await Todo.findAll({
    where: { archive: false, userId: user.id },
  });

  res.json({
    success: true,
    data: todoList,
  });
});

const getArchiveTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const todoList = await Todo.findAll({
    where: { archive: true, userId: user.id },
  });

  res.json({
    success: true,
    data: todoList,
  });
});

const getDeletedTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const todoList = await Todo.findAll({
    where: { userId: user.id },
    paranoid: false,
  });

  const deletedTodoList = todoList.filter((val) => !!val.deletedAt);

  res.json({
    success: true,
    data: deletedTodoList,
  });
});

const addTodo = asyncMiddleware(async (req, res, next) => {
  const { title, content, pin = false, reminder = null, color } = req.body;
  const { id: userId } = req.user;

  await Todo.create({ title, content, pin, reminder, color, userId });
  const newTodoList = await Todo.findAll({ where: { userId } });

  res.status(201).json({
    success: true,
    data: newTodoList,
    message: "Added todo successfuly",
  });
});

const deleteTodo = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  await Todo.destroy({ where: { id, userId } });

  res.json({ success: true, message: "Deleted todo successfully" });
});

const deleteTodoPermanently = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  await Todo.destroy({ where: { id, userId }, force: true });

  res.json({ success: true, message: "permanently Deleted todo successfully" });
});

const updateTodo = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, pin, reminder, color, archive } = req.body;
  const { id: userId } = req.user;

  const todo = await Todo.findByPk(id);
  if (!todo) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  if (todo.userId != userId) {
    return res.status(401).json({ success: false, message: "Unauthorize" });
  }

  await Todo.update(
    { title, content, pin, reminder, color, archive },
    { where: { id, userId } }
  );
  res.json({ success: true, message: "Updated todo successfuly" });
});

const restoreTodo = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  await Todo.restore({ where: { id, userId } });

  const todoList = await Todo.findAll({
    where: { userId },
    paranoid: false,
  });

  const deletedTodoList = todoList.filter((val) => !!val.deletedAt);

  res.json({
    success: true,
    data: deletedTodoList,
    message: "Restore todo successfuly",
  });
});

module.exports = {
  getTodo,
  getArchiveTodo,
  getDeletedTodo,
  addTodo,
  deleteTodo,
  deleteTodoPermanently,
  updateTodo,
  restoreTodo,
};
