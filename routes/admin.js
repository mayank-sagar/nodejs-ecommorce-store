const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');
const {body} = require('express-validator');
    
    router.get('/add-product',isAuth,adminController.getAddProduct);
   
    router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);
    
    router.get('/products',isAuth,adminController.getProducts);
    
    router.post('/add-product',
    isAuth,
    [
        body('title')
        .trim()
        .isAlphanumeric()
        .isLength({min:3})
        ,
        body('imageUrl')
        .isURL(),
        body('price')
        .trim()
        .isFloat()
        ,
        body('description')
        .trim()
        .isLength({min:8,max:200})
    ],
    adminController.postAddProduct);
    
    router.post('/edit-product',isAuth,
    [
        body('title')
        .trim()
        .isAlphanumeric()
        .isLength({min:3})
        ,
        body('imageUrl')
        .isURL(),
        body('price')
        .trim()
        .isFloat()
        ,
        body('description')
        .trim()
        .isLength({min:8,max:200})
    ],
    adminController.postEditProduct);

    router.post('/delete-product',isAuth,adminController.postDeleteProduct);

module.exports = router;