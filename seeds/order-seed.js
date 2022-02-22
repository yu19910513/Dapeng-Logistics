const { Order } = require('../models');

const orderData = [
    {
        boxNumber: "RR0000002",
        account: "Woosir",
        date: "12/21/2021",
        description: "Scarves",
        container: 2,
        box: 3,
        length: 2,
        width: 3,
        height: 4,
        status:0,
        origin: 3,
        user_id: 1
    },
    {
        boxNumber: "RR0000005",
        account: "Amy Woosir",
        date: "02/10/2022",
        description: "Socks",
        container: 4,
        box: 4,
        length: 3,
        width: 4,
        height: 5,
        status:1,
        origin: 3,
        user_id: 2
    },
    {
        boxNumber: "RR0000006",
        account: "Amy Woosir",
        date: "01/10/2022",
        description: "Silicon Tray Resin Mold (78 pcs)",
        container: 1,
        box: 10,
        length: 1,
        width: 1,
        height: 1,
        status:2,
        origin: 1,
        user_id: 2
    },
    {
        boxNumber: "RR0000007",
        account:"L-weik Socks 38 Hatch",
        date: "12/10/2021",
        description: "185-6pcs Oven Mitts Set-Gray*36",
        container: 10,
        box: 10,
        length: 1,
        width: 2,
        height: 3,
        status:0,
        origin: 1,
        user_id: 2
    },
]

const seedOrders = () => Order.bulkCreate(orderData);

module.exports = seedOrders;
