const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Joi = require('joi');
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const router = express.Router();
const config = require('config');
const {userSchema} = require('../models/user-model');

const User = mongoose.model('User', userSchema);

router.post('/', async (req, res) => {
    const {error} = validateUsers(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});
    //console.log(user);
    if(!user) return res.status(400).send("Invalid Username or Password");
    
    const validPassword = await bcrypt.compare( req.body.password, user.password);
    //console.log(validPassword);
    if(!validPassword) return res.status(400).send("Yikes, Invalid email or password");
    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    res.send(token);
    
});

function validateUsers(user){
    const schema  = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(user);
}

module.exports = router;