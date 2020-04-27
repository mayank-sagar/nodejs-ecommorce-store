const Sequilize = require('sequelize');
const sequelize = require('../utils/database');
const Order = sequelize.define('order',{
    id:{
        type:Sequilize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    }
});

module.exports = Order;