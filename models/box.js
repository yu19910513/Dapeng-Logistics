const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Box extends Model {}


Box.init(
    {
// general info
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        box_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

//time data
        received_date: {
            type: DataTypes.STRING,
            allowNull: true
         },
        shipped_date: {
            type: DataTypes.STRING,
            allowNull: true
         },

//qty data
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        qty_per_box: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
// dimension data
        length: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        volume: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

// distrubution data
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        origin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

// forighn key data
        batch_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'batch',
            key: 'id'
           },
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'user',
            key: 'id'
           },
        },
        account_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'account',
              key: 'id'
             },
          }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'box'
    }
  );

  module.exports = Box;
