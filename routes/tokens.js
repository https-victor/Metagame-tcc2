const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Game = require('../models/Game');
const Token = require('../models/Token');
const Chat = require('../models/Chat');
const multer = require('multer');
var storage = multer.memoryStorage(); 
var upload = multer({ storage: storage });

// @route   POST api/tokens/upload/:id
// @desc    POST all users
// @access  Private
router.post('/upload/:id/:tokenId', upload.single('picture'), async (req, res) => {
  const img = req.file.buffer;
  const encode_image = img.toString('base64');

  const finalImg = {
    contentType: req.file.mimetype,
    buffer: new Buffer.from(encode_image, 'base64')
  };
  try {
    await Token.findByIdAndUpdate(req.params.tokenId, { $set: {img:finalImg} }, { new: true });
    res.json({ reports: [{ msg: 'File uploaded', type: 'upload' }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});
module.exports = router;
