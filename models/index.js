const Admin = require('./admin');
const User = require('./user');
const Order = require('./order');

Admin.hasMany(User, {
    foreignKey: "admin_id"
});

User.belongTo(Admin, {
    foreignKey: "admin_id"
})

User.hasMany(Order, {
    foreignKey: "user_id"
});

Order.belongTo(User, {
    foreignKey: "user_id"
});

Admin.hasMany(Order, {
    foreignKey: "admin_id"
});

Order.belongTo(Admin, {
    foreignKey: "admin_id"
});

module.exports = {Admin, User, Order};
