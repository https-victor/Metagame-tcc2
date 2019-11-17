const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const router = express.Router();
const auth = require('../middlewares/auth');
// const upload = require('../middlewares/upload');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const multer = require('multer');
var storage = multer.memoryStorage(); 
var upload = multer({ storage: storage });

const User = require('../models/User');
const Game = require('../models/Game');

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.params.id){
      const user = await User.findById(req.user.id).select('-password');
      console.log(user);
      const myFullGames = await Game.find({
        _id: { $in: user.games },
        gmId: req.user.id,
        status: true
      }).select('_id name img description');
      
      const otherFullGames = await Game.find({
        _id: { $in: user.games },
        gmId: { $ne: req.user.id},
        status: true
      }).select('_id name img description');
      return res.json({...user._doc,myGames:myFullGames,otherGames:otherFullGames});
    }
    else if (req.query.nome && req.query.email){
      const users = await User.find({email: req.query.email, nome: req.query.nome, status: true})
      .select('-password')
      .sort({
        registerDate: -1
      });
      return res.json(users);

    } else if(req.query.nome || req.query.email){
      const users = await User.find({[(req.query.nome?nome:email)]: req.query.nome?req.query.nome:req.query.email, status: true})
      .select('-password')
      .sort({
        registerDate: -1
      });
    return res.json(users);
    }
     else {
    let user = await User.findOne({ role: 2, _id: req.user.id }).select('-password');
    if (!user) {
      return res
        .status(500)
        .json({
          errors: [{ msg: 'You are not authorized', type: 'permition' }]
        });
    }
    const users = await User.find({})
      .select('-password')
      .sort({
        registerDate: -1
      });
    res.json(users);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/users/upload
// @desc    POST all users
// @access  Private
router.post('/upload/:id', upload.single('picture'), async (req, res) => {
  const img = req.file.buffer;
  const encode_image = img.toString('base64');

  const finalImg = {
    contentType: req.file.mimetype,
    buffer: new Buffer.from(encode_image, 'base64')
  };
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { $set: { img: finalImg } },
      { new: true }
    );
    res.json({ reports: [{ msg: 'File uploaded', type: 'upload' }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   GET api/picture/:id
// @desc    GET all users
// @access  Private
router.get('/picture/:id', async (req, res) => {
  var filename = req.params.id;
  try {
    const user = await User.findById(filename);
    res.contentType('image/jpeg');
    res.send(user.img.buffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, gender, birthdate } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ type: 'database', msg: 'User already exists' }] });
      }
      user = new User({
        name,
        email,
        password,
        gender,
        birthdate
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600000000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, gender, birthdate, role } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (gender) userFields.gender = gender;
  if (birthdate) userFields.birthdate = birthdate;

  try {
    let isUserAdmin = await User.findOne({ role: 2, _id: req.user.id });
    if (isUserAdmin) {
      if (role) {
        userFields.role = role;
      }
    }
    let user = await User.findById(req.params.id);
    if (!user)
      res
        .status(404)
        .json({ errors: [{ msg: 'User not found', type: 'database' }] });

    // Check if requesting user has permision
    if (user.id !== req.user.id) {
      return res
        .status(500)
        .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user)
      res
        .status(404)
        .json({ errors: [{ msg: 'User not found', type: 'database' }] });

    // Check if requesting user has permision to the database content
    if (user.id !== req.user.id) {
      return res
        .status(500)
        .json({ errors: [{ msg: 'Not authorized', type: 'authorization' }] });
    }

    await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: false } },
      { new: true }
    );

    res.json({ reports: [{ msg: 'User deactivated', type: 'crud' }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
  }
});

module.exports = router;
