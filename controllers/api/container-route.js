const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

router.put('/account_merge', withAuth, (req, res) => {
    Container.update({
        account_id: req.body.account_id_2
      },
      {
        where: {
            account_id: req.body.account_id
        }
      })
      .then(dbContainerData => {
        if (!dbContainerData[0]) {
          res.status(404).json({ message: 'This Container does not exist!' });
          return;
        }
        res.json(dbContainerData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/amazon_container/:key', withAuth, async (req, res) => {
  try {
    const singleContainer = await Container.findOne({
      where: {
        container_number: req.params.key
      },
      attributes: [
        'id',
        'user_id',
        'account_id',
        'cost',
        'height',
        'width',
        'length'
      ],
      include: [
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
      const data = singleContainer.get({plain: true});
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/allContainerAdmin', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        status: [0,1,2,3,4,5,98]
      },
      attributes: [
        'user_id',
        'account_id',
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
      ],
      include: [
        {
          model: Item,
          attributes: [
            'id',
            'item_number',
            'qty_per_sku'
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
    const containers = containerData.map(container => container.get({ plain: true }));
    res.json(containers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.put('/updateCost/:cost&:id', withAuth, (req, res) => {
  Container.update({
      cost: req.params.cost
    },
    {
      where: {
        id: req.params.id
      }
    })
    .then(dbContainerData => {
      if (!dbContainerData[0]) {
        res.status(404).json({ message: 'This Container does not exist!' });
        return;
      }
      res.json(dbContainerData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
module.exports = router;
