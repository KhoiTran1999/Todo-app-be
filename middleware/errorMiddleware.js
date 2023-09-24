const errorMiddleware = (err, req, res, next) => {
  const { code, message } = err;
  console.log('====> Error Middleware <====');
  res
    .status(
      typeof code === 'number' && code != undefined && code < 1000 ? code : 500,
    )
    .json({
      success: false,
      message: message || 'Internal Error',
    });
};

module.exports = errorMiddleware;
