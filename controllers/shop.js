const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

exports.getProducts = (req,res,next) => {
    Product.find()
    .then(products => {
          return res.render('shop/product-list',{
            prods:products,
            docTitle:'Products',
            path:'/products',
            isAuthenticated:req.user
        });
    }).
    catch(err => console.log(err));
}


exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then((product) => {
         return res.render('shop/product-detail',{
            path:'/products',
            product:product,
            docTitle:product.title+' Details',
            isAuthenticated:req.user
    }) })
    .catch(err => console.log(err));
}


exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;  

    Product.findById(prodId)
    .then(product => {  
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log('Product Added To Cart');
        console.log(result);
        res.redirect('/cart');     
    })
    .catch(err => console.log(err))
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart().then((cart) => {
    //     fetchedCart = cart;
    //     return cart.getProducts({ where: {id: prodId} });
    // })
    // .then(products => {
    //     let product;
    //     if(products.length > 0) {
    //         product = products[0]; 
    //     }
    //     if(product) {
    //             const oldQuantity = product.cartItems.quantity;
    //             newQuantity = oldQuantity + 1;
    //     }

    //     return Product.findByPk(prodId)
    //  })
    // .then((product) => {
    //     return fetchedCart.addProduct(product, {through:{ quantity: newQuantity }})
    // })
    //  .then((cart) => {
    //     res.redirect('/cart');     
    // })
    // .catch((err) => console.log(err));

    // console.log(prodId);
    // Product.findById(prodId,product => {
    //     Cart.addProduct(prodId,product.price);
    // });
    // res.redirect('/cart');
};


exports.postCartDeleteProducts = (req,res,next) => {
    const productId = req.body.productId;
    req.user.removeFromCart(productId)
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


exports.postOrder = (req,res,next) => {
    req.user.
    populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity:i.quantity,product: {...i.productId._doc}}
        });
        order = new Order({
            user: {
                name:req.user.name,
                userId: req.user
            },
            products:products
        });
        return order.save()
    }).then(() => {
        req.user.clearCart().then( result => {
            return res.redirect('/orders');
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
};

exports.getIndex = (req,res,next) => {
        Product.find().then(products => {
        return res.render('shop/index',{
            prods:products,
            docTitle:'Shop | Home ',
            path:'/',
            isAuthenticated:req.user
        });
        }).catch(err => console.log(err));
}


exports.getCart = (req,res) => {
    req.user.
    populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
        const products = user.cart.items;
        return res.render('shop/cart',{
                path: '/cart',
                docTitle:'Your Cart',
                products:products,
                isAuthenticated:req.user
            });
    })
    .catch(err => console.log(err));
}


// exports.getCheckout = (req,res,cart) => {
//     return res.render('shop/checkout',{
//         path: '/checkout',
//         docTitle:'Checkout',
//     });
//     }
    
exports.getOrders = (req,res,next) => {
    Order.find({'user.userId':req.user})
    .then(orders => {
        console.log(orders);
        return res.render('shop/orders',{
        path:'/orders',
        docTitle:'My Orders',
        orders:orders,
        isAuthenticated:req.sesion.user
    })
    }).catch(err => console.log(err));
};