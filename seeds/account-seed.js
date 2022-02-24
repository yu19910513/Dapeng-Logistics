const { Account } = require('../models');

const accountData = [
    {
        name: "Test",
        user_id: 2

    },
    {
        name: "Exam",
        user_id: 2

    },
    {
        name: "Rex",
        user_id: 2
    },
    {
        name: "Something",
        user_id: 1
    },
]



const seedAccounts = () => Account.bulkCreate(accountData);
module.exports = seedAccounts;
