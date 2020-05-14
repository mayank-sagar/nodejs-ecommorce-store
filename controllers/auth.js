const User = require('../models/user');
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
  User.findById('5eb639d92baaa9223cffb3ac').then((user) => {
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