const User = require('./user');
const Box = require('./box');
const Account = require('./account');
const Batch = require('./batch');
const Container = require('./container');
const Item = require('./item');

//Level 1: User
User.hasMany(Account, {
    foreignKey: "user_id"
});
User.hasMany(Batch, {
    foreignKey: "user_id"
});
User.hasMany(Box, {
    foreignKey: "user_id"
});
User.hasMany(Container, {
    foreignKey: "user_id"
});
User.hasMany(Item, {
    foreignKey: "user_id"
});

//Level 2: Account
Account.hasMany(Batch, {
    foreignKey: "account_id"
});
Account.hasMany(Box, {
    foreignKey: "account_id"
});
Account.hasMany(Container, {
    foreignKey: "account_id"
});
Account.hasMany(Item, {
    foreignKey: "account_id"
});

//Level 3: {Batch, Container}
Batch.hasMany(Box, {
    foreignKey: "batch_id"
});
Container.hasMany(Item, {
    foreignKey: "container_id"
});



Account.belongsTo(User, {
    foreignKey: "user_id"
});
Batch.belongsTo(User, {
    foreignKey: "user_id"
});
Box.belongsTo(User, {
    foreignKey: "user_id"
});
Container.belongsTo(User, {
    foreignKey: "user_id"
});
Item.belongsTo(User, {
    foreignKey: "user_id"
});
/////////////////
Batch.belongsTo(Account, {
    foreignKey: "account_id"
});
Box.belongsTo(Account, {
    foreignKey: "account_id"
});
Container.belongsTo(Account, {
    foreignKey: "account_id"
});
Item.belongsTo(Account, {
    foreignKey: "account_id"
});
/////////////////
Box.belongsTo(Batch, {
    foreignKey: "batch_id"
});
Item.belongsTo(Container, {
    foreignKey: "container_id"
});



// module.exports = {User, Account, Batch, Box, Container, Item};
module.exports = {User, Account, Batch, Box};
