const express = require("express");
const router = express.Router();
const validator = require("../middleware/validator");
const { registerSchema, loginShema } = require("../validation/UserSchema");
const controller = require("../controller/auth");
const refreshJwtAuth = require("../middleware/refreshJwtAuth");

router.post("/register", validator(registerSchema), controller.register);

router.post("/login", validator(loginShema), controller.login);

router.post("/verifyEmail", controller.verifyEmail);

router.get("/checkEmailToken/:token", controller.checkEmailToken);

router.get("/cookie/getToken", controller.getToken);

router.get("/cookie/refreshToken", refreshJwtAuth, controller.refreshToken);

router.delete("/cookie/clearToken", controller.clearToken);

module.exports = router;
