const express = require("express");
const router = express.Router();
const controller = require("../controller/todo");
const validator = require("../middleware/validator");
const { addTodoSchema, udpateTodoSchema } = require("../validation/todoSchema");

router.get("/", controller.getTodo);

router.post("/", validator(addTodoSchema), controller.addTodo);

router.delete("/:id", controller.deleteTodo);

router.patch("/:id", validator(udpateTodoSchema), controller.updateTodo);

module.exports = router;
