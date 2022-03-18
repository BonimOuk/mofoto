const express = require('express');
const { createReview } = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Mofoto = require('../models/mofoto');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');

router.post('/', validateReview, isLoggedIn, catchAsync(createReview));

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
