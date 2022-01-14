const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Mofoto = require('./models/mofoto');

mongoose.connect('mongodb://localhost:27017/mofoto', {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/mofotos', async (req, res) => {
  const mofotos = await Mofoto.find({});
  res.render('mofotos/index', { mofotos });
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
