const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Fawn = require("fawn");
const {rentalSchema, validate} = require('../models/rentals-model');
const {movieSchema} = require('../models/movie-model');
const {customerSchema} = require('../models/customer-model');
Fawn.init(mongoose);
const Movies = mongoose.model('Movies', movieSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Rental = mongoose.model('Rental', rentalSchema);

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");
  
    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");
  
    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock.");
  
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        name: movie.name,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
  
    try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
  });


module.exports = router;