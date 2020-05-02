const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');
const path = require('path');
const app = express();
const rootDir = require('./utils/path');
const mongoConnect = require('./utils/database').mongoConnect;

app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use((req,res,next) => {
//   User.findByPk(1).then((user) => {
//     req.user = user;
//     console.log('rrr');
//     console.log(user);
//     next();
//   }).catch(err => console.log(err));
next();
});

app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/admin',adminRoutes);
// app.use(shopRoutes);
 app.use(errorController.get404);
 mongoConnect(client => {
app.listen(3000);
});