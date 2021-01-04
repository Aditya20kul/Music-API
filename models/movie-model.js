const Joi = require('joi');
const mongoose = require('mongoose')
const {genreSchema} = require('./genre-model');


const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 5,
        max: 150
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 5,
        max: 150
    }

});

function validateMovie(movie){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    });
    
    return schema.validate(movie);
}

exports.movieSchema = movieSchema;
exports.validate =  validateMovie;