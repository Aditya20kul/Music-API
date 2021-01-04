const Joi = require('joi');
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

function validateGenres(genre){
    const schema  = Joi.object({
        name : Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.validateGenres = validateGenres;
