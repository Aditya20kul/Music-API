const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config');
const router = express.Router();
const {userSchema, validateUsers} = require('../models/user-model');

const User = mongoose.model('User', userSchema);

router.post('/', async (req, res) => {
    const {error} = validateUsers(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("User already registered");
    user = new User(_.pick(req.body, ['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
    
});

module.exports = router;