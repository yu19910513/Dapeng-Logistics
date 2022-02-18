const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Order } = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');



//admin view
router.get('/admin', adminAuth, async (req, res) => {
    try {
      const postData = await Order.findAll({
        attributes: [
          'id',
          'name',
          'content'
        ]
      });

      const posts = postData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

  });


  module.exports = router
