const validator = (schema, property = "body") => {
  return (req, res, next) => {
    const { err } = schema.validate(req[property]);

    if (!err) return next();

    const { details } = err;
    const error = details[0].message;
    const path = details[0].path[0];

    res.status(422).json({
      success: false,
      message: { error, path },
    });
  };
};

module.exports = validator;
