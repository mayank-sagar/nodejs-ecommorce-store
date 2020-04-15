const Sequelize = require('Sequelize');
const sequelize = require('../utils/database');

const Product = sequelize.define('product',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true
    },

    title:Sequelize.STRING,
    price: {
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false    
    },
    description: {
        type:Sequelize.STRING,
        allowNull:false    
    },

    
});

module.exports = Product;











// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../utils/path');
// const p = path.join(rootDir,'data','products.json');
// const Cart = require('./cart');
// const db = require('../utils/database'); 
// const getProductsFromFile = (cb) => {
//         fs.readFile(p,(err,fileContent) => {
//             if(err) return cb([]);
//             cb(JSON.parse(fileContent));
//         });
// }
// module.exports = class Product {
    
//     constructor(id,title,imageUrl,price,description) {
//         this.id = id;
//         this.title = title; 
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;        
//     }

    // save() {
        // if(this.id) {
        //     getProductsFromFile(products => {
        //         const exitingProuctIndex = products.findIndex(prod => prod.id === this.id);
        //         const updatedProducts = [...products];
        //         updatedProducts[exitingProuctIndex] = this;
        //         fs.writeFile(p,JSON.stringify(updatedProducts), err => {
        //             console.log(err);
        //         });
        //     })
        // } else {     
        // this.id = Math.random().toString();
        // getProductsFromFile(products => {
        //     products.push(this);
        //     fs.writeFile(p,JSON.stringify(products),(err) => {
        //         console.log(err);
        //     });
        // });
        // }
    //     return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES(?,?,?,?)',[
    //         this.title,this.price,this.imageUrl,this.description
    //     ]);
    // }

    // static fetchAll() {
        // getProductsFromFile(cb);
    //     return db.execute('SELECT * FROM products');
    // }

    // static findById(productId) {
        // getProductsFromFile(products => {
        //     const product = products.find(product => product.id === productId);
        //     cb(product);
        // });  
    //     return db.execute('SELECT * FROM products WHERE id = ?',[productId]);  
    // }
    

    // static deleteById(productId) {
        // getProductsFromFile(products => {
        //     const product = products.filter(product => product.id === productId);
        //     const updatedProducts = products.filter(product => product.id !== productId);
        //     fs.writeFile(p,JSON.stringify(updatedProducts),(err) => {
        //         console.log(err);
        //         if(!err) {
        //             Cart.deleteProduct(productId,product.price);
        //         }
        //     })
        // });            
//     }
// }