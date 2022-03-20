const express = require('express');
const router = express.Router();
const mofotos = require('../controllers/mofotos');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateMofoto, isAuthor } = require('../middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router
  .route('/')
  .get(catchAsync(mofotos.index))
  // .post(isLoggedIn, validateMofoto, catchAsync(mofotos.createMofoto));
  .post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send('IT WORKED!');
  });

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
