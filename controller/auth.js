const { env } = require('../config/env');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const User = require('../models/Mysql/User');
const ErrorResponse = require('../responses/ErrorResponse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerToken = require('../models/Mongo/registerToken');
const mail = require('../services/mail');

const register = asyncMiddleware(async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new ErrorResponse(409, 'This email have been registerd');
  }

  const hashPassword = bcrypt.hashSync(password, 12);

  await User.create({ username, email, password: hashPassword });

  res.status(201).json({
    success: true,
    message: 'Registered successfully',
  });
});

const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ErrorResponse(401, 'Invalid email/password');
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    throw new ErrorResponse(401, 'Invalid email/password');
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_ACCESSTOKEN_PRIVATE_KEY,
    { expiresIn: env.JWT_EXPIRED_IN_ACCESSTOKEN },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_REFRESHTOKEN_PRIVATE_KEY,
    { expiresIn: env.JWT_EXPIRED_IN_REFRESHTOKEN },
  );

  res
    .cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    })
    .cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      httpOnly: true,
    })
    .status(201)
    .json({
      success: true,
      token: {
        accessToken,
        refreshToken,
      },
    });
});

const verifyEmail = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new ErrorResponse(409, 'Email have been used by another user');
  }

  const token = jwt.sign({ email }, env.JWT_ACCESSTOKEN_PRIVATE_KEY, {
    expiresIn: env.JWT_EXPIRED_IN_ACCESSTOKEN,
  });

  const encodeToken = encodeURIComponent(token);

  try {
    await registerToken.create({ email, token });
  } catch (error) {
    throw new ErrorResponse(
      409,
      'An email have been sent to your email. Please check it',
    );
  }

  await mail.sendMail({
    to: email,
    subject: 'Fast Note - Verify Email',
    html: `<h2>Hi ${email},</h2>
          <p>You requested to verify your email account recently. <br>Click the link below to verify your email. <strong>This Link is only valid for the next 1 minute.</strong></p>
          <div style= "display: flex; justify-content: center; margin: 10px">
            <a href="${env.SERVER_URL}/api/v1/auth/checkEmailToken/${encodeToken}" style="background-color: rgb(34,188,102); color: white; font-size: 30px; padding: 4px; border-radius: 2px">Click here</a>
          </div>
          <p>Thanks,
          <br>Fast Note Team</p>`,
  });

  res.status(201).json({
    success: true,
    message: 'A verify email have been sent to your Email',
  });
});

const checkEmailToken = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const decodeToken = decodeURIComponent(token);
  const user = jwt.verify(decodeToken, env.JWT_ACCESSTOKEN_PRIVATE_KEY);

  if (!user) {
    throw new ErrorResponse(401, 'Unauthorized');
  }

  const tokenEmail = await registerToken.findOne({
    email: user.email,
    token: decodeToken,
  });

  if (!tokenEmail) {
    return res.send(
      `Link that have been sent to your email was invalid. <a href="${env.CLIENT_URL}/verifyEmail">Click here to try again</a>`,
    );
  }

  await registerToken.deleteOne({ email: user.email, token: decodeToken });

  res.redirect(`${env.CLIENT_URL}/register/${encodeURIComponent(decodeToken)}`);
});

const getToken = asyncMiddleware(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(404).json({
      success: false,
      message: "Token doesn't exist",
    });
  }

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: 'AccessToken have been expired',
      refreshToken: req.cookies.refreshToken,
    });
  }

  res.json({
    success: true,
    accessToken: req.cookies.accessToken,
    refreshToken: req.cookies.refreshToken,
  });
});

const refreshToken = asyncMiddleware(async (req, res, next) => {
  const user = req.user;
  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_ACCESSTOKEN_PRIVATE_KEY,
    { expiresIn: env.JWT_EXPIRED_IN_ACCESSTOKEN },
  );

  return res
    .cookie('accessToken', newAccessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    })
    .status(201)
    .json({
      success: true,
      accessToken: newAccessToken,
    });
});

const clearToken = asyncMiddleware(async (req, res, next) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({ success: true });
});

module.exports = {
  register,
  login,
  verifyEmail,
  checkEmailToken,
  getToken,
  refreshToken,
  clearToken,
};
