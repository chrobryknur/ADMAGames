const { Router } = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../models/user');
const { Game } = require('../models/game');
const userValidation = require('../middleware/userValidation');
const adminVerification = require('../middleware/adminVerification');

const emailUsedError = (email) => new Error(`Email already used ${email}`);
const loginError = () => new Error('Invalid username or password');
const invalidUserError = () => new Error('User not recognized');
const invalidGameError = () => new Error('Game not recognized');

const router = Router();

router.post('/register', userValidation, async (req, res, next) => {
  const { email, password } = req.body;

  const { emailUsed } = await User.findOne({ email })
    .then((user) => ({ emailUsed: user !== null }))

  if (emailUsed) return res.render('guest/login', {registerError: "Email already in use"});

  const users = await User.findOne({});
  if (!users) {
    req.body.admin = true;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = { ...req.body, password: hashedPassword };

  User.create(user)
    .then(({ _id, admin, cart }) => {
      req.session.user = { _id, admin, cartSize: cart.length }
      res.redirect('/games');
    })
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const { user, error } = await User.findOne({ email })
    .then((user) => ({ user }))
  if (!user) return res.render('guest/login', {loginError: "Invalid username or password"});

  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) return res.render('guest/login', {loginError: "Invalid username or password"});

  const { _id, admin, cart } = user;
  req.session.user = { _id, admin, cartSize: cart.length };
  res.redirect('/games');
});

router.post('/logout', async (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/cart', (req, res, next) => {
  const { user } = req.session;
  if (!user || user.admin) return res.redirect('/games');

  User.findById(user._id)
    .then((user) => res.render('user/cart', { user }))
});

router.get('/cart/:_id', adminVerification, (req, res, next) => {
  const { _id } = req.params;

  User.findById(_id)
    .then((user) => res.render('admin/cart', { user }))
});

router.post('/cart/add/:gameId', async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user) return next(invalidUserError());

  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) return next(invalidGameError());
  const { _id, ...cartGame } = game._doc;

  User.findByIdAndUpdate(userId, { $push: { cart: cartGame }}, { new: true })
    .then((user) => {
      req.session.user.cartSize = user.cart.length;
      res.redirect('/games');
    })
});

router.post('/cart/remove/:gameId', async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user) return next(invalidUserError());

  User.findByIdAndUpdate( userId, { $pull: { cart: { _id: req.params.gameId }}}, { new: true })
    .then((user) => {
      req.session.user.cartSize = user.cart.length;
      res.redirect('/users/cart');
    })
});

router.get('/', adminVerification, async (req, res, next) => {
  User.find({})
    .then((users) => res.render('admin/users', {users}))
})

router.post('/admin/:_id', adminVerification, async (req, res, next) => {
  const { _id } = req.params;
  const { action } = req;

  console.log(action);

  if (action === 'delete') {
    User.deleteOne({ _id })
      .then(({ deletedCount }) => res.redirect('/users'))
  } else if (action === 'admin') {
    const user = await User.findById(_id);
    User.updateOne({ _id }, { admin: !user.admin})
      .then(() => {
        res.redirect('/users');
      })
  } else if (action === 'cart') {
    res.redirect(`/users/cart/${_id}`);
  }
})

router.post('/delete/:_id', adminVerification, async (req, res, next) => {
  const { _id } = req.params;
});

module.exports = router;