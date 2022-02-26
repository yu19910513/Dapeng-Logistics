const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

router.post('/', withAuth, (req, res) => {
  Box.create({
    box_number: req.body.box_number,
    bacth_id: req.body.bacth_id,
    account_id: req.body.account_id,
    user_id: req.session.user_id,
    description: req.body.description,
    sku: req.body.sku,
    qty_per_box: req.body.qty_per_box,
    order: req.body.order,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});





  module.exports = router;
