const Product = require('../models/product');

exports.getAddProduct = (req,res,next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
     res.render('admin/edit-product',
     {
         docTitle:"Add Products | Admin add product",
         path:"/admin/add-product",
         editing: false
     })
 };

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }

    const productId = req.params.productId;
    
    Product.findById(productId,(product) => {
        if(!product) {
            return res.redirect('/');
        } 
        return res.render('admin/edit-product',{
        docTitle:'Edit Product | Admin edit product',
        path: '/admin/edit-product',
        editing:Boolean(editMode),
        product:product
        });
    });
};

 exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,imageUrl,price,description); 
    product.save();
        res.redirect('/');
};


exports.getProducts = (req,res,next) => {
    Product.fetchAll(products => {
        return res.render('admin/products',{
            prods:products,
            docTitle:'Admin Products',
            path:'/admin/products'
        });
    });
};