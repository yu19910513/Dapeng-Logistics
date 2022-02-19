const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Order } = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
      const orderData = await Order.findAll({
        where: {
          user_id: req.session.user_id
        },
        attributes: [
          'id',
          'boxNumber',
          'account',
          'date',
          'description',
          'container',
          'box',
          'length',
          'width',
          'height',
          'status'
        ]
      });
      const orders = orderData.map(order => order.get({ plain: true }));
      res.render('home', { orders, loggedIn: true, admin: req.session.admin });

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
