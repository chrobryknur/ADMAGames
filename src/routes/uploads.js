const { Router } = require('express');
const path = require('path');

const titleUsedError = (title) => new Error(`Title already used ${title}`);
const invalidGameError = () => new Error('Game not recognized');

const router = Router();

router.get('/:fileName', (req, res, next) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, `../../uploads/${fileName}`);

  res.sendFile(filePath);
});

module.exports = router;
