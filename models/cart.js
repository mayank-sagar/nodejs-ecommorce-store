const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const p = path.join(rootDir,'data','cart.json');
module.exports = class Cart {

    static addProduct(id,productPrice) {
        fs.readFile(p,(err,fileContent) => {
            let cart = {products:[],totalPrice:0};
            if(!err) {
                 cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProducts;
            if(existingProduct) {
                updatedProducts = {...existingProduct};
                updatedProducts.qty + 1; 
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
    

}