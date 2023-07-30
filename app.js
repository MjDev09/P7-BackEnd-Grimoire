const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Jm:DWSv5Cs3PiZq3Yd9d@p7-mon-vieux-grimoire.f2wderh.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const routeBook = require('./routes/routes_books');
const routeUser = require('./routes/routes_users');
const path = require('path');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/auth', routeUser);
app.use('/api/books', routeBook);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;