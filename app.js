const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://user:password%40123@ecommerce-dphpz.mongodb.net/ecommerce?retryWrites=true&w=majority';
const errorController = require('./controllers/errors');
const path = require('path');
const app = express();
const rootDir = require('./utils/path');
const User = require('./models/user');
const csrf = require('csurf');
const flash = require('connect-flash');

const store  = new MongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions'
});
const csrfProtection = csrf();
// const getDb = require('./utils/database').getDb;
// const mongoConnect = require('./utils/database').mongoConnect;
// const User = require('./models/user');
app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:'secret', resave: false, saveUninitialized:false,store:store}));
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id).then((user) => {
    req.user = user;
    next(); 
  }).catch(err => console.log(err));
})
app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
})
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
 app.use(errorController.get404);

mongoose.connect(MONGODB_URI,{ 
  useNewUrlParser: true
})
.then((result) => { 
  // User.findOne().then((user) => {
  //   if(!user) {
  //     const user = new User({
  //       name:'Max',
  //       email:'max@test.com',
  //       cart:{
  //         items:[]
  //       }
  //     });    
  //     user.save();
  //   }
  // });
  app.listen(3000)
})
.catch(err => console.log('in app js: ',err));