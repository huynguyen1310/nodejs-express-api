const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Auth');
const validation = require('../validation');

router.post('/register' , async (req,res) => {
    //VALIDATION
    const {error} = validation.registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK EMAIL
    const emailExists = await User.findOne({email : req.body.email});
    if(emailExists) return res.status(400).send('Email already used');

    //HASH PWD
    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(req.body.password , salt);

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashpwd
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(400).send(err)
    }

});

router.post('/login' , async (req,res) => {
    //VALIDATION
    const {error} = validation.loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK EMAIL
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('Email or password is wrong');

    //CHECK PWD
    const validpwd = await bcrypt.compare(req.body.password,user.password);
    if(!validpwd) return res.status(400).send('Email or password is wrong');

    const token = jwt.sign({_id : user.id} , process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
});

module.exports = router