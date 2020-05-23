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
const multer = require('multer');
const store  = new MongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions'
});
const fileStorage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,'images');
  },
  filename: (req,file,cb) => {
    cb(null,Math.random()+'-'+file.originalname);
  }
})

const fileFilter = (req,file,cb) => {
if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
  return cb(null,true);
}
cb(null,false);
};

const csrfProtection = csrf();
// const getDb = require('./utils/database').getDb;
// const mongoConnect = require('./utils/database').mongoConnect;
// const User = require('./models/user');
app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use(session({secret:'secret', resave: false, saveUninitialized:false,store:store}));
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id).then((user) => {
   
    if(!user) {
      return next();
    }
    req.user = user;
    next(); 
  }).catch(err => {
    next(err);
  });
})
app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
})
app.get('/500',errorController.get500);
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.use((error,req,res,next) => {
 return res.status(500).render('shop/500',{
  docTitle:'500',
  path:'500',
  isAuthenticated:req.user
})
});

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