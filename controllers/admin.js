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
    
    req.user.getProducts({ where : { id: productId} })
    .then((products) => {
        const product = products[0];
        if(!product) {
            return res.redirect('/');
        } 
        return res.render('admin/edit-product',{
        docTitle:'Edit Product | Admin edit product',
        path: '/admin/edit-product',
        editing:Boolean(editMode),
        product:product
        });
    }).catch((err) => {
        console.log(err)
    });
    
};

 exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct(
        {
            title:title,
            imageUrl:imageUrl,
            price:price,
            description:description,   
        }
    ).then(result => {
            res.redirect('/');
            console.log(result);        
    })
    .catch(err => {
        console.log(err);
    });
};


exports.getProducts = (req,res,next) => {
    req.user.getProducts()
    .then(products => {
         return res.render('admin/products',{
                prods:products,
                docTitle:'Admin Products',
                path:'/admin/products'
        });
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req,res,next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findByPk(id).then((product) => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save();
    })
    .then((result) => {
        console.log('UPDATE SUCCESSFULLY')
        return res.redirect('/admin/products');
    })
    .catch((err) => {
        console.log(err);
    })
    }

exports.postDeleteProduct = (req,res,next) => {
    const productId = req.body.productId;
    Product.findByPk(productId).then((product) => {
        return product.destroy();
    }).then(() => {
        console.log("PRODUCT DELETED SUCCESSFULLY");
        return res.redirect('/admin/products');
    })
    .catch(() => {
        console.log("PRODUCT DELETED FAILED");
    })
}