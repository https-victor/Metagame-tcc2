const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const config = require("config");
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let user = await User.findOne({ role: 2, _id:req.user.id });
    if(!user){
        return res.status(401).json({errors:[{msg:'You are not authorized', type:"permition"}]});
    }
      const users = await User.find({}).select('-password').sort({
        registerDate: -1
      });
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: 'Server Error', type: 'server' }] });
    }
  });

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const { name, email, password, gender, birthdate } = req.body;

    try {
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ errors: [{type:'database',msg: 'User already exists'}] });
        }
        user = new User({
            name,email,password, gender,
            birthdate
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600000000
        }, (err, token) => {
            if(err) throw err;
            res.json({token});
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
});

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name,
        gender,
        birthdate, role  } = req.body;



    const userFields = {};
    if(name) userFields.name = name;
    if(gender) userFields.gender = gender;
    if(birthdate) userFields.birthdate = birthdate;
    

    try {
        let isUserAdmin = await User.findOne({ role: 2, _id:req.user.id });
        if(isUserAdmin){
            if(role){
                userFields.role = role;
            }
        }
        let user = await User.findById(req.params.id);
        if(!user) res.status(404).json({errors:[{msg:'User not found',type:'database'}]});

        // Check if requesting user has permision
        if(user.id !== req.user.id){
            return res.status(401).json({errors:[{msg:'Not authorized',type:'authorization'}]});
        }

        user = await User.findByIdAndUpdate(req.params.id, {$set: userFields}, {new: true});
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({errors:[{msg:'Server Error', type:'server'}]});
    }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        
        if(!user) res.status(404).json({errors:[{msg:'User not found',type:'database'}]});

        // Check if requesting user has permision to the database content
        if(user.id !== req.user.id){
            return res.status(401).json({errors:[{msg:'Not authorized',type:'authorization'}]});
        }

        await User.findByIdAndUpdate(req.params.id, {$set: {status: false}}, {new: true});

        res.json({reports:[{msg:'User deactivated', type:'crud'}]});
    } catch (err) {
        console.error(err);
        res.status(500).json({errors:[{msg:'Server Error', type:'server'}]});
    }
});

module.exports = router;