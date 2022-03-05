const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

//create new batch under the existed account
router.post('/', withAuth, (req, res) => {
    Batch.create({
      user_id: req.session.user_id,
      account_id: req.body.savedAccount_id,
      asn: req.body.asn,
      pending_date: req.body.pending_date,
      total_box: req.body.total_box
    })
      .then(dbBatchData => {
        req.session.save(() => {
          req.session.batch_id = dbBatchData.id;
          res.json(dbBatchData)})
        })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);

      });
});

//create new batch under newly created account
router.post('/new', withAuth, (req, res) => {
  Batch.create({
    user_id: req.session.user_id,
    account_id: req.body.account_id,
    asn: req.body.asn,
    pending_date: req.body.pending_date,
    total_box: req.body.total_box
  })
  .then(dbBatchData => {
    req.session.save(() => {
      req.session.batch_id = dbBatchData.id;
      res.json(dbBatchData)})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
