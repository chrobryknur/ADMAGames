const { Router } = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { Game } = require('../models/game');
// const userValidation = require('../middleware/validation/user');

const emailUsedError = (email) => new Error(`Email already used ${email}`);
const loginError = () => new Error('Invalid username or password');
const invalidUserError = () => new Error('User not recognized');
const invalidGameError = () => new Error('Game not recognized');

const router = Router();

router.post('/register', /*userValidation,*/ async (req, res, next) => {
  const { email, password } = req.body;

  const { emailUsed, error } = await User.findOne({ email })
    .then((user) => ({ emailUsed: user !== null }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (emailUsed) return next(emailUsedError(email));

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
      res.redirect(admin ? '/admin/games' : '/games');
    })
    .catch((error) => next(error));
});

router.get('/', (req, res) => {
  const user = req.session.user;
  res.json(user);
})

router.post('/login', /*userValidation,*/ async (req, res, next) => {
  const { email, password } = req.body;

  const { user, error } = await User.findOne({ email })
    .then((user) => ({ user }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (!user) return next(loginError());

  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) return next(loginError());

  const { _id, admin, cart } = user;
  req.session.user = { _id, admin, cartSize: cart.length };
  res.redirect(admin ? '/admin/games' : '/games');
});

router.delete('/logout', async (req, res, next) => {
  req.session.destroy();
  res.json({ message: 'Success' });
});

router.put('/cart/add', async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user) return next(invalidUserError());

  const { gameId } = req.body;
  const game = await Game.findById(gameId);
  if (!game) return next(invalidGameError());

  user.cart.push(game);
  user.save()
    .then(() => {
      req.session.user.cartSize += 1;
      res.redirect('/games');
    })
    .catch((error) => next(error));
});

router.delete('/:_id', async (req, res, next) => {
  const { _id } = req.params;

  User.deleteOne({ _id })
    .then(({ deletedCount }) => res.json({ deletedCount }))
    .catch((error) => next(error));
});

module.exports = router;