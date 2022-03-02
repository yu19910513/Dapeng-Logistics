const router = require('express').Router();
const sequelize = require('../config/connection');
const {User, Account, Batch, Box} = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');


router.get('/', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      attributes: [
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



  module.exports = router
