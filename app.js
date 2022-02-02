const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { mofotoSchema, reviewSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Mofoto = require('./models/mofoto');
const Review = require('./models/review');

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

const validateMofoto = (req, res, next) => {
  const { error } = mofotoSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/mofotos',
  catchAsync(async (req, res) => {
    const mofotos = await Mofoto.find({});
    res.render('mofotos/index', { mofotos });
  })
);

app.get('/mofotos/new', (req, res) => {
  res.render('mofotos/new');
});

app.post(
  '/mofotos',
  validateMofoto,
  catchAsync(async (req, res, next) => {
    // if (!req.body.mofoto) throw new ExpressError('Invalid Mofoto Data', 400);

    const mofoto = new Mofoto(req.body.mofoto);
    await mofoto.save();
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

app.get(
  '/mofotos/:id',
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id).populate('reviews');
    res.render('mofotos/show', { mofoto });
  })
);

app.get(
  '/mofotos/:id/edit',
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id);
    res.render('mofotos/edit', { mofoto });
  })
);

app.put(
  '/mofotos/:id',
  validateMofoto,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const mofoto = await Mofoto.findByIdAndUpdate(id, { ...req.body.mofoto });
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

app.delete(
  '/mofotos/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mofoto.findByIdAndDelete(id);
    res.redirect('/mofotos');
  })
);

app.post(
  '/mofotos/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id);
    const review = new Review(req.body.review);
    mofoto.reviews.push(review);
    await review.save();
    await mofoto.save();
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something went wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
