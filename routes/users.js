const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = await new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash('success', 'Welcome to Mofoto!');
      res.redirect('/mofotos');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect('/mofotos');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!');
  res.redirect('/mofotos');
});

module.exports = router;
