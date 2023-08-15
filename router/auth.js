const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const { registerSchema, loginShema } = require("../validation/UserSchema");
const authController = require("../controller/auth");
const jwtAuth = require("../middleware/jwtAuth");

router.post(
  "/register",
  jwtAuth,
  validator(registerSchema),
  authController.register
);

router.post("/login", validator(loginShema), authController.login);

router.post("/verifyEmail", authController.verifyEmail);

router.get("/checkEmailToken/:token", authController.checkEmailToken);

router.post("/cookie/setToken", authController.setToken);

router.get("/cookie/getToken", authController.getToken);

router.post("/cookie/refreshToken", authController.refreshToken);

module.exports = router;
