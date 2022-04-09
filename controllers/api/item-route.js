const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

router.put('/account_merge', withAuth, (req, res) => {
    Item.update({
        account_id: req.body.account_id_2
      },
      {
        where: {
            account_id: req.body.account_id
        }
      })
      .then(dbItemData => {
        if (!dbItemData[0]) {
          res.status(404).json({ message: 'This Item does not exist!' });
          return;
        }
        res.json(dbItemData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/new', withAuth, (req, res) => {
  Item.create({
    item_number: req.body.item_number,
    user_id: req.body.user_id,
    account_id: req.body.account_id,
    container_id: req.body.container_id,
    qty_per_sku: req.body.qty_per_sku,
    description: req.body.description
  })
    .then(dbItemData => {
        res.json(dbItemData)
      })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);

    });
});

router.get('/infoPerNumber/:key', withAuth, async (req, res) => {
  try {
    const itemData = await Item.findOne({
      where: {
        item_number: req.params.key,
      },
      attributes: [
        'user_id',
        'account_id',
        'item_number',
        'container_id',
        'description'
      ],
        include: [
          {
            model: Account,
            attributes: [
            'name',
            'id'
          ]},
          {
            model: Container,
            attributes: [
            'container_number',
            'id'
          ]},
          {
            model: User,
            attributes: [
            'name',
            'id'
          ]}
        ]
      })

    const data = itemData.get({plain: true});
    res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/allItemAdmin', withAuth, async (req, res) => {
  try {
    const itemData = await Item.findAll({
      where: {

      },
      attributes: [
        'id',
        'item_number',
        'qty_per_sku',
        'user_id',
        'account_id',
        'container_id'
      ],
      include: [
        {
          model: Container,
          attributes: [
            's3',
            'notes',
            'id',
            'container_number',
            'description',
            'cost',
            'requested_date',
            'received_date',
            'shipped_date',
            'type',
            'length',
            'width',
            'height',
            'weight',
            'volume',
            'status',
            'location',
            'file',
            'file_2',
            'fba',
            'bill_received',
            'bill_storage',
            'bill_shipped'
          ]
        },
        {
          model: Account,
          attributes: [
            'name'
          ]
        },
        {
          model: User,
          attributes: [
            'name'
          ]
        }
      ]
    });
    const items = itemData.map(i => i.get({ plain: true }));
    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

})

module.exports = router;
