const { Router } = require('express');

const { Game } = require('../models/game');

const titleUsedError = (title) => new Error(`Title already used ${title}`);
const invalidGameError = () => new Error('Game not recognized');

const router = Router();

router.get('/', async (req, res) => {
  Game.find({})
    .then((games) => res.json(games))
    .catch((error) => next(error));
});

router.post('/', /*gameValidation,*/ async (req, res, next) => {
  // const { user } = req.session;
  // if (!user || !user.admin) {

  // }

  const { title } = req.body;
  const { titleUsed, error } = await Game.findOne({ title })
    .then((game) => ({ titleUsed: game !== null }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (titleUsed) return next(titlelUsedError(title));

  const game = req.body;
  Game.create(game)
    .then(() => res.redirect('/admin/games'))
    .catch((error) => next(error));
});

module.exports = router;
