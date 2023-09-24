const express = require('express');
const router = express.Router();
const controller = require('../controller/todo');
const validator = require('../middleware/validator');
const { addTodoSchema, udpateTodoSchema } = require('../validation/todoSchema');

router.get('/', controller.getTodo);

router.get('/archive', controller.getArchiveTodo);

router.get('/trash', controller.getDeletedTodo);

router.get('/restore/:id', controller.restoreTodo);

router.get('/all', controller.getAllTodo);

router.get('/search', controller.getSearchTodo);

router.post('/', validator(addTodoSchema), controller.addTodo);

router.delete('/:id', controller.deleteTodo);

router.delete('/permanent/:id', controller.deleteTodoPermanently);

router.patch('/:id', validator(udpateTodoSchema), controller.updateTodo);

module.exports = router;
