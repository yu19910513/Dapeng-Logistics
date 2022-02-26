const { Box } = require('../models');

const boxData = [
    {
        box_number: "RR0000002",
        account: "Woosir",
        date: "12/21/2021",
        description: "Scarves",
        container: 2,
        box: 3,
        length: 2,
        width: 3,
        height: 4,
        volume: 10,
        weight: 20,
        sku: "12345",
        qty_per_box: 100,
        order: 1,
        status:0,
        received_date: "1/21/2022",
        shipped_date: "2/20/2022",
        cost: 0,
        origin: 3,
        user_id: 1,
        batch_id:1,
        account_id:4
    },
    {
        box_number: "RR0000005",
        account: "Amy Woosir",
        date: "02/10/2022",
        description: "Socks",
        container: 4,
        box: 4,
        length: 3,
        width: 4,
        height: 5,
        volume: 10,
        weight: 20,
        sku: "12345",
        qty_per_box: 100,
        order: 2,
        status:1,
        received_date: "1/21/2022",
        shipped_date: "2/20/2022",
        cost: 0,
        tracking: '234567654345678hjklkjh',
        origin: 3,
        user_id: 2,
        batch_id: 3,
        account_id: 2
    },
    {
        box_number: "RR0000006",
        account: "Amy Woosir",
        date: "01/10/2022",
        description: "Silicon Tray Resin Mold (78 pcs)",
        container: 1,
        box: 10,
        length: 1,
        width: 1,
        height: 1,
        volume: 10,
        weight: 20,
        sku: "12345",
        qty_per_box: 100,
        order: 4,
        status:2,
        received_date: "1/21/2022",
        shipped_date: "2/20/2022",
        cost: 0,
        origin: 1,
        user_id: 2,
        batch_id: 4,
        account_id: 3
    },
    {
        box_number: "RR0000007",
        account:"L-weik Socks 38 Hatch",
        date: "12/10/2021",
        description: "185-6pcs Oven Mitts Set-Gray*36",
        container: 10,
        box: 10,
        length: 1,
        width: 2,
        height: 3,
        volume: 10,
        weight: 20,
        sku: "12345",
        qty_per_box: 100,
        order: 9,
        status:0,
        received_date: "1/21/2022",
        shipped_date: "2/20/2022",
        cost: 0,
        origin: 1,
        user_id: 2,
        batch_id: 2,
        account_id: 1
    },
]

const seedBoxes = () => Box.bulkCreate(boxData);

module.exports = seedBoxes;
