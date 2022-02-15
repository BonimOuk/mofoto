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
const mofotos = require('./routes/mofotos');

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

app.use('/mofotos', mofotos);

app.get('/', (req, res) => {
  res.render('home');
});

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

app.delete(
  '/mofotos/:id/reviews/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const mofoto = await Mofoto.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/mofotos/${id}`, { mofoto });
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
