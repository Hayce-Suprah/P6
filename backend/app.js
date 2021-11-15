const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Sauces = require('./models/Sauces');
const path = require('path');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const stuffRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Hayce:24091994@cluster0.olqce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(limiter);
app.use(helmet());


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;