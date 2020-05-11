exports.getLogin = (req,res,next) => {
  const isLoggedIn = (req.get('Cookie')?req.get('Cookie').split('=')[1]:false);
return res.render('auth/login',{
  path:'/login',
  docTitle: 'Login',
  isAuthenticated:isLoggedIn
});
};

exports.postLogin = (req,res,next) => {
//  res.setHeader('Set-Cookie','loggedIn=true;Max-Age=10');
  // res.setHeader('Set-Cookie','loggedIn=true;HttpOnly');
  req.session.isLoggedIn = true;
  return res.redirect('/');
};