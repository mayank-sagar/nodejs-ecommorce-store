const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/login',authController.getLogin); 

router.get('/signup',authController.getSignup);

router.post('/login',[
  body('email')
  .isEmail()
  .withMessage('Please Enter Valid Email')
  .custom((value,{req}) => {
    return User.findOne({email:value})
    .then((docUser) => {
      if(!docUser) {
        return Promise.reject('Invalid Email or Password.');
      }
    })
  }),
  body('password',
  'Please Enter a password with only number and text and at least 5 characters.')
  .isLength({min:5})
  .isAlphanumeric()
  .custom((value,{req}) => {
    return User.findOne({email:req.body.email})
    .then((user) => {
      return bcrypt.compare(value,user.password)
      .then(isMatch => {
        if(!isMatch) {
          return Promise.reject('Invalid Email or Password.');
        }
      })
    })
  })
],authController.postLogin); 

router.post('/signup',
  [
    check('email').
    isEmail()
    .withMessage('Please Enter Valid Email')
    .custom((value, {req}) => {
      // if(value == 'test@test.com') {
      //   throw new Error('This Email address is forbidden');
      // }
      // return true;
       return User.findOne({email:value})
      .then((docUser) => {
        if(docUser) {
          return Promise.reject('E-mail exists already, please pick a different one.');
        }
    })}).normalizeEmail(),
    body('password','Please Enter a password with only number and text and at least 5 characters.')
    .trim()
    .isLength({min:5})
    .isAlphanumeric(),
    body('confirmPassword')
    .trim()
    .custom((value,{req}) => {
      console.log(value);
      console.log(req.body.password);
      if(value !== req.body.password) {
        throw new Error('Passwords have to match')
      }
      return true;
    })
  ],
  authController.postSignup);

router.post('/logout',authController.postLogout); 

router.get('/reset',authController.getReset); 

router.post('/reset',authController.postReset); 

router.get('/reset/:token',authController.getNewPassword); 

router.post('/new-password',authController.postNewPassword); 

module.exports = router;