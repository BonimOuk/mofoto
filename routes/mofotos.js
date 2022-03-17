const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateMofoto, isAuthor } = require('../middleware');
const Mofoto = require('../models/mofoto');

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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const mofoto = await Mofoto.findById(id);
    if (!mofoto) {
      req.flash('error', 'Cannot find that mofoto!');
      return res.redirect('/mofotos');
    }
    res.render('mofotos/edit', { mofoto });
  })
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mofoto.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mofoto!');
    res.redirect('/mofotos');
  })
);

module.exports = router;
