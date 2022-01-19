const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const { deliverySchema } = require("./deliveryValidation");

const orderSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  surname: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  city: Joi.string().min(1).max(100).required(),
  street: Joi.string().min(1).max(100).required(),
  building: Joi.string().min(1).max(100).required(),
  apartment: Joi.string().min(1).max(100).required(),
  postalCode: Joi.string().regex(/\d{2}-\d{3}/).required(),
  delivery: Joi.objectId().required(),
  phoneNumber: Joi.string().regex(/(\+\d{2})?\d{9}/),
});

const orderValidation = (req, res, next) => {
  orderSchema.validateAsync(req.body)
    .then((order) => {
      req.body = order;
      next();
    })
    .catch((error) => { console.log(error); res.redirect('/orders'); });
};

module.exports = orderValidation;
