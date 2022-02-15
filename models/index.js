const User = require('./user');
const Order = require('./order');

User.hasMany(Order, {
    foreignKey: "user_id"
});

Order.belongTo(User, {
    foreignKey: "user_id"
});


module.exports = {User, Order};
