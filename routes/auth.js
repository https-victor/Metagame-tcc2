const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require("config");
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({errors:[{msg:'Server Error',type:'server'}]});
    }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post('/' ,[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists(),
] , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if(!user){
            return res.status(400).json({ errors: [{msg: 'Invalid Credentials', type: 'credentials'}]});
        }

        if(!user.status){
            return res.status(400).json({ errors: [{msg: 'User deactivated from database', type: 'database'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({errors:[{msg:'Invalid Credentials',type:'credentials'}]});
        }
        
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000000000
        }, (err, token) => {
            if(err) throw err;
            res.json({token});
        });         
    } catch (err) {
        console.error(err.message);
        res.status(500).json({errors:[{msg:'Server Error',type:'server'}]});
        
    }
});

module.exports = router;