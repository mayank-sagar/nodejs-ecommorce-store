exports.getLogin = (req,res,next) => {
return res.render('auth/login',{
  path:'/login',
  docTitle: 'Login',
});
};

exports.postLogin = (req,res,next) => {
return res.redirect('/');
};