require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize({
    hostname: 'dapeng-logistics2022.ccff9y2ps46r.us-east-1.rds.amazonaws.com',
    username: 'dapeng_logistics',
    password: 'Ma09dapeng01',
    port: 3306
  })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
      dialectOptions: {
        decimalNumbers: true,
      },
    });

module.exports = sequelize;
