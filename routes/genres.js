const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const router = express.Router();
const {genreSchema, validateGenres} = require('../models/genre-model');


const Genre = mongoose.model('Genre', genreSchema);

// Getting All the genres 
router.get('/',async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Adding New genre
router.post('/', auth, async(req, res) => {
    const result = validateGenres(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
})

// Update the genres 
router.put('/:id',  async (req, res) => {
    const {error} = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if(!genre){
        return res.status(404).send('Unable to find genre with the given id');
    }

    res.send(genre);
});

// Deleting Genre
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre){
        return res.status(404).send('Unable to find genre with the given id');
    }
  
    res.send(genre);
});

module.exports = router;