const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Order extends Model {}


Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        boxNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
           type: DataTypes.STRING,
           allowNull: false,
           defaultValue: new Date()
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bigBoxNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        smallBox: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        length: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        wideth: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'order'
    }
  );

  module.exports = Order;
