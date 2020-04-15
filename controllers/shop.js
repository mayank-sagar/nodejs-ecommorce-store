const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req,res,next) => {
    Product.findAll()
    .then(products => {
          return res.render('shop/product-list',{
            prods:products,
            docTitle:'Products',
            path:'/products'
        });
    }).
    catch(err => console.log(err));
}


exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    // Product.findAll({where: {id:prodId}})
    // .then((products) => {
    //      return res.render('shop/product-detail',{
    //         path:'/products',
    //         product:products[0],
    //         docTitle:products[0].title+' Details'
    // }) })
    // .catch(err => console.log(err));
    Product.findByPk(prodId)
    .then((product) => {
         return res.render('shop/product-detail',{
            path:'/products',
            product:product,
            docTitle:product.title+' Details'
    }) })
    .catch(err => console.log(err));
}


exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId,product => {
        Cart.addProduct(prodId,product.price);
    });
    res.redirect('/cart');
};


exports.postCartDeleteProducts = (req,res,next) => {
    const productId = req.body.productId;
    Product.findById(productId,(product) => {
        Cart.deleteProduct(productId,product.price);
        res.redirect('/cart');
    })
};

exports.getIndex = (req,res,next) => {
        Product.findAll().then(products => {
        return res.render('shop/index',{
            prods:products,
            docTitle:'Shop | Home ',
            path:'/'
        });
        }).catch(err => console.log(err));
}


exports.getCart = (req,res,cart) => {
    Cart.getCart((cart) => { 
        Product.fetchAll(products => {
            cartProducts = [];
            for(product of products) {
                const cartProduct = cart.products.find(p => p.id === product.id); 
                if(cartProduct) {
                    cartProducts.push({productData:product,qty:cartProduct.qty});
                }
            }
            return res.render('shop/cart',{
                path: '/cart',
                docTitle:'Your Cart',
                cart:cart,
                products:cartProducts
            });
        });
    })
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