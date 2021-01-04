const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const {movieSchema, validate} = require('../models/movie-model');
const {genreSchema} = require('../models/genre-model');

const Movies = mongoose.model('Movies', movieSchema);
const Genre = mongoose.model('Genre', genreSchema);

router.get('/', async (req, res) => {
    const movies = await Movies.find().sort('name')
    res.send(movies);
})

router.post('/', async (req, res ) => {
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const genre = await Genre.findById(req.body.genreId);
    console.log(genre._id, genre.name);
    if(!genre){
        return res.status(400).send('Invalid Genre');
    }
    let movie = new Movies({
        name: req.body.name,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    movie = await movie.save();
    res.send(movie);
})

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");
  
    const movie = await Movies.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );
  
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
  
    res.send(movie);
  });

router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
  
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
  
    res.send(movie);
});
  


module.exports = router;