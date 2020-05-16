const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  email: {
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
  cart: {
    items: [
      {
        productId:{
          type:Schema.Types.ObjectId,
          required:true,
          ref:'Product'
        },
        quantity: {
          type:Number,
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product)  {
    const cartProduct = this.cart.items.findIndex(cp => {
       return cp.productId.toString() === product._id.toString();
     })

     let newQuantity = 1;
     let updatedCartItems = [...this.cart.items];

     if(cartProduct >= 0) {
       newQuantity = this.cart.items[cartProduct].quantity + 1;
       updatedCartItems[cartProduct].quantity = newQuantity;
     } else {
       updatedCartItems.push(
         {
           productId: product._id,
           quantity:newQuantity
        });
     }

     const updatedCart = {
       items: updatedCartItems
     };

     this.cart = updatedCart;
     return this.save();
};


userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString(); 
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = {
    items:[]
  }
  return this.save();
};


module.exports = mongoose.model('User',userSchema);

// const MongoDb = require('mongodb');
// const getDb = require('../utils/database').getDb;
// const ObjectID =  MongoDb.ObjectID;

// class User {
//   constructor(username,email,cart,_id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id? new ObjectID(_id):null;
//   }

//   save() {
//   const db = getDb();
//   return db.collection('users').insertOne(this);
//   }

//   addToCart(product) {
//     const cartProduct = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     })

//     let newQuantity = 1;
//     let updatedCartItems = [...this.cart.items];
//     if(cartProduct >= 0) {
//       newQuantity = this.cart.items[cartProduct].quantity + 1;
//       updatedCartItems[cartProduct].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({productId: new ObjectID(product._id),quantity:newQuantity});
//     }
//     const updatedCart = { items:  updatedCartItems };
//     const db = getDb();
//     return db.collection('users').updateOne({_id: this._id},{ $set:{
//       cart:updatedCart
//     }});
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => i.productId);
//     return db.collection('products').find({_id:{$in: productIds }})
//     .toArray()
//     .then(products => {
//       return products.map(p => {
//         return {...p,quantity: this.cart.items.find(i => {
//           return i.productId.toString() === p._id.toString()
//         }).quantity
//       };
//       })
//     })
//     .catch(err => console.log(err));
//   }

//   deleteItemFromCart(productId) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString(); 
//     });
//     return db.collection('users').
//     updateOne({_id: this._id},{$set: {cart:{items:updatedCartItems}}});
//   }


//   getOrder() {
//     const db = getDb();
//     return db
//     .collection('orders')
//     .find({'user._id':this._id})
//     .toArray();
//   }

//   addOrder() {
//     const db = getDb();
//     let order ;
//     return this.getCart()
//     .then(products => {
//       order = {
//         items:products,
//         user: {
//           _id: this._id,
//           name:this.name
//         }
//       }
//       return db.collection('orders').insertOne(order)
//     })
//     .then(() => {
//       this.cart = {items:[]};
//       return db.collection('users').
//       updateOne({_id: this._id},{$set:{cart: {items:[]} }});
//     })
//     .catch(err => console.log(err))
//   }


//   static findById(userId) {
//   const db = getDb();
//   return db.collection('users')
//   .findOne({_id: new ObjectID(userId)})
//   }

  
// }

// module.exports = User;

