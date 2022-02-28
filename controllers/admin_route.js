const router = require('express').Router();
const sequelize = require('../config/connection');
const {User, Account, Batch, Box} = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');



//admin view
router.get('/', adminAuth, async (req, res) => {
    try {
      const userData = await User.findAll({
        attributes: [
          'id',
          'name',
          'email',
          'wechat'
        ],
        include: [
          {
            model: Account,
            attributes: [
              'name'
            ]
          },
          {
            model: Batch,
            attributes: [
              'asn',
              'pending_date',
              'total_box'
            ]
          },
          {
            model: Box,
            attributes: [
              'id',
              'box_number',
              'description',
              'cost',
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
              'tracking'
            ]
          }
        ]
      });

      const users = userData.map(user => user.get({ plain: true }));
      res.render('admin', { users, loggedIn: true });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

  });


  module.exports = router
