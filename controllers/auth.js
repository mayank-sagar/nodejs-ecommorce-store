const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next) => {
  // const isLoggedIn = (req.get('Cookie')?req.get('Cookie').split('=')[1]:false);

  console.log(req.session.isLoggedIn);
  const isLoggedIn = req.session.isLoggedIn;
return res.render('auth/login',{
  path:'/login',
  docTitle: 'Login',
  isAuthenticated:isLoggedIn
});
};

exports.postLogin = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.email;
  User.findOne({email:email})
  .then((user) => {
    if(user) {

    }
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      return res.redirect('/');
    });
  }).catch(err => console.log(err));
};


exports.postLogout = (req,res,next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};

exports.postSignup = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  User.findOne({email:email})
  .then((docUser) => {
    if(docUser) {
      return res.redirect('/signup');
    }
    return bcrypt.hash(password,12)
    .then((hashedPassword) => {
      console.log(hashedPassword);
      const user = new User({
        email:email,
        password:hashedPassword,
        cart: { items:[]}
      });
      return user.save();
    }).then(() => {
      res.redirect('/login');
    }).catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    isAuthenticated: false
  });
};