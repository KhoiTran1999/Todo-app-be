const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const { env } = require('../config/env');

const rateLimiter = (windowMs = 1 * 60 * 1000, max) => {
  // const limiter = rateLimit({
  //   store: new MongoStore({
  //     collectionName: 'Limiter',
  //     uri: env.MONGO_URI,
  //     expireTimeMs: windowMs,
  //     errorHandler: console.error.apply.bind(null, 'rate-limit-mongo'),
  //   }),
  //   windowMs,
  //   max,
  //   standardHeaders: true,
  //   legacyHeaders: false,
  //   message: `Too many requrests from this IP, please try later`,
  //   handler: (req, res, next, option) => {
  //     res.status(option.statusCode).json({
  //       success: false,
  //       message: option.message,
  //     });
  //   },
  // });
  // return limiter;
};

module.exports = rateLimiter;
