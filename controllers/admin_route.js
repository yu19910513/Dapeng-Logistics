const router = require('express').Router();
const sequelize = require('../config/connection');
const {User, Account, Batch, Box} = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');

//admin page
router.get('/', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      attributes: [
        'tracking',
        'batch_id',
        'id',
        'box_number',
        'description',
        'cost',
        'requested_date',
        'received_date',
        'shipped_date',
        'order',
        'qty_per_box',
        'length',
        'width',
        'height',
        'weight',
        'volume',
        'status',
        'location',
        'sku',
        'file',
        'file_2',
      ],
      include: [
        {
          model: Batch,
          attributes: [
            'asn',
            'pending_date',
            'total_box'
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
            'id',
            'name',
            'email',
            'wechat'
          ]
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.render('admin', {
      boxes,
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name,
      shipped_date: req.body.shipped_date,
      received_date: req.body.received_date,
      requested_date: req.body.requested_date
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.get('/batch/:id', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        batch_id: req.params.id
      },
        attributes: [
      'id',
      'box_number',
      'description',
      'cost',
      'received_date',
      'requested_date',
      'shipped_date',
      'order',
      'qty_per_box',
      'length',
      'width',
      'height',
      'weight',
      'volume',
      'status',
      'location',
      'sku',
      'file',
      'file_2',
        ],
          include: [
        {
        model: Batch,
        attributes:
        [
          'asn',
          'pending_date',
          'total_box'
          ]},
        {
          model: Account,
          attributes: [
            'name'
          ]
        }
          ]
    })
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.render('shipping_label', {
      boxes,
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name,
      account: boxes[0].account.name,
      date: boxes[0].batch.pending_date
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/box/:id', withAuth, async (req, res) => {
    try {
      const boxData = await Box.findAll({
        where: {
          box_number: req.params.id
        },
          attributes: [
        'id',
        'box_number',
        'description',
        'cost',
        'received_date',
        'requested_date',
        'shipped_date',
        'order',
        'qty_per_box',
        'length',
        'width',
        'height',
        'weight',
        'volume',
        'status',
        'location',
        'sku',
        'file',
        'file_2',
          ],
            include: [
          {
          model: Batch,
          attributes:
          [
            'asn',
            'pending_date',
            'total_box'
            ]},
          {
            model: Account,
            attributes: [
              'name'
            ]
          }
            ]
      })
      const boxes = boxData.map(box => box.get({ plain: true }));
      res.render('shipping_label', {
        boxes,
        loggedIn: true,
        admin: req.session.admin,
        name: req.session.name,
        account: boxes[0].account.name,
        date: boxes[0].batch.pending_date
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
})

  module.exports = router
