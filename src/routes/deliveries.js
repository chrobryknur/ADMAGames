const { Router } = require('express');
const adminVerification = require('../middleware/adminVerification');
const { deliveryValidation } = require('../middleware/deliveryValidation');
const { Delivery } = require('../models/delivery');

const titleUsedError = (title) => new Error(`Title already used ${title}`);

const router = Router();

router.get('/', adminVerification, (req, res, next) => {
  Delivery.find({})
    .then((deliveries) => {
      res.render('admin/deliveries', { deliveries });
    })
});

router.post('/', adminVerification, deliveryValidation, async (req, res, next) => {
  const { name } = req.body;
  const { nameUsed, error } = await Delivery.findOne({ name })
    .then((delivery) => ({ nameUsed: delivery !== null }))
  if (error) return next(error);
  if (nameUsed) return next(titleUsedError(title));

  const delivery = req.body;
  Delivery.create(delivery)
    .then(() => res.redirect('/deliveries'))
});

router.post('/delete/:_id', adminVerification, (req, res, next) => {
  const { _id } = req.params;
  Delivery.deleteOne({ _id })
    .then(({ deletedCount }) => res.redirect('/deliveries'))
})

module.exports = router;
