const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Container extends Model {}


Container.init(
    {
// general info
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        container_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tracking: {
            type: DataTypes.STRING,
            allowNull: true
        },

//time data
        requested_date: {
            type: DataTypes.STRING,
            allowNull: true
         },
        received_date: {
            type: DataTypes.STRING,
            allowNull: true
         },
        shipped_date: {
            type: DataTypes.STRING,
            allowNull: true
         },
//qty data
        qty: {
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
        cost: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

// distrubution data
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 1
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true
        },
        file_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fba: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        s3: {
            type: DataTypes.STRING,
            allowNull: true
        },
        custom_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        custom_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        custom_3: {
            type: DataTypes.STRING,
            allowNull: true
        },
// forighn key data
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
      modelName: 'container'
    }
  );

  module.exports = Container;
