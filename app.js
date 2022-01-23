const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Mofoto = require('./models/mofoto');
const { urlencoded } = require('express');

mongoose.connect('mongodb://localhost:27017/mofoto', {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/mofotos', async (req, res) => {
  const mofotos = await Mofoto.find({});
  res.render('mofotos/index', { mofotos });
});

app.get('/mofotos/new', (req, res) => {
  res.render('mofotos/new');
});

app.post('/mofotos', async (req, res, next) => {
  try {
    const mofoto = new Mofoto(req.body.mofoto);
    await mofoto.save();
    res.redirect(`/mofotos/${mofoto._id}`);
  } catch (error) {
    next(error);
  }
});

app.get('/mofotos/:id', async (req, res) => {
  const mofoto = await Mofoto.findById(req.params.id);
  res.render('mofotos/show', { mofoto });
});

app.get('/mofotos/:id/edit', async (req, res) => {
  const mofoto = await Mofoto.findById(req.params.id);
  res.render('mofotos/edit', { mofoto });
});

app.put('/mofotos/:id', async (req, res) => {
  const { id } = req.params;
  const mofoto = await Mofoto.findByIdAndUpdate(id, { ...req.body.mofoto });
  res.redirect(`/mofotos/${mofoto._id}`);
});

app.delete('/mofotos/:id', async (req, res) => {
  const { id } = req.params;
  await Mofoto.findByIdAndDelete(id);
  res.redirect('/mofotos');
});

app.use((err, req, res, next) => {
  res.send('Oh boy, something went wrong!!!');
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
