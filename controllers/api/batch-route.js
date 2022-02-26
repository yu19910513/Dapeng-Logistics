const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

router.post('/', withAuth, (req, res) => {
    Batch.create({
      user_id: req.session.user_id,
      account_id: req.body.savedAccount_id,
      asn: req.body.asn,
      pending_date: req.body.pending_date,
      total_box: req.body.total_box
    })
      .then(dbBatchData => res.json(dbBatchData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/new', withAuth, (req, res) => {
  Batch.create({
    user_id: req.session.user_id,
    account_id: req.body.account_id,
    asn: req.body.asn,
    pending_date: req.body.pending_date,
    total_box: req.body.total_box
  })
    .then(dbBatchData => res.json(dbBatchData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
