const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator');
const { registerSchema, loginShema } = require('../validation/userSchema');
const controller = require('../controller/auth');
const refreshJwtAuth = require('../middleware/refreshJwtAuth');
// const rateLimiter = require('../middleware/limiter');

router.post('/register', validator(registerSchema), controller.register);

router.post(
  '/login',
  // rateLimiter(2 * 60 * 1000, 10),
  validator(loginShema),
  controller.login,
);

router.post(
  '/verifyEmail',
  // rateLimiter(2 * 60 * 1000, 10),
  controller.verifyEmail,
);

router.get('/checkEmailToken/:token', controller.checkEmailToken);

router.get('/cookie/getToken', controller.getToken);

router.get('/cookie/refreshToken', refreshJwtAuth, controller.refreshToken);

router.delete('/cookie/clearToken', controller.clearToken);

module.exports = router;
