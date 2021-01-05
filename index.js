const express = require('express');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose')
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movie');
const rental = require('./routes/rental');
const users = require('./routes/users');
const auth = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies)
app.use('/api/rental', rental)
app.use('/api/users', users);
app.use('/api/auth', auth);

if(!config.get('jwtPrivateKey'))
{ 
    console.log("Fatal Error : jwtPrivateKey is not defined");
    process.exit(1);
}

mongoose.connect('mongodb://localhost/musicAPI')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => console.error('Could not connect to MongoDB')); 

app.get('/', (req, res) => {
    res.send('Homepage');
});

app.listen(3000, ()=> {
    console.log("App Running on Localhost 3000");
});