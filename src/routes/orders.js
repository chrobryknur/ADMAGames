const { Router } = require('express');
const adminVerification = require('../middleware/adminVerification');
const orderValidation = require('../middleware/orderValidation');
const { Delivery } = require('../models/delivery');
const Order = require('../models/order');
const { User } = require('../models/user');

const titleUsedError = (title) => new Error(`Title already used ${title}`);

const router = Router();

router.get('/', async (req, res, next) => {
  Order.find({})
    .then(async (orders) => {
      const { user } = req.session;

      if (!user) return res.redirect('/login');
      if (!user.admin) {
        const deliveries = await Delivery.find({})
        const { email, name, surname, cart } = await User.findById(user._id)
        return res.render('user/order', { deliveries, cart, email, name, surname })
      }
      orders = orders.map((order) => ({ ...order._doc, date: order._doc.date.toLocaleString()}))
      return res.render('admin/orders', { orders });
    })
    .catch((error) => next(error));
});

router.post('/', orderValidation, async (req, res, next) => {
  const userId = req.session.user._id;
  const { password, admin, cart: games, ...userData } = await User.findById(userId);

  const { name, surname, email, delivery: deliveryId, phoneNumber, ...address } = req.body;
  const user = { ...userData._doc, name, surname, email };
  const delivery = await Delivery.findById(deliveryId);
  const price = games.reduce((sum, game) => sum + game.price, 0) + delivery.price;
  const date = new Date();

  const order = { user, address, games, delivery, phoneNumber, price, date };

  Order.create(order)
    .then(async () => {
      await User.updateOne({ _id: userId }, { cart: [] });
      req.session.user.cartSize = 0;
      res.redirect('/games')
    })
    .catch((error) => next(error));
});

module.exports = router;

