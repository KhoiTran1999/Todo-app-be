const { env } = require('../config/env');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const User = require('../models/Mysql/User');
const ErrorResponse = require('../responses/ErrorResponse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerToken = require('../models/Mongo/registerToken');
const mail = require('../services/mail');

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Auth APIs
 * /auth/register:
 *  post:
 *   tags: [Auth]
 *   summary: create a new user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateUser'
 *   responses:
 *    201:
 *     description: Created
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/RegisterSuccessResponse'
 *    409:
 *     description: This email have been registerd
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/RegisterErrorResponse'
 * components:
 *  schemas:
 *   CreateUser:
 *    type: object
 *    required:
 *     - username
 *     - email
 *     - password
 *    properties:
 *     username:
 *      type: string
 *      description: The username of the user
 *     password:
 *      type: string
 *      description: The password of the user
 *     email:
 *      type: string
 *      description: The email of the user
 *    example:
 *     username: david
 *     email: david@gmail.com
 *     password: "123456"
 *   RegisterSuccessResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of the response
 *    example:
 *     success: true
 *   RegisterErrorResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of failed response
 *    example:
 *     success: false
 */

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

/**
 * @swagger
 * /auth/login:
 *  post:
 *   tags: [Auth]
 *   summary: login to Fastnote
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/LoginUser'
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/LoginSuccessResponse'
 *    401:
 *     description: Invalid email/password
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/LoginErrorResponse'
 * components:
 *  schemas:
 *   LoginUser:
 *    type: object
 *    required:
 *     - email
 *     - password
 *    properties:
 *     password:
 *      type: string
 *      description: The password of the user
 *     email:
 *      type: string
 *      description: The email of the user
 *    example:
 *     email: david@gmail.com
 *     password: "123456"
 *   LoginSuccessResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of the response
 *     token:
 *      type: string
 *      description: The token of the user
 *    example:
 *     success: true
 *     token: {accessToken: df234qwejf2..., refreshToken: jgi1249ggler34...}
 *   LoginErrorResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of failed response
 *     message:
 *      type: string
 *      description: The description of failed response
 *    example:
 *     success: false
 *     message: Invalid email/password
 */

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

/**
 * @swagger
 * /auth/verifyEmail:
 *  post:
 *   tags: [Auth]
 *   summary: verify users'Email
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/VerifyEmail'
 *   responses:
 *    200:
 *     description: A mail have been sent
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/VerifyEmailSccessResponse'
 *    409:
 *     description: Conflict
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorVerifyEmailResponse'
 * components:
 *  schemas:
 *   VerifyEmail:
 *    type: object
 *    required:
 *     - email
 *    properties:
 *     email:
 *      type: string
 *      description: The email that user want to register
 *    example:
 *     email: david@gmail.com
 *   VerifyEmailSccessResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of the response
 *     message:
 *      type: string
 *      description: The description of failed response
 *    example:
 *     success: true
 *     message: A verify email have been sent to your Email
 *   ErrorVerifyEmailResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of failed response
 *     message:
 *      type: string
 *      description: The description of failed response
 *    example:
 *     success: false
 *     message: This email have been used
 */

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
            <a href="${env.SERVER_URL}/v1/auth/checkEmailToken/${encodeToken}" style="background-color: rgb(34,188,102); color: white; font-size: 30px; padding: 4px; border-radius: 2px">Click here</a>
          </div>
          <p>Thanks,
          <br>Fast Note Team</p>`,
  });

  res.status(201).json({
    success: true,
    message: 'A verify email have been sent to your Email',
  });
});

/**
 * @swagger
 * /auth/checkEmailToken/{token}:
 *  get:
 *   tags: [Auth]
 *   summary: check Email to verify
 *   description: to check that user use their own real email
 *   parameters:
 *    - name: token
 *      in: path
 *      description: token of user
 *      required: true
 *      schema:
 *        type: string
 *   responses:
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/UnauthorizeCheckEmail'
 * components:
 *  schemas:
 *   UnauthorizeCheckEmail:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of failed response
 *     message:
 *      type: string
 *      description: The description of failed response
 *    example:
 *     success: false
 *     message: Unauthorized
 */

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

/**
 * @swagger
 * /auth/cookie/getToken:
 *  get:
 *   tags: [Auth]
 *   summary: pass a couple of cookie to user
 *   responses:
 *    200:
 *     description: Cookie have been setted
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/GetCookieSccessResponse'
 *    404:
 *     description: Not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorNotFoundTokenResponse'
 *    401:
 *     description: Not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorExpriedTokenResponse'
 * components:
 *  schemas:
 *   GetCookieSccessResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of the response
 *     token:
 *      type: string
 *      description: The token of the user
 *    example:
 *     success: true
 *     token: {accessToken: df234qwejf2..., refreshToken: jgi1249ggler34...}
 *   ErrorNotFoundTokenResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of failed response
 *     message:
 *      type: string
 *      description: The description of failed response
 *    example:
 *     success: false
 *     message: Token doesn't exist
 *   ErrorExpriedTokenResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of failed response
 *     message:
 *      type: string
 *      description: The description of failed response
 *    example:
 *     success: false
 *     message: AccessToken have been expired
 */

const getToken = asyncMiddleware(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(404).json({
      success: false,
      message: "Token doesn't exist",
    });
  }

  jwt.verify(refreshToken, env.JWT_REFRESHTOKEN_PRIVATE_KEY, (err) => {
    if (err) throw new ErrorResponse(401, err);
  });

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: 'AccessToken have been expired',
      refreshToken: req.cookies.refreshToken,
    });
  }

  jwt.verify(accessToken, env.JWT_ACCESSTOKEN_PRIVATE_KEY, (err) => {
    if (err) throw new ErrorResponse(401, err);
  });

  res.json({
    success: true,
    accessToken,
    refreshToken,
  });
});

/**
 * @swagger
 * /cookie/refreshToken:
 *  get:
 *   tags: [Auth]
 *   summary: Renew accessToken
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    201:
 *     description: Renew accessToken
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/RefressTokenSuccessResponse'
 *    409:
 *     description: This email have been registerd
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/RegisterErrorResponse'
 * components:
 *  schemas:
 *   RefressTokenSuccessResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of the response
 *     accessToken:
 *      type: string
 *      description: Token
 *    example:
 *     success: true
 *     accessToken: ds1234kljq234...
 */

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

/**
 * @swagger
 * /cookie/clearToken:
 *  delete:
 *   tags: [Auth]
 *   summary: clear Token
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ClearTokenSuccessResponse'
 * components:
 *  schemas:
 *   ClearTokenSuccessResponse:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      description: The status of the response
 *    example:
 *     success: true
 */

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
