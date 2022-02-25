const User = require('./user');
const Box = require('./box');
const Account = require('./account');
const Batch = require('./batch');


User.hasMany(Account, {
    foreignKey: "user_id"
});
User.hasMany(Batch, {
    foreignKey: "user_id"
});
User.hasMany(Box, {
    foreignKey: "user_id"
});
///////////////
Account.hasMany(Batch, {
    foreignKey: "account_id"
});
Account.hasMany(Box, {
    foreignKey: "account_id"
});
///////////////
Batch.hasMany(Box, {
    foreignKey: "batch_id"
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
/////////////////
Batch.belongsTo(Account, {
    foreignKey: "account_id"
});
Box.belongsTo(Account, {
    foreignKey: "account_id"
});
/////////////////
Box.belongsTo(Batch, {
    foreignKey: "batch_id"
});



module.exports = {User, Account, Batch, Box};
