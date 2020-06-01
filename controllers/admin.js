const Product = require('../models/product');
const fileHelper = require('../utils/file');
const {validationResult} = require('express-validator');
const  ITEMS_PER_PAGE = 2;
exports.getAddProduct = (req,res,next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
     res.render('admin/edit-product',
     {
         docTitle:"Add Products | Admin add product",
         path:"/admin/add-product",
         editing: false,
         isAuthenticated:req.user,
         hasError:false,
         errorMessage:null,
         validationErrors:[]
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
        isAuthenticated:req.user,
        hasError:false,
        errorMessage:null,
        validationErrors:[]
        });
    })
    .catch(err => {
        const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    });
};

 exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    if(!image) {
        return res.status(422)
        .render('admin/edit-product',{
            docTitle:"Add Product",
            path:'/admin/add-product',
            editing:false,
            hasError: true,
            product: {
                title:title,
                price:price,
                description:description
            },
            errorMessage:'Attached file is not an image.',
            validationErrors:[]
        });
    }

    const imageUrl = image.path;
    if(!errors.isEmpty()) {
       return res.status(422).render('admin/edit-product',
        {
            docTitle:"Add Products | Admin add product",
            path:"/admin/add-product",
            editing: false,
            isAuthenticated:req.user,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        })
    }
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
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    });
};


exports.getProducts = (req,res,next) => {


    const page = +req.query.page || 1;
    let totalItems = 0;
    Product.find({userId:req.user._id})
      // .select('title price -_id')
    // .populate('userId','name')
    //req.user.getProducts()
    .countDocuments().
    then(numProducts => {
        totalItems = numProducts;
        return  Product.find()
        .skip((page-1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    }).then(products => {
        return res.render('shop/product-list',{
            prods:products,
            docTitle:'Admin Products',
            path:'/admin/products',
            isAuthenticated:req.user,
            currentPage: page,
            hasNextPage:ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage:page + 1,
            previousPage:page - 1,
            lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
        });
    }).catch(err => {
        console.log(err);
     const error = new Error(err);
     error.httpStatusCode = 500;
     return next(error);
});

};

exports.postEditProduct = (req,res,next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       return res.status(422).render('admin/edit-product',
        {
            docTitle:"Edit Products | Admin Edit product",
            path:"/admin/add-product",
            editing: true,
            isAuthenticated:req.user,
            hasError:true,
            product:{
                title:updatedTitle,
                price:updatedPrice,
                description:updatedDesc,
                _id: id
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        })
    }


    Product.findById(id).then((product) => {
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title  = updatedTitle;
        product.price  = updatedPrice;
        if(image) {
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        } 
        product.description = updatedDesc;
        return product.save()
        .then((result) => {
            console.log('UPDATE SUCCESSFULLY')
            return res.redirect('/admin/products');
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
    }

exports.postDeleteProduct = (req,res,next) => {
    const productId = req.body.productId;
    Product.findById(productId).then((product) => {
        if(!product) {
            next(new Error("Product Not Found"));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({_id:productId, userId:req.user._id})
    })
    .then(() => {
        
        console.log("PRODUCT DELETED SUCCESS");
        return res.redirect('/admin/products');
    })
    .catch(err => {
        const error = new Error(err);
        console.log(error);
        error.httpStatusCode = 500;
        return next(error);
   });
}