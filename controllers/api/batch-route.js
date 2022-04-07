const router = require('express').Router();
const {User, Account, Batch, Box, Container} = require('../../models');
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
          res.json(dbBatchData)
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
      res.json(dbBatchData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/amazon_box', withAuth, (req, res) => {
  Container.create({
    container_number: req.body.container_number,
    account_id: req.body.account_id,
    user_id: req.body.user_id,
    description: req.body.description,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    volume: req.body.volume,
    received_date: new Date().toLocaleDateString("en-US")
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/amazon_container/:key', withAuth, async (req, res) => {
  try {
    const singleContainer = await Container.findOne({
      where: {
        container_number: req.params.key
      },
      attributes: [
        'id'
      ]
    });
    const data = singleContainer.get({plain: true});
    res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

module.exports = router;
