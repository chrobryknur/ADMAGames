const { Router } = require('express');
const adminVerification = require('../middleware/adminVerification');
const gameValidation = require('../middleware/gameValidation');
const { Game } = require('../models/game');

const titleUsedError = (title) => new Error(`Title already used ${title}`);
const invalidGameError = () => new Error('Game not recognized');

const router = Router();

router.get('/', (req, res, next) => {
  Game.find({})
    .then((games) => {
      const { user } = req.session;

      if (!user) return res.render('guest/games', { games });
      if (!user.admin) return res.render('user/games', { games, cartSize: user.cartSize });
      return res.render('admin/games', { games });
    })
    .catch((error) => next(error));
});

router.post('/', adminVerification, gameValidation, async (req, res, next) => {
  const { title } = req.body;
  const { titleUsed, error } = await Game.findOne({ title })
    .then((game) => ({ titleUsed: game !== null }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (titleUsed) return next(titleUsedError(title));

  const game = req.body;
  Game.create(game)
    .then(() => res.redirect('/games'))
    .catch((error) => next(error));
});

router.post('/delete/:_id', adminVerification, (req, res, next) => {
  const { _id } = req.params;

  Game.deleteOne({ _id })
    .then(({ deletedCount }) => res.redirect('/games'))
    .catch((error) => next(error));
});

router.post('/update/:_id', adminVerification, gameValidation, (req, res, next) => {
  const { _id } = req.params;
  const game = req.body;

  Game.updateOne({ _id }, game)
    .then(() => res.redirect('/games'))
    .catch((error) => next(error));
});

module.exports = router;
