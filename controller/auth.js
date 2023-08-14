const { env } = require("../config/env");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const User = require("../model/Mysql/User");
const ErrorResponse = require("../responses/ErrorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerToken = require("../model/Mongo/registerToken");
const mail = require("../services/mail");

const register = asyncMiddleware(async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new ErrorResponse(409, "Invalid email");
  }

  const hashPassword = bcrypt.hashSync(password, 12);

  await User.create({ username, email, password: hashPassword });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
  });
});

const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ErrorResponse(401, "Invalid email/password");
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    throw new ErrorResponse(401, "Invalid email/password");
  }

  const token = jwt.sign(
    {
      email: user.email,
    },
    env.JWT_PRIVATE_KEY,
    { expiresIn: env.JWT_EXPIRED_IN }
  );

  res.cookie("token", token).status(201).json({
    success: true,
  });
});

const verifyEmail = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new ErrorResponse(409, "Invalid email");
  }

  const token = jwt.sign({ email }, env.JWT_PRIVATE_KEY, {
    expiresIn: env.JWT_EXPIRED_IN,
  });

  const encodeToken = encodeURIComponent(token);

  await registerToken.create({ email, token });

  await mail.sendMail({
    to: email,
    subject: "Verify Email",
    html: `<h2>Hi ${email},</h2>
          <p>You recently requested to verify your email for your <strong>${email}</strong> account. <br>Click link below to verify your email. <strong>This Link is only valid for the next 1 minute.</strong></p>
          <div style= "display: flex; justify-content: center; margin: 10px">
            <a href="${env.SERVER_URL}/api/v1/auth/checkEmailToken/${encodeToken}" style="background-color: rgb(34,188,102); color: white; font-size: 30px; padding: 4px; border-radius: 2px">Click here</a>
          </div>
          <p>Thanks,
          <br>The KhoiTran Website Team</p>`,
  });

  res.status(201).json({
    success: true,
    message: "A verify email have been sent to your Email",
  });
});

const checkEmailToken = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const decodeToken = decodeURIComponent(token);
  const user = jwt.verify(decodeToken, env.JWT_PRIVATE_KEY);

  if (!user) {
    throw new ErrorResponse(401, "Unauthorized");
  }
  console.log("user.email: ", user.email);
  const tokenEmail = await registerToken.findOne({
    email: user.email,
    token: decodeToken,
  });

  if (!tokenEmail) {
    return res.send(
      `Link that have been sent to your email was invalid. <a href="${env.CLIENT_URL}/verifyEmail">Click here to try again</a>`
    );
  }

  await registerToken.deleteOne({ email: user.email, token: decodeToken });

  res.redirect(
    `http://localhost:3000/register/${encodeURIComponent(user.email)}`
  );
});

const setToken = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;
  const token = jwt.sign(
    {
      email,
    },
    env.JWT_PRIVATE_KEY,
    { expiresIn: env.JWT_EXPIRED_IN }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .send("Created Token");
});

const getToken = asyncMiddleware(async (req, res, next) => {
  res.json({
    success: true,
    cookies: req.cookies,
  });
});

module.exports = {
  register,
  login,
  verifyEmail,
  checkEmailToken,
  setToken,
  getToken,
};
