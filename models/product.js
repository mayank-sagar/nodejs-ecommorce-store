
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    imageUrl: {
        type:String,
        required: true
    }
});

module.exports = mongoose.model('Product',productSchema);

// const Mongodb = require('mongodb');
// const getDb = require('../utils/database').getDb;
// ObjectID = Mongodb.ObjectID;
// class Product {

//     constructor(title,price,imageUrl,description,_id,userId) {
//         this.title =  title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description; 
//         this._id = _id?new ObjectID(_id):null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp ;
//         if(this._id) {
//             dbOp = db.collection('products')
//             .updateOne({_id:this._id},{$set: this });
//         } else {
//             dbOp = db.collection('products')
//             .insertOne(this);
//         }
//         return dbOp.then((result) => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
        
//     }


//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray().then((products) => {
//             console.log(products);
//             return products;
//         })
//         .catch(err => console.log(err));
//     }

//     static findById(prodId) {
//         const db = getDb();
//         return db.collection('products').find({_id: new Mongodb.ObjectID(prodId)})
//         .next()
//         .then((product) => {
//             console.log(product);
//             return product; 
//         })
//         .catch( err => console.log(err))
//     }

//     static deleteById(prodId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new ObjectID(prodId)})
//         .then(result => console.log('DELETED') )
//         .catch(err => console.log(err));
//     }
// }

// module.exports = Product;











