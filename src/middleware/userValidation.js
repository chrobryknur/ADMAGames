const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(32).required(),
  name: Joi.string().min(1).max(100).required(),
  surname: Joi.string().min(1).max(100).required(),
  admin: Joi.boolean().forbidden().default(false),
});

const userValidation = (req, res, next) => {
  userSchema.validateAsync(req.body)
    .then((user) => {
      req.body = user;
      next();
    })
    .catch((error) => res.redirect('/login'));
};

module.exports = userValidation;