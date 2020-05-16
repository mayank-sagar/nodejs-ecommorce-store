const Product = require('../models/product');


exports.getAddProduct = (req,res,next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
     res.render('admin/edit-product',
     {
         docTitle:"Add Products | Admin add product",
         path:"/admin/add-product",
         editing: false,
         isAuthenticated:req.user
     })
 };

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
    .then((product) => {
        if(!product) {
            return res.redirect('/');
        } 
        return res.render('admin/edit-product',{
        docTitle:'Edit Product | Admin edit product',
        path: '/admin/edit-product',
        editing:Boolean(editMode),
        product:product,
        isAuthenticated:req.user
        });
    })
    .catch(err => console.log(err));
};

 exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title:title,
        price: price,
        description:description,
        imageUrl: imageUrl,
        userId:req.user._id
    });
    product.save()
    .then(result => {
            res.redirect('/admin/products');
            console.log(result);        
    })
    .catch(err => {
        console.log(err);
    });
};


exports.getProducts = (req,res,next) => {
    //req.user.getProducts()
    Product.find({userId:req.user._id})
    // .select('title price -_id')
    // .populate('userId','name')
    .then(products => {
        console.log(products);
         return res.render('admin/products',{
                prods:products,
                docTitle:'Admin Products',
                path:'/admin/products',
                isAuthenticated:req.user
        });
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req,res,next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findById(id).then((product) => {
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title  = updatedTitle;
        product.price  = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save()
        .then((result) => {
            console.log('UPDATE SUCCESSFULLY')
            return res.redirect('/admin/products');
        })
        .catch(err => console.log(err))
    })
    .catch((err) => {
        console.log(err);
    })
    }

exports.postDeleteProduct = (req,res,next) => {
    const productId = req.body.productId;
    Product.delete({_id:productId, userId:req.user._id})
    .then(() => {
        console.log("PRODUCT DELETED SUCCESS");
        return res.redirect('/admin/products');
    })
    .catch(() => {
        console.log("PRODUCT DELETED FAILED");
    })
}