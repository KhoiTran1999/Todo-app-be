const asyncMiddleware = require("../middleware/asyncMiddleware");
const Todo = require("../model/Mysql/Todo");
const { Op } = require("sequelize");

const getTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { limit } = req.query;

  const todoListPin = await Todo.findAll({
    where: { pin: true, archive: false, userId: user.id },
    order: [["id", "DESC"]],
  });

  const todoListUnpin = await Todo.findAll({
    where: { pin: false, archive: false, userId: user.id },
    order: [["id", "DESC"]],
    limit: Number(limit),
  });

  const allTodoList = [...todoListPin, ...todoListUnpin];

  res.json({
    success: true,
    data: allTodoList,
  });
});

const getArchiveTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { limit } = req.query;

  const pinTodoList = await Todo.findAll({
    where: { pin: true, archive: true, userId: user.id },
    order: [["id", "DESC"]],
  });

  const todoList = await Todo.findAll({
    where: { pin: false, archive: true, userId: user.id },
    order: [["id", "DESC"]],
    limit: Number(limit),
  });

  const allTodoList = [...pinTodoList, ...todoList];

  res.json({
    success: true,
    data: allTodoList,
  });
});

const getDeletedTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;

  const todoList = await Todo.findAll({
    where: { userId: user.id },
    order: [["id", "DESC"]],
    paranoid: false,
  });

  const deletedTodoList = todoList.filter((val) => !!val.deletedAt);

  res.json({
    success: true,
    data: deletedTodoList,
  });
});

const getAllTodo = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const { limit } = req.query;

  const todoList = await Todo.findAll({
    where: { userId: user.id },
    order: [["id", "DESC"]],
    limit: limit ? Number(limit) : undefined,
  });

  res.json({
    success: true,
    data: todoList,
  });
});

const getSearchTodo = asyncMiddleware(async (req, res, next) => {
  const value = req.query.value;
  const { limit } = req.query;

  const todoList = await Todo.findAll({
    where: {
      [Op.or]: [
        {
          title: { [Op.substring]: `%${value}%` },
        },
        {
          content: { [Op.substring]: `%${value}%` },
        },
      ],
    },
    order: [["id", "DESC"]],
    limit: Number(limit),
  });

  res.json({
    success: true,
    data: todoList,
  });
});

const addTodo = asyncMiddleware(async (req, res, next) => {
  const { title, content, pin = false, reminder, color } = req.body;
  const { id: userId } = req.user;

  await Todo.create({ title, content, pin, reminder, color, userId });
  const newTodoList = await Todo.findAll({
    where: { userId },
    order: [["id", "DESC"]],
  });

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
    order: [["id", "DESC"]],
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
  getAllTodo,
  getSearchTodo,
  addTodo,
  deleteTodo,
  deleteTodoPermanently,
  updateTodo,
  restoreTodo,
};
