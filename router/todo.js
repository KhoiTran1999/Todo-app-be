const express = require("express");
const jwtAuth = require("../middleware/jwtAuth");
const router = express.Router();
const controller = require("../controller/todo");
const validator = require("../middleware/validator");
const { addTodoSchema, udpateTodoSchema } = require("../validation/todoSchema");

router.get("/", jwtAuth, controller.getTodo);

router.post("/", jwtAuth, validator(addTodoSchema), controller.addTodo);

router.delete("/:id", jwtAuth, controller.deleteTodo);

router.patch(
  "/:id",
  jwtAuth,
  validator(udpateTodoSchema),
  controller.updateTodo
);

module.exports = router;
