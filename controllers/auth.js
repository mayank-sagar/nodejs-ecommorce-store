const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');

const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key:'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'
  }
}));

exports.getLogin = (req,res,next) => {
  // const isLoggedIn = (req.get('Cookie')?req.get('Cookie').split('=')[1]:false);

  let message = req.flash('error');
  if(message.length > 0) {
    message  = message[0];
  } else {
    message = null;
  }
  const isLoggedIn = req.session.isLoggedIn;
return res.render('auth/login',{
  path:'/login',
  docTitle: 'Login',
  isAuthenticated:isLoggedIn,
  errorMessage: message,
  oldInput:{},
  validationErrors:[]
});
};

exports.postLogin = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/login',{
      path: '/login',
      docTitle: 'Login',
      isAuthenticated: false,
      errorMessage:errors.array()[0].msg,
      oldInput:{email:email,password:password},
      validationErrors:errors.array()
    });
  } 
  return User.findOne({email:email})
  .then((user) => {
    req.session.user = user;
    return req.session.save((err) => {
      console.log(err);
      return res.redirect('/');
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
});
}


exports.postLogout = (req,res,next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};

exports.postSignup = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render( 'auth/signup',{
      path: '/signup',
      docTitle: 'Signup',
      isAuthenticated: false,
      errorMessage:errors.array()[0].msg,
      oldInput: {email:email,password:password,confirmPassword:confirmPassword},
      validationErrors:errors.array()
    });
  }
  bcrypt.hash(password,12)
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
      return transporter.sendMail({
        to: email,
        from:'mayanksagar226@gmail.com',
        subject:'success sign up',
        html:'<h1>You successfully signed up</h1>',
        
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
 });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message  = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    isAuthenticated: false,
    errorMessage:message,
    oldInput: {email:'',password:'',confirmPassword:''},
    validationErrors:[]
  });
};


exports.getReset = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message  = message[0];
  } else {
    message = null;
  }
  return res.render('auth/reset',{
    path:'/reset',
    docTitle:'Reset Password',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32,(err,buffer) => {
    if(err) {
      console.log('err');
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        req.flash('error','No account with that email found');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExperation = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from:'mayanksagar226@gmail.com',
        subject:'Password Reset',
        html:`
        <p>You requested a password reser </p>
        <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set  a new password </p>
        `,
      })
    })
    .catch(() => {
      console.log(err)
    })
  });
};

module.exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExperation:{$gt: Date.now()}})
  .then((user) => {
    let message = req.flash('error');
    if(message.length > 0) {
      message  = message[0];
    } else {
      message = null;
    }
    return res.render('auth/new-password',{
      path:'/new-password',
      docTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken:token
    });  
  })
  .catch(err => console.log(err));
};

module.exports.postNewPassword = (req,res,next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser = null;
  User.findOne({
    resetToken:passwordToken,
    resetTokenExperation: {$gt: Date.now()},
    _id:userId
  })
  .then(user => {
    resetUser =  user;
    return bcrypt.hash(newPassword,12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExperation = undefined;
    return resetUser.save();
  })
  .then(() => {
    return res.redirect('/login');
  })
  .catch(err => console.log(err))

};