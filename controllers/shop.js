const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('sk_test_51GqUuDA9Az0eGhUa1GuBXDzaV3tw6K2OFJqQDM6Z9kn7JAYOK0uXZAO8MFmLysarKcmcqMWbzO4vRr5QNHvM0r44006cC4P4Rh');
// const Cart = require('../models/cart');
const  ITEMS_PER_PAGE = 2;

exports.getProducts = (req,res,next) => {
    
    const page = +req.query.page || 1;
    let totalItems = 0;
    Product.find().countDocuments().then(numProducts => {
        totalItems = numProducts;
        
        return  Product.find()
        .skip((page-1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    }).then(products => {
        res.render('shop/product-list',{
            prods:products,
            docTitle:'Products',
            path:'/products',
            isAuthenticated:req.user,
            currentPage: page,
            hasNextPage:ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage:page + 1,
            previousPage:page - 1,
            lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
        });
    }).catch(err => {
     const error = new Error(err);
     error.httpStatusCode = 500;
     return next(error);
});;

   
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
     .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    });
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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
   });
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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
   });
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
                email:req.user.email,
                userId: req.user
            },
            products:products
        });
        return order.save()
    }).then(() => {
        req.user.clearCart().then( result => {
            return res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
       });
    })
     .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    });
};

exports.getIndex = (req,res,next) => {
        const page = +req.query.page || 1;
        let totalItems = 0;
        Product.find().countDocuments().then(numProducts => {
            totalItems = numProducts;
            
            return  Product.find()
            .skip((page-1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
        }).then(products => {
        return res.render('shop/index',{
            prods:products,
            docTitle:'Shop | Home ',
            path:'/',
            currentPage: page,
            hasNextPage:ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage:page + 1,
            previousPage:page - 1,
            lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
        });
        }).catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    });;
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
    


exports.getCheckout = (req,res,next) => {
    let products;
    let total;
    req.user.
    populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
        products = user.cart.items;
        total = 0;
        products.forEach((p) => {
            total += p.quantity * p.productId.price;
        });
        return stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:products.map((p) => {
                return {
                    name:p.productId.title,
                    description:p.productId.description,
                    amount:p.productId.price  * 100,
                    currency: 'usd',
                    quantity: p.quantity,
                    "address[line1]":"510 Townsend St" ,
                    "address[postal_code]":98140,
                    "address[city]":"San Francisco" ,
                    "address[state]":'CA',
                    "address[country]":'US'
                };
            }),
            success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
        });
    })
    .then((session) => {
        return res.render('shop/checkout',{
            path: '/checkout',
            docTitle:'Checkout',
            products:products,
            isAuthenticated:req.user,
            totalSum:total,
            sessionId:session.id
        });
    })
    .catch(err => console.log(err));
};
exports.getOrders = (req,res,next) => {
    Order.find({'user.userId':req.user})
    .then(orders => {
        console.log(orders);
        return res.render('shop/orders',{
        path:'/orders',
        docTitle:'My Orders',
        orders:orders,
        isAuthenticated:req.session.user
    })
    }).catch(err => console.log(err));
};


exports.getInvoice = (req,res,next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then((order) => {
        if(!order) {
            return next(new Error('No order found'));
        } 
        if(order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'))
        }
        const invoiceName = 'invoice-'+orderId+'.pdf';
        const invoicePath = path.join('data','invoices',invoiceName);
        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition','inline; filename="'+ invoiceName + '"');
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text("Invoice",{
            underline:true
        });
        pdfDoc.text('------------------------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            pdfDoc.fontSize(14)
                .text(prod.product.title 
                + ' - ' 
                + prod.quantity 
                + ' * ' 
                + '$' 
                + prod.product.price);
        });
        pdfDoc.fontSize(20).text('--------');
        pdfDoc.text('Total Price: $' + totalPrice);
        pdfDoc.end();
    }).catch(err => next(err));
}

exports.getCheckoutSuccess = (req,res,next) => {
    req.user.
    populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity:i.quantity,product: {...i.productId._doc}}
        });
        order = new Order({
            user: {
                email:req.user.email,
                userId: req.user
            },
            products:products
        });
        return order.save()
    }).then(() => {
        req.user.clearCart().then( result => {
            return res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
       });
    })
     .catch(err => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    });
};