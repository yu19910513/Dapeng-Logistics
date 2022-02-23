const router = require('express').Router();
const sequelize = require('../config/connection');
const {User, Account, Batch, Box} = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
      const boxData = await Box.findAll({
        where: {
          user_id: req.session.user_id
        },
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
          'origin',
          'sku'
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
          }
        ]
      });
      const boxes = boxData.map(box => box.get({ plain: true }));
      res.render('home', { boxes, loggedIn: true, admin: req.session.admin });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/neworder/', withAuth, (req, res) => {
    res.render('neworder', { loggedIn: true })
});

router.get('/signup/', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('signup');
  });


  module.exports = router
