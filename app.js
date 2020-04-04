const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');
const path = require('path');
const app = express();
const rootDir = require('./utils/path');
//const expressHbs = require('express-handlebars');

//app.engine('hbs',expressHbs({layoutsDir:'views/layout', defaultLayout:'main-layout' ,extname:'hbs' }));

app.set('view engine','ejs');
app.set('views','views');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(express.static(path.join(rootDir,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
app.listen(3000);

// const server = http.createServer(app);

// server.listen(3000);

