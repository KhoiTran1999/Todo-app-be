const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const jwtAuth = (req, res, next) => {
  const tokenHeaders = req.headers.authorization;

  if (!tokenHeaders || !tokenHeaders.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorize!',
    });
  }

  const token = tokenHeaders.split(' ')[1];

  const user = jwt.verify(token, env.JWT_ACCESSTOKEN_PRIVATE_KEY);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorize!',
    });
  }
  req.user = user;
  next();
};

module.exports = jwtAuth;
