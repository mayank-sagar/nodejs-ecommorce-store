const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const p = path.join(rootDir,'data','cart.json');
module.exports = class Cart {

    static addProduct(id,productPrice) {
        fs.readFile(p,(err,fileContent) => {
            let cart = {products:[],totalPrice:0};

            console.log(JSON.stringify(fileContent));
            if(!err && fileContent.length > 0 ) {
                 cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProducts;
            if(existingProduct) {
                updatedProducts = {...existingProduct};
                updatedProducts.qty = updatedProducts.qty + 1; 
                cart.products[existingProductIndex] = updatedProducts;
            } else {
                updatedProducts = {id:id,qty:1};
                cart.products = [...cart.products,updatedProducts];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id,productPrice) {
        fs.readFile(p,(err,fileContent) => {
            let cart = null;
            if(err) {
                return;
            } else {
                cart = JSON.parse(fileContent);
            }
            const updatedCart = {...cart};
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product) {
                return ;
            } 
            const productQty = product.qty;
            updatedCart.products =  updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice *  productQty);
            fs.writeFile(p,JSON.stringify(updatedCart),(err) => {
                console.log(err);
            });
        });
    }
    

    static getCart(cb) {
        fs.readFile(p,(err,fileContent) => {
              const cart = JSON.parse(fileContent);
              if(err) {
                cb(null);   
              } else {
                  cb(cart);
              }
        });
    }

}