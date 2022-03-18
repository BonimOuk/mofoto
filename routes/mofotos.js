const express = require('express');
const router = express.Router();
const mofotos = require('../controllers/mofotos');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateMofoto, isAuthor } = require('../middleware');
const Mofoto = require('../models/mofoto');

router.get('/', catchAsync(mofotos.index));

router.get('/new', isLoggedIn, mofotos.renderNewForm);

router.post('/', isLoggedIn, validateMofoto, catchAsync(mofotos.createMofoto));

router.get('/:id', catchAsync(mofotos.showMofoto));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(mofotos.renderEditForm)
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateMofoto,
  catchAsync(mofotos.updateMofoto)
);

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(mofotos.deleteMofoto));

module.exports = router;
