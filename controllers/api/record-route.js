const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item, Record} = require('../../models');
const {withAuth} = require('../../utils/auth');

router.post('/neworder_china', withAuth, (req, res) => {
    Record.create({
        user_id: req.session.user_id,
        ref_number: req.body.ref_number,
        status_to: req.body.status_to,
        action: req.body.action,
        date: req.body.date,
        sub_number: req.body.sub_number
    })
    .then(dbRecordData => {
        res.json(dbRecordData)
      })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);

    });
});
router.post('/request_china', withAuth, (req, res) => {
  Record.create({
      user_id: req.session.user_id,
      ref_number: req.body.ref_number,
      status_from: req.body.status_from,
      status_to: req.body.status_to,
      action: req.body.action,
      date: req.body.date,
      sub_number: req.body.sub_number
  })
  .then(dbRecordData => {
      res.json(dbRecordData)
    })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);

  });
});
module.exports = router;
