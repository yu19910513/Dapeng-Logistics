const seedOrders = require('./order-seed');
const seedUsers = require('./user-seed');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

  await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

  await seedOrders();
    console.log('\n----- ORDERS SEEDED -----\n');

  process.exit(0);
};

seedAll();
