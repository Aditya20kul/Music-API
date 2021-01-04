const express = require('express')
const {customerSchema, validate} = require('../models/customer-model')
const mongoose = require('mongoose')
const router = express.Router();


const Customer = mongoose.model('Customer', customerSchema);
// Getting All the Customers
router.get('/',async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// Adding New Customer
router.post('/', async(req, res) => {
    const result = validate(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }
    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold : req.body.isGold, 
    });
    customer = await customer.save();
    res.send(customer);
})

// Update the Customer 
router.put('/:id',  async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        },
        {new: true});
    if(!customer){
        return res.status(404).send('Unable to find genre with the given id');
    }

    res.send(customer);
});


// Deleting Genre
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if(!customer){
        return res.status(404).send('Unable to find genre with the given id');
    }
  
    res.send(customer);
});



module.exports = router;