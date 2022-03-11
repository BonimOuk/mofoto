const express = require('express');
const router = express.Router();
const { mofotoSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const Mofoto = require('../models/mofoto');

const validateMofoto = (req, res, next) => {
  const { error } = mofotoSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  '/',
  catchAsync(async (req, res) => {
    const mofotos = await Mofoto.find({});
    res.render('mofotos/index', { mofotos });
  })
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('mofotos/new');
});

router.post(
  '/',
  isLoggedIn,
  validateMofoto,
  catchAsync(async (req, res, next) => {
    // if (!req.body.mofoto) throw new ExpressError('Invalid Mofoto Data', 400);

    const mofoto = new Mofoto(req.body.mofoto);
    mofoto.author = req.user._id;
    await mofoto.save();
    req.flash('success', 'Successfully made a new mofoto!');
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    console.log(mofoto);
    if (!mofoto) {
      req.flash('error', 'Cannot find that mofoto!');
      return res.redirect('/mofotos');
    }
    res.render('mofotos/show', { mofoto });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const mofoto = await Mofoto.findById(req.params.id);
    res.render('mofotos/edit', { mofoto });
  })
);

router.put(
  '/:id',
  isLoggedIn,
  validateMofoto,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const mofoto = await Mofoto.findByIdAndUpdate(id, { ...req.body.mofoto });
    req.flash('success', 'Successfully updated mofoto!');
    res.redirect(`/mofotos/${mofoto._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mofoto.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mofoto!');
    res.redirect('/mofotos');
  })
);

module.exports = router;
