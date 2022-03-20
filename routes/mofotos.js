const express = require('express');
const router = express.Router();
const mofotos = require('../controllers/mofotos');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateMofoto, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(mofotos.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateMofoto,
    catchAsync(mofotos.createMofoto)
  );

router.get('/new', isLoggedIn, mofotos.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(mofotos.showMofoto))
  .put(isLoggedIn, isAuthor, validateMofoto, catchAsync(mofotos.updateMofoto))
  .delete(isLoggedIn, isAuthor, catchAsync(mofotos.deleteMofoto));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(mofotos.renderEditForm)
);

module.exports = router;
