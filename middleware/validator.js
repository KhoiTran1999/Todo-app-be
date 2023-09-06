const validator =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (!error) return next();

    const { details } = error;
    const message = details[0].message;
    const path = details[0].path[0];

    res.status(422).json({
      success: false,
      error: { message, path },
    });
  };

module.exports = validator;
