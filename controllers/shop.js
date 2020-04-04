const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req,res,next) => {
    Product.fetchAll(products => {
        return res.render('shop/product-list',{
            prods:products,
            docTitle:'Shop | Home ',
            path:'/products'
        });
    });
};


exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId,product => {
        
        return res.render('shop/product-detail',{
            path:'/products',
            product:product,
            docTitle:product.title+' Details'
        });
    })
}


exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId,product => {
        Cart.addProduct(prodId,product.price);
    });
    res.redirect('/cart');
};

exports.getIndex = (req,res,next) => {
    Product.fetchAll(products => {
        return res.render('shop/index',{
            prods:products,
            docTitle:'Shop | Home ',
            path:'/'
        });
    });
}


exports.getCart = (req,res,cart) => {
return res.render('shop/cart',{
    path: '/cart',
    docTitle:'Your Cart',
});
}


exports.getCheckout = (req,res,cart) => {
    return res.render('shop/checkout',{
        path: '/checkout',
        docTitle:'Checkout',
    });
    }
    
exports.getOrders = (req,res,next) => {
    return res.render('shop/orders',{
        path:'/orders',
        docTitle:'My Orders'
    })
};