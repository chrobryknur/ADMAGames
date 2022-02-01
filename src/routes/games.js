const { Router } = require('express');
const { Game } = require('../models/game');
const fs = require('fs');
const adminVerification = require('../middleware/adminVerification');
const gameValidation = require('../middleware/gameValidation');

const titleUsedError = (title) => new Error(`Title already used ${title}`);
const invalidGameError = () => new Error('Game not recognized');

const multer = require('multer');
const upload = multer({ dest: 'uploads'});

const router = Router();

const miniaturePath = (fileName) => path.join(__dirname, `../uploads/${fileName}`);

router.get('/', (req, res, next) => {
  Game.find({})
    .then((games) => {
      const { user } = req.session;

      if (!user) return res.render('guest/games', { games });
      if (!user.admin) return res.render('user/games', { games, cartSize: user.cartSize });
      return res.render('admin/games', { games });
    })
});

router.post('/', adminVerification, upload.single('miniature'), gameValidation, async (req, res, next) => {
  const { title } = req.body;
  const { file } = req;
  if (!file) return res.redirect('/games')

  const { titleUsed, error } = await Game.findOne({ title })
    .then((game) => ({ titleUsed: game !== null }))

  if (error) return next(error);
  if (titleUsed) return next(titleUsedError(title));

  const game = { ...req.body, miniatureFile: file.filename };
  Game.create(game)
    .then(() => res.redirect('/games'))

});

router.post('/modify/:_id', adminVerification, (req, res, next) => {
  const { _id } = req.params;
  const { action } = req;

  if (action === 'delete') {
    Game.findOneAndDelete({ _id })
      .then(({miniatureFile}) => {
        fs.unlinkSync(`uploads/${miniatureFile}`);
        res.redirect('/games');
      })

  } else if (action === 'update') {
    const game = req.body;

    Game.updateOne({ _id }, game)
      .then(() => res.redirect('/games'))
  }
});

router.get('/:_id', (req, res, next) => {
  const { _id } = req.params;
  Game.findById(_id)
    .then((game) => {
      const { user } = req.session;
      if (!user) return res.render('guest/game', { game });
      return res.render('user/game', { game, cartSize: user.cartSize });
    })

});

module.exports = router;
