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
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart().then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({ where: {id: prodId} });
    })
    .then(products => {
        let product;
        if(products.length > 0) {
            product = products[0]; 
        }
        if(product) {
                const oldQuantity = product.cartItems.quantity;
                newQuantity = oldQuantity + 1;
        }

        return Product.findByPk(prodId)
     })
    .then((product) => {
        return fetchedCart.addProduct(product, {through:{ quantity: newQuantity }})
    })
     .then((cart) => {
        res.redirect('/cart');     
    })
    .catch((err) => console.log(err));

    // console.log(prodId);
    // Product.findById(prodId,product => {
    //     Cart.addProduct(prodId,product.price);
    // });
    // res.redirect('/cart');
};


exports.postCartDeleteProducts = (req,res,next) => {
    const productId = req.body.productId;
    req.user.getCart().then((cart) => {
        return cart.getProducts({ where:{id:productId}})
    })
    .then((products) => {
        const product = products[0];
        return product.cartItems.destroy();
    }).then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
  
};


exports.postOrder = (req,res,next) => {
    let orderProducts = null;
    let fetchedCart  = null;
    req.user.getCart().then((cart) => {
        fetchedCart = cart;
        return cart.getProducts()
    })
    .then((products) => {
        orderProducts = products;
        req.user.createOrder()
        .then((order) => {
            return order.addProducts(orderProducts.map(product => {
                product.orderItems = { quantity: product.cartItems.quantity };
                return product;
            }));
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            return res.redirect('/orders');
        })
        .catch()
    })
    .catch(err => console.log(err))
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
    req.user.getCart()
    .then((cart) => {
        return cart.getProducts()
    })
    .then((products) => {
        console.log('hrrr');
        console.log(products);
        return res.render('shop/cart',{
                path: '/cart',
                docTitle:'Your Cart',
                cart:cart,
                products:products
            });
    })
    .catch(err => console.log(err));
}


exports.getCheckout = (req,res,cart) => {
    return res.render('shop/checkout',{
        path: '/checkout',
        docTitle:'Checkout',
    });
    }
    
exports.getOrders = (req,res,next) => {
    req.user
    .getOrders({include: ['products']})
    .then(orders => {

        console.log("My Orders",orders[0]);
     return res.render('shop/orders',{
        path:'/orders',
        docTitle:'My Orders',
        orders:orders
    })
    }).catch(err => console.log(err));
};