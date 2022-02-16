const express = require('express');
const router = express.Router({ mergeParams: true });
const Mofoto = require('../models/mofoto');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

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

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id);
    const review = new Review(req.body.review);
    mofoto.reviews.push(review);
    await review.save();
    await mofoto.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

router.delete(
  '/:reviewId',
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
