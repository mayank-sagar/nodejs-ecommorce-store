const Sequilize = require('sequelize');
const sequelize = require('../utils/database');
const OrderItem = sequelize.define('orderItems',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    quantity: Sequilize.INTEGER
});

module.exports = OrderItem;