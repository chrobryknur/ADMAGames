const Joi = require("joi");

const gameSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(0).max(99999).required(),
  year: Joi.number().min(1900).max(new Date().getFullYear() + 2).required(),
  category: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(300),
});

const gameValidation = (req, res, next) => {
  const { action, ...game } = req.body;
  gameSchema.validateAsync(game)
    .then((game) => {
      req.body = { ...game, action };
      next();
    })
    .catch((error) => res.redirect('/games'));
};

module.exports = gameValidation;