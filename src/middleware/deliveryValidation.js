const Joi = require("joi");

const deliverySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(0).max(99999).required(),
  estimatedTime: Joi.number().min(1).max(100).required()
});

const deliveryValidation = (req, res, next) => {
  deliverySchema.validateAsync(req.body)
    .then((delivery) => {
      req.body = delivery;
      next();
    })
    .catch((error) => res.redirect('/users/deliveries'));
};

module.exports = { deliveryValidation, deliverySchema };