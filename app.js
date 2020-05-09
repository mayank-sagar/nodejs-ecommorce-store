const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoose = require('mongoose');
const errorController = require('./controllers/errors');
const path = require('path');
const app = express();
const rootDir = require('./utils/path');
// const getDb = require('./utils/database').getDb;
// const mongoConnect = require('./utils/database').mongoConnect;
// const User = require('./models/user');
app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));
// app.use((req,res,next) => {
//   User.findById('5eadc6d6ad213e1f48d5ce19').then((user) => {
//     req.user = new User(user.name,user.title,user.cart,user._id);
//     next();
//   }).catch(err => console.log(err));
// });

app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/admin',adminRoutes);
app.use(shopRoutes);
 app.use(errorController.get404);

mongoose.connect('mongodb+srv://user:password%40123@ecommerce-dphpz.mongodb.net/ecommerce?retryWrites=true&w=majority',{ 
  useNewUrlParser: true
})
.then((result) => {
  app.listen(3000)
})
.catch(err => console.log('in app js: ',err));