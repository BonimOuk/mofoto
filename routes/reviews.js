const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Mofoto = require('../models/mofoto');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');

router.post(
  '/',
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    mofoto.reviews.push(review);
    await review.save();
    await mofoto.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Mofoto.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/mofotos/${id}`);
  })
);

module.exports = router;
