const Sequilize = require('sequelize');
const sequelize = require('../utils/database');
const CartItem = sequelize.define('cartItems',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    quantity: Sequilize.INTEGER
});

module.exports = CartItem;