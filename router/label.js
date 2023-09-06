const express = require("express");
const router = express.Router();
const controller = require("../controller/label");
const validator = require("../middleware/validator");
const { labelSchema } = require("../validation/labelSchema");

router.get("/", controller.getLabel);

router.post("/", validator(labelSchema), controller.addLabel);

router.delete("/:id", controller.deleteLabel);

router.patch("/:id", validator(labelSchema), controller.updateLabel);

router.get("/todoLabel/:labelId", controller.getTodoLabel);

router.post("/todoLabel", controller.addTodoLabel);

router.delete("/todoLabel/:todoId/:labelId", controller.deleteTodoLabel);

module.exports = router;
