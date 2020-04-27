const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');
const path = require('path');
const app = express();
const rootDir = require('./utils/path');
const sequelize = require('./utils/database')
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
let  cartUser = null;
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product,{ through: CartItem});
Product.belongsToMany(Cart,{ through: CartItem});
//const expressHbs = require('express-handlebars');

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , {through : OrderItem});
Product.belongsToMany(Order , {through : OrderItem})

//app.engine('hbs',expressHbs({layoutsDir:'views/layout', defaultLayout:'main-layout' ,extname:'hbs' }));
app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use((req,res,next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    console.log('rrr');
    console.log(user);
    next();
  }).catch(err => console.log(err));
});

app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
  sequelize.sync()
  .then(result => {
 // console.log(result)
  return User.findByPk(1);
}).then((user) => {
  if(!user) {
   return User.create({name:'Max',email:'test@test.com'});
  }
  return user;
}).then((user) => {
  cartUser = user;
  return user.getCart();
}).then((cart) => {
  if(!cart) {
    return cartUser.createCart()
  }
  return cart;
})
.then(() => {
  app.listen(3000);
})
.catch(err => console.log(err));


// const server = http.createServer(app);

// server.listen(3000);

