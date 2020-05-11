const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const errorController = require('./controllers/errors');
const path = require('path');
const app = express();
const rootDir = require('./utils/path');
const User = require('./models/user');
// const getDb = require('./utils/database').getDb;
// const mongoConnect = require('./utils/database').mongoConnect;
// const User = require('./models/user');
app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use((req,res,next) => {
  User.findById('5eb639d92baaa9223cffb3ac').then((user) => {
    req.user =  user;
    next();
  }).catch(err => console.log(err));
});

app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:'secret', resave: false, saveUninitialized:false}));
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
 app.use(errorController.get404);

mongoose.connect('mongodb+srv://user:password%40123@ecommerce-dphpz.mongodb.net/ecommerce?retryWrites=true&w=majority',{ 
  useNewUrlParser: true
})
.then((result) => { 
  User.findOne().then((user) => {
    if(!user) {
      const user = new User({
        name:'Max',
        email:'max@test.com',
        cart:{
          items:[]
        }
      });    
      user.save();
    }
  });
  app.listen(3000)
})
.catch(err => console.log('in app js: ',err));